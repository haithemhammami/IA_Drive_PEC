import { NextRequest, NextResponse } from "next/server"
import prisma from "lib/prisma"
import { writeFile, unlink, mkdir } from "fs/promises"
import { join } from "path"
import type { Produit } from "@prisma/client"

// GET - Récupérer un produit par ID
export async function GET(request: NextRequest) {
  try {
    const id = Number.parseInt(request.nextUrl.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const produit = await prisma.produit.findUnique({
      where: { id },
      include: {
        categorie: true,
      },
    })

    if (!produit) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(produit)
  } catch (error) {
    console.error("Erreur GET:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: NextRequest) {
  try {
    const id = Number.parseInt(request.nextUrl.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const formData = await request.formData()
    const updateData: Partial<Produit> = {}

    // Récupérer et valider chaque champ
    const nom = formData.get("nom")
    const description = formData.get("description")
    const prix = formData.get("prix")
    const stock = formData.get("stock")
    const categorieId = formData.get("categorieId")
    const imageFile = formData.get("image") as File | null

    // Mettre à jour les champs seulement s'ils sont présents et valides
    if (typeof nom === "string" && nom.trim() !== "") updateData.nom = nom
    if (typeof description === "string") updateData.description = description
    if (prix && !isNaN(Number(prix))) updateData.prix = Number(prix)
    if (stock && !isNaN(Number(stock))) updateData.stock = Number(stock)
    if (categorieId && !isNaN(Number(categorieId))) updateData.categorieId = Number(categorieId)

    // Récupérer le produit existant
    const existingProduit = await prisma.produit.findUnique({
      where: { id },
    })

    if (!existingProduit) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Traiter l'image si une nouvelle est fournie
    if (imageFile && imageFile instanceof File) {
      try {
        // Supprimer l'ancienne image si elle existe
        if (existingProduit.image) {
          const oldImagePath = join(process.cwd(), "public", existingProduit.image)
          try {
            await unlink(oldImagePath)
          } catch (error) {
            console.error("Erreur lors de la suppression de l'ancienne image:", error)
          }
        }

        // Créer le dossier s'il n'existe pas
        const uploadsDir = join(process.cwd(), "public", "productsImages")
        await mkdir(uploadsDir, { recursive: true })

        // Générer un nom de fichier unique
        const uniqueFileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
        const newFilePath = join(uploadsDir, uniqueFileName)

        // Lire et écrire le nouveau fichier
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await writeFile(newFilePath, buffer)

        // Ajouter le nouveau chemin d'image aux données de mise à jour
        updateData.image = `/productsImages/${uniqueFileName}`
      } catch (error) {
        console.error("Erreur lors du traitement de l'image:", error)
        return NextResponse.json({ error: "Erreur lors du traitement de l'image" }, { status: 500 })
      }
    }

    // Ajouter automatiquement la date de mise à jour
    updateData.updatedAt = new Date()

    // Effectuer la mise à jour dans la base de données
    const updatedProduit = await prisma.produit.update({
      where: { id },
      data: updateData,
    })

    // Check if stock has changed and trigger alert check if necessary
    if (updateData.stock !== undefined && updateData.stock !== existingProduit.stock) {
      await checkStockLevels(updatedProduit.id, updatedProduit.stock)
    }

    return NextResponse.json({
      message: "Produit mis à jour avec succès",
      produit: updatedProduit,
    })
  } catch (error) {
    console.error("Erreur PUT:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

async function checkStockLevels(productId: number, newStock: number) {
  const lowStockThreshold = 10

  try {
    // Fetch the product to get its name
    const product = await prisma.produit.findUnique({
      where: { id: productId },
    })

    if (!product) {
      console.error(`Product with id ${productId} not found`)
      return
    }

    const alertType = newStock === 0 ? "OUT_OF_STOCK" : newStock <= lowStockThreshold ? "LOW_STOCK" : "STOCK_RECOVERED"

    const message =
      newStock === 0
        ? `Le produit "${product.nom}" est en rupture de stock. Veuillez réapprovisionner rapidement.`
        : newStock <= lowStockThreshold
          ? `Le stock du produit "${product.nom}" est bas (${newStock} unités restantes). Pensez à réapprovisionner.`
          : `Le produit "${product.nom}" est à nouveau disponible en quantité suffisante (${newStock} unités).`

    const alertState = await prisma.productAlertState.findUnique({
      where: { produitId: productId },
    })

    if (!alertState || alertState.lastAlertType !== alertType) {
      // Find existing alert for this product
      const existingAlert = await prisma.alertes.findFirst({
        where: { produitId: productId },
      })

      if (existingAlert) {
        // Update existing alert
        await prisma.alertes.update({
          where: { id: existingAlert.id },
          data: {
            message,
            dateAlerte: new Date(),
          },
        })
      } else {
        // Create new alert
        await prisma.alertes.create({
          data: {
            produitId: productId,
            message,
            dateAlerte: new Date(),
          },
        })
      }

      // Update the alert state
      await prisma.productAlertState.upsert({
        where: { produitId: productId },
        update: {
          lastAlertType: alertType,
          lastAlertDate: new Date(),
        },
        create: {
          produitId: productId,
          lastAlertType: alertType,
          lastAlertDate: new Date(),
        },
      })
    }
  } catch (error) {
    console.error("Error checking stock levels:", error)
  }
}

// DELETE - Supprimer un produit
export async function DELETE(request: NextRequest) {
  try {
    const id = Number.parseInt(request.nextUrl.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Récupérer le produit pour obtenir le chemin de l'image
    const produit = await prisma.produit.findUnique({
      where: { id },
    })

    if (!produit) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Supprimer l'image si elle existe
    if (produit.image) {
      try {
        const imagePath = join(process.cwd(), "public", produit.image)
        await unlink(imagePath)
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error)
      }
    }

    // Supprimer le produit
    await prisma.produit.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Produit supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur DELETE:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

