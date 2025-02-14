import { type NextRequest, NextResponse } from "next/server"
import prisma from "lib/prisma"
import { writeFile, unlink, mkdir } from "fs/promises"
import { join } from "path"
import type { Supplier } from "@prisma/client"

// GET - Récupérer un fournisseur par ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = Number.parseInt(url.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const supplier: Supplier | null = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Fournisseur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Erreur GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Mettre à jour un fournisseur
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = Number.parseInt(url.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const productCategories = formData.get("productCategories") as string;
    const minPurchase = formData.get("minPurchase") as string;
    const deliveryTime = formData.get("deliveryTime") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const logoFile = formData.get("logo");

    if (!name && !productCategories && !minPurchase && !deliveryTime && !phoneNumber && !logoFile) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    const existingSupplier: Supplier | null = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: "Fournisseur non trouvé" }, { status: 404 });
    }

    let logoPath: string | undefined = existingSupplier.logo;

    if (logoFile && logoFile instanceof File) {
      try {
        if (existingSupplier.logo) {
          const oldLogoPath = join(process.cwd(), "public", existingSupplier.logo);
          await unlink(oldLogoPath).catch(() => {});
        }

        const uploadsDir = join(process.cwd(), "public", "supplierLogo");
        await mkdir(uploadsDir, { recursive: true });

        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${logoFile.name.replace(/\s+/g, "-")}`;
        const filePath = join(uploadsDir, fileName);

        await writeFile(filePath, buffer);
        logoPath = `/supplierLogo/${fileName}`;
      } catch (error) {
        console.error("Erreur lors du traitement du fichier:", error);
        return NextResponse.json({ error: "Erreur lors du traitement du logo" }, { status: 500 });
      }
    }

    const updatedSupplier: Supplier = await prisma.supplier.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(productCategories && { productCategories }),
        ...(minPurchase && { minPurchase: Number.parseInt(minPurchase, 10) }),
        ...(deliveryTime && { deliveryTime }),
        ...(phoneNumber && { phoneNumber }),
        ...(logoPath && { logo: logoPath }),
      },
    });

    return NextResponse.json({
      message: "Fournisseur mis à jour avec succès",
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error("Erreur PUT:", error);
    await prisma.$disconnect();
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// DELETE - Supprimer un fournisseur
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = Number.parseInt(url.pathname.split("/").pop() || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const supplier: Supplier | null = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Fournisseur non trouvé" }, { status: 404 });
    }

    if (supplier.logo) {
      try {
        const logoPath = join(process.cwd(), "public", supplier.logo);
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
