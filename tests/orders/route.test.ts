import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/orders/[orderId]/route";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    commande: {
      findUnique: jest.fn(),
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
        create: jest.fn().mockResolvedValue({ url: "http://mock-url.com" }),
      },
    },
  }));
});

describe("Order API routes", () => {
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
    it("should return 400 if order ID is invalid", async () => {
      const request = new NextRequest(new URL("http://localhost/api/orders/invalid-id"));
      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it("should return 401 if no token is provided", async () => {
      const request = new NextRequest(new URL("http://localhost/api/orders/1"));
      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it("should return 404 if order is not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.commande.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/orders/1"), {
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await GET(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if order is found", async () => {
      const mockOrder = { id: 1, clientId: mockUserId, commandeDetails: [], client: {}, statut: {} };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.commande.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      const request = new NextRequest(new URL("http://localhost/api/orders/1"), {
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await GET(request);
      expect(response.status).toBe(200);
      const jsonResponse = await response.json();
      expect(jsonResponse).toEqual(mockOrder);
    });
  });

  describe("POST", () => {
    it("should return 400 if order ID is invalid", async () => {
      const request = new NextRequest(new URL("http://localhost/api/orders/invalid-id"), {
        method: "POST",
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should return 401 if no token is provided", async () => {
      const request = new NextRequest(new URL("http://localhost/api/orders/1"), {
        method: "POST",
      });
      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it("should return 404 if order is not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.commande.findUnique as jest.Mock).mockResolvedValue(null);
      const request = new NextRequest(new URL("http://localhost/api/orders/1"), {
        method: "POST",
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await POST(request);
      expect(response.status).toBe(404);
    });

    it("should return 200 if payment session is created successfully", async () => {
      const mockOrder = { id: 1, clientId: mockUserId, commandeDetails: [{ produit: { nom: "Test Product" }, prixUnitaire: 100, quantite: 1 }], client: {}, statut: {} };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.commande.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      const request = new NextRequest(new URL("http://localhost/api/orders/1"), {
        method: "POST",
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("should return 500 if there is a server error", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
      (prisma.commande.findUnique as jest.Mock).mockRejectedValue(new Error("Server error"));
      const request = new NextRequest(new URL("http://localhost/api/orders/1"), {
        method: "POST",
        headers: { Authorization: `Bearer ${mockToken}` },
      });
      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
