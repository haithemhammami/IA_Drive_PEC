import { NextRequest } from "next/server";
import { GET } from "@/app/api/products/[productId]/route";
import { prisma } from "@/lib/prisma";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    produit: {
      findUnique: jest.fn(),
    },
  },
}));

describe("Product API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 400 if product ID is missing", async () => {
      const request = new NextRequest(new URL("http://localhost/api/products/"));
      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it("should return 400 if product ID is invalid", async () => {
      const request = new NextRequest(new URL("http://localhost/api/products/invalid-id"));
      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it("should return 404 if product is not found", async () => {
      (prisma.produit.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/products/1"));
      const response = await GET(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if product is found", async () => {
      const mockProduct = { id: 1, nom: "Test Product", categorie: { nom: "Test Category" } };
      (prisma.produit.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      const request = new NextRequest(new URL("http://localhost/api/products/1"));
      const response = await GET(request);
      expect(response.status).toBe(200);
      const jsonResponse = await response.json();
      expect(jsonResponse).toEqual(mockProduct);
    });
  });
});
