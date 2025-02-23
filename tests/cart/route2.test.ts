import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/cart/route";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    utilisateur: {
      findUnique: jest.fn(),
    },
    cart: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    produit: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Cart API routes additional tests", () => {
  const mockUserId = 1;
  const mockToken = "mockToken";
  const mockSecret = "mockSecret";

  beforeEach(() => {
    process.env.JWT_SECRET = mockSecret;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 400 if user ID is missing", async () => {
      const request = new NextRequest(new URL("http://localhost/api/cart"));
      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it("should return 404 if no products in cart", async () => {
      (prisma.cart.findMany as jest.Mock).mockResolvedValue([]);
      const request = new NextRequest(new URL("http://localhost/api/cart?utilisateurId=1"));
      const response = await GET(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if products are found in cart", async () => {
      (prisma.cart.findMany as jest.Mock).mockResolvedValue([{ produitId: 1, quantite: 1, prix: 100 }]);
      const request = new NextRequest(new URL("http://localhost/api/cart?utilisateurId=1"));
      const response = await GET(request);
      expect(response.status).toBe(200);
    });
  });

  describe("POST", () => {
    it("should return 401 if user is not logged in", async () => {
      const request = new NextRequest(new URL("http://localhost/api/cart"), {
        method: "POST",
        body: JSON.stringify({ productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should return 400 if productId is missing", async () => {
      const request = new NextRequest(new URL("http://localhost/api/cart"), {
        method: "POST",
        body: JSON.stringify({ utilisateurId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should return 404 if user not found", async () => {
      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/cart"), {
        method: "POST",
        body: JSON.stringify({ utilisateurId: 1, productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should return 404 if product not found", async () => {
      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.produit.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/cart"), {
        method: "POST",
        body: JSON.stringify({ utilisateurId: 1, productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should return 201 if product is added to cart", async () => {
      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.produit.findUnique as jest.Mock).mockResolvedValue({ id: 1, prix: 100, image: "image.jpg" });
      (prisma.cart.create as jest.Mock).mockResolvedValue({ id: 1, quantite: 1, prix: 100, image: "image.jpg" });
      const request = new NextRequest(new URL("http://localhost/api/cart"), {
        method: "POST",
        body: JSON.stringify({ utilisateurId: 1, productId: 1 }),
      });
      const response = await POST(request);
      expect(response.status).toBe(201);
    });
  });
});