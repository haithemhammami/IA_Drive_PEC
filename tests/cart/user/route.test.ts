import { NextRequest } from "next/server";
import { GET, DELETE, POST } from "@/app/api/cart/[utilisateurId]/route";
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
      deleteMany: jest.fn(),
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
}));;

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
});;

describe("Cart API routes", () => {
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
    it("should return 401 if no token is provided", async () => {
      const request = new NextRequest(new URL("http://localhost/api/cart/1"));
      const response = await GET(request);
      expect(response.status).toBe(401);
    });

  });

  describe("DELETE", () => {
    it("should return 401 if no token is provided", async () => {
      const request = new NextRequest(new URL("http://localhost/api/cart/1"), {
        method: "DELETE",
        body: JSON.stringify({ productId: 1, removeAll: true }),
      });
      const response = await DELETE(request);
      expect(response.status).toBe(401);
    });

  });

  describe("POST", () => {
    it("should return 401 if no token is provided", async () => {
      const request = new NextRequest(new URL("http://localhost/api/cart/1"));
      const response = await POST(request);
      expect(response.status).toBe(401);
    });

  });
});
