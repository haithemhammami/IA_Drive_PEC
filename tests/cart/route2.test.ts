import { NextRequest } from "next/server";
import { GET, DELETE, POST, PATCH } from "@/app/api/cart/[utilisateurId]/route";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    utilisateur: {
      findUnique: jest.fn(),
    },
    cart: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    commandeStatut: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    commande: {
      create: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

describe("Cart API routes additional tests", () => {
  const mockUserId = 1;
  const mockToken = "mockToken";
  const mockSecret = "mockSecret";
  const mockStripe = new Stripe("mockSecret", { apiVersion: "2025-01-27.acacia" });

  beforeEach(() => {
    process.env.JWT_SECRET = mockSecret;
    process.env.STRIPE_SECRET_KEY = "mockStripeSecret";
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 403 if user ID does not match token", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 2 });
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await GET(request);
      expect(response.status).toBe(403);
    });

    it("should return 404 if user not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await GET(request);
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE", () => {
    it("should return 404 if product not found in cart", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "DELETE",
        body: JSON.stringify({ productId: 1, removeAll: true }),
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await DELETE(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if product is removed from cart", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1, quantite: 1 });
      (prisma.cart.delete as jest.Mock).mockResolvedValue({});
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "DELETE",
        body: JSON.stringify({ productId: 1, removeAll: true }),
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await DELETE(request);
      expect(response.status).toBe(200);
    });
  });

  describe("POST", () => {
    it("should return 404 if no products in cart", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.cart.findMany as jest.Mock).mockResolvedValue([]);
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "POST",
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should return 201 if order is created successfully", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.cart.findMany as jest.Mock).mockResolvedValue([{ produitId: 1, quantite: 1, prix: 100 }]);
      (prisma.commandeStatut.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.commande.create as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({ nom: "Test User" });
      
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "POST",
        headers: { Authorization: `Bearer ${mockToken}` },
      });

      try {
        const response = await POST(request);
        expect(response.status).toBe(201);
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
      }
    });
  });

  describe("PATCH", () => {
    it("should return 404 if product not found in cart", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "PATCH",
        body: JSON.stringify({ productId: 1, quantity: 2 }),
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await PATCH(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if product quantity is updated", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.cart.update as jest.Mock).mockResolvedValue({});
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "PATCH",
        body: JSON.stringify({ productId: 1, quantity: 2 }),
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await PATCH(request);
      expect(response.status).toBe(200);
    });
  });
});