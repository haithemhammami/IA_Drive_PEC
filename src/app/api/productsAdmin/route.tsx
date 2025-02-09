import { NextResponse } from "next/server"
import prisma from "lib/prisma"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const nom = formData.get("nom") as string
    const description = formData.get("description") as string
    const prix = Number(formData.get("prix"))
    const stock = Number(formData.get("stock"))
    const categorieId = Number(formData.get("categorieId"))
    const imageFile = formData.get("image")

    if (!nom || !prix || !stock || !categorieId) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis" }, { status: 400 })
    }

    let imagePath: string | null = null

    if (imageFile && imageFile instanceof File) {
      // Vérifier si c'est réellement un fichier image
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json({ error: "Le fichier doit être une image" }, { status: 400 })
      }

      const uploadsDir = join(process.cwd(), "public", "productsImages")
      await mkdir(uploadsDir, { recursive: true })

      const bytes = new Uint8Array(await imageFile.arrayBuffer())
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
      const filePath = join(uploadsDir, fileName)

      await writeFile(filePath, bytes)
      imagePath = `/productsImages/${fileName}`
    }

    // Créer le produit dans la base de données
    const produit = await prisma.produit.create({
      data: {
        nom,
        description,
        prix,
        stock,
        categorieId,
        image: imagePath,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Créer une alerte pour le nouveau produit
    await prisma.alertes.create({
      data: {
        produitId: produit.id,
        message: `Le produit "${produit.nom}" a été ajouté avec un stock de ${produit.stock} unités.`,
        dateAlerte: new Date(),
      },
    })

    return NextResponse.json(produit)
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}

// GET - Récupérer tous les produits
export async function GET() {
  try {
    const produits = await prisma.produit.findMany({
      include: {
        categorie: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(produits)
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const id = Number(formData.get("id"))
    const nom = formData.get("nom") as string
    const description = formData.get("description") as string
    const prix = Number(formData.get("prix"))
    const stock = Number(formData.get("stock"))
    const categorieId = Number(formData.get("categorieId"))
    const imageFile = formData.get("image") as File | null

    if (!id || !nom || !prix || !stock || !categorieId) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis" }, { status: 400 })
    }

    const existingProduct = await prisma.produit.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    let imagePath: string | null = existingProduct.image

    if (imageFile) {
      // Supprimer l'ancienne image si elle existe
      if (existingProduct.image) {
        const oldImagePath = join(process.cwd(), "public", existingProduct.image)
        await unlink(oldImagePath).catch(console.error)
      }

      // S'assurer que le dossier productsImages existe
      const uploadsDir = join(process.cwd(), "public", "productsImages")
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (error) {
        console.error("Erreur création dossier productsImages:", error)
      }

      // Créer un nom de fichier unique
      const bytes = new Uint8Array(await imageFile.arrayBuffer())
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`
      const filePath = join(uploadsDir, fileName)

      await writeFile(filePath, bytes)
      imagePath = `/productsImages/${fileName}`
    }

    // Mettre à jour le produit dans la base de données
    const updatedProduit = await prisma.produit.update({
      where: { id },
      data: {
        nom,
        description,
        prix,
        stock,
        categorieId,
        image: imagePath,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedProduit)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 })
  }
}

// DELETE - Supprimer un produit
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get("id"))

    if (!id) {
      return NextResponse.json({ error: "L'ID du produit est requis" }, { status: 400 })
    }

    const existingProduct = await prisma.produit.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Supprimer l'alerte associée au produit
    await prisma.alertes.deleteMany({
      where: { produitId: id },
    })

    // Supprimer l'image si elle existe
    if (existingProduct.image) {
      const imagePath = join(process.cwd(), "public", existingProduct.image)
      await unlink(imagePath).catch(console.error)
    }

    // Supprimer le produit de la base de données
    await prisma.produit.delete({ where: { id } })

    return NextResponse.json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 })
  }
}

