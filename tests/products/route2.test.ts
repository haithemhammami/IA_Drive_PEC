import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/products/route";
import { prisma } from "@/lib/prisma";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    produit: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("Product API routes additional tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 200 and all products if no ingredients are provided", async () => {
      const mockProducts = [
        { id: 1, nom: "Product 1", categorie: { nom: "Category 1" } },
        { id: 2, nom: "Product 2", categorie: { nom: "Category 2" } },
      ];
      (prisma.produit.findMany as jest.Mock).mockResolvedValue(mockProducts);
      const request = new NextRequest(new URL("http://localhost/api/products"));
      const response = await GET(request);
      expect(response.status).toBe(200);
      const jsonResponse = await response.json();
      expect(jsonResponse.products).toEqual(mockProducts);
    });

    it("should return 200 and filtered products if ingredients are provided", async () => {
      const mockProducts = [
        { id: 1, nom: "Product 1", categorie: { nom: "Category 1" } },
        { id: 2, nom: "Product 2", categorie: { nom: "Category 2" } },
      ];
      (prisma.produit.findMany as jest.Mock).mockResolvedValue(mockProducts);
      const request = new NextRequest(new URL("http://localhost/api/products?ingredients=Product"));
      const response = await GET(request);
      expect(response.status).toBe(200);
      const jsonResponse = await response.json();
      expect(jsonResponse.products).toEqual(mockProducts);
    });

    it("should return 500 if there is a server error", async () => {
      (prisma.produit.findMany as jest.Mock).mockRejectedValue(new Error("Server error"));
      const request = new NextRequest(new URL("http://localhost/api/products"));
      const response = await GET(request);
      expect(response.status).toBe(500);
    });
  });

  describe("POST", () => {
    it("should return 404 if product is not found", async () => {
      (prisma.produit.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/products"), {
        method: "POST",
        body: JSON.stringify({ productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if product is added to cart successfully", async () => {
      const mockProduct = { id: 1, nom: "Test Product" };
      (prisma.produit.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      const request = new NextRequest(new URL("http://localhost/api/products"), {
        method: "POST",
        body: JSON.stringify({ productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("should return 500 if there is a server error", async () => {
      (prisma.produit.findUnique as jest.Mock).mockRejectedValue(new Error("Server error"));
      const request = new NextRequest(new URL("http://localhost/api/products"), {
        method: "POST",
        body: JSON.stringify({ productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
