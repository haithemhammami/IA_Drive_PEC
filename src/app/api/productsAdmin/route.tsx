import { NextResponse } from "next/server";
import prisma from 'lib/prisma';
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    const products = await prisma.produit.findMany({
      include: { images: true, categorie: true },
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const nom = data.get("nom") as string;
    const description = data.get("description") as string | null;
    const prix = parseFloat(data.get("prix") as string);
    const stock = parseInt(data.get("stock") as string, 10);
    const categorieId = parseInt(data.get("categorieId") as string, 10);
    const images = data.getAll("images") as File[];

    // Save images to `public/productsImages`
    const imagePaths = [];
    for (const image of images) {
      const buffer = await image.arrayBuffer();
      const filePath = path.join(process.cwd(), "public/productsImages", image.name);
      await fs.writeFile(filePath, Buffer.from(buffer));
      imagePaths.push(`/productsImages/${image.name}`);
    }

    // Create product in the database
    const product = await prisma.produit.create({
      data: {
        nom,
        description,
        prix,
        stock,
        categorieId,
        images: { create: imagePaths.map((path) => ({ url: path })) },
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
