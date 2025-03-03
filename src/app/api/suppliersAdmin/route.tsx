import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { writeFile, unlink } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany()
    return NextResponse.json(suppliers)
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Error fetching suppliers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const productCategories = formData.get("productCategories") as string
    const minPurchase = Number.parseInt(formData.get("minPurchase") as string)
    const deliveryTime = formData.get("deliveryTime") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const logo = formData.get("logo") as File

    let logoPath = ""
    if (logo) {
      const bytes = await logo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${logo.name}`
      const filepath = path.join(process.cwd(), "public", "supplierLogo", filename)
      await writeFile(filepath, buffer)
      logoPath = `/supplierLogo/${filename}`
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        productCategories,
        minPurchase,
        deliveryTime,
        phoneNumber,
        logo: logoPath,
      },
    })
    return NextResponse.json(newSupplier, { status: 201 })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ error: "Error creating supplier" }, { status: 500 })
  }
}

// DELETE - Supprimer un fournisseur
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = Number.parseInt(url.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Fournisseur non trouvé" }, { status: 404 });
    }

    if (supplier.logo) {
      try {
        const logoPath = path.join(process.cwd(), "public", supplier.logo);
        await unlink(logoPath).catch(() => {});
      } catch (error) {
        console.error("Erreur lors de la suppression du logo:", error);
      }
    }

    await prisma.supplier.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Fournisseur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE:", error);
    await prisma.$disconnect();
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

