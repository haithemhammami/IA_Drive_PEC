import { NextResponse } from "next/server";
import prisma from 'lib/prisma';
import path from "path";
import fs from "fs/promises";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.produit.findUnique({
      where: { id: parseInt(params.id) },
      include: { images: true, categorie: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product." }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updatedProduct = await prisma.produit.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json({ updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Delete product and associated images
    const product = await prisma.produit.delete({
      where: { id: parseInt(params.id) },
      include: { images: true },
    });

    // Remove images from the file system
    for (const image of product.images) {
      const filePath = path.join(process.cwd(), "public", image.url);
      await fs.unlink(filePath).catch(() => {});
    }

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
