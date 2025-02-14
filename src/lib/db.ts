import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getProductsByQuery(query: string) {
  try {
    return await prisma.produit.findMany({
      where: {
        nom: {
          contains: query,
          mode: "insensitive",
        },
      },
    })
  } catch (error) {
    console.error("Error querying database:", error)
    throw error
  }
}

