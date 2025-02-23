import { NextRequest } from "next/server";
import { GET } from "@/app/api/orders/user/[utilisateurId]/route"; 
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    commande: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Orders API GET route", () => {
  const mockUserId = 1;
  const mockToken = "mockToken";
  const mockSecret = "mockSecret";

  beforeEach(() => {
    process.env.JWT_SECRET = mockSecret;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("devrait retourner 400 si l'ID utilisateur est invalide", async () => {
    const request = new NextRequest(new URL("http://localhost/api/orders/user/invalid"));
    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("devrait retourner 401 si aucun jeton n'est fourni", async () => {
    const request = new NextRequest(new URL("http://localhost/api/orders/user/1"));
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("devrait retourner 500 si le secret JWT n'est pas défini", async () => {
    delete process.env.JWT_SECRET;
    const request = new NextRequest(new URL("http://localhost/api/orders/user/1"), {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
    const response = await GET(request);
    expect(response.status).toBe(500);
  });

  it("devrait retourner 401 si le jeton est invalide", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error("Invalid token"); });
    const request = new NextRequest(new URL("http://localhost/api/orders/user/1"), {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("devrait retourner 403 si l'ID utilisateur ne correspond pas au jeton", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 2 });
    const request = new NextRequest(new URL("http://localhost/api/orders/user/1"), {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
    const response = await GET(request);
    expect(response.status).toBe(403);
  });

  it("devrait retourner 200 avec les commandes si réussi", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
    (prisma.commande.findMany as jest.Mock).mockResolvedValue([{
      id: 1,
      clientId: mockUserId,
      commandeDetails: [],
      statut: { id: 1, nom: "En cours" },
    }]);
    const request = new NextRequest(new URL("http://localhost/api/orders/user/1"), {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it("devrait retourner 500 si la requête à la base de données échoue", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
    (prisma.commande.findMany as jest.Mock).mockImplementation(() => { throw new Error("DB error"); });
    const request = new NextRequest(new URL("http://localhost/api/orders/user/1"), {
      headers: { Authorization: `Bearer ${mockToken}` },
    });
    const response = await GET(request);
    expect(response.status).toBe(500);
  });
});
