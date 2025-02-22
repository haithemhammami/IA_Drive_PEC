import { GET } from "@/app/api/ordersAdmin/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    commande: {
      findMany: jest.fn(),
    },
  },
}));

describe("Orders Admin API", () => {
  const mockOrders = [
    { id: 26, statutId: 2, createdAt: "2025-02-15T22:31:07.911Z", statut: { id: 2, statut: "en preparation", createdAt: "2025-02-10T10:10:44.395Z", updatedAt: "2025-02-10T10:58:25.582Z" }, clientId: 11, total: 21.5, updatedAt: "2025-02-15T22:31:07.912Z" },
    { id: 21, statutId: 5, createdAt: "2025-02-14T18:22:12.643Z", statut: { id: 5, statut: "livrée", createdAt: "2025-02-10T17:17:15.120Z", updatedAt: "2025-02-10T18:17:09.000Z" }, clientId: 7, total: 2019.6551, updatedAt: "2025-02-15T13:54:41.366Z" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return orders with status 2, 4, or 5", async () => {
    (prisma.commande.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const request = new NextRequest("http://localhost/api/ordersAdmin");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOrders);
  });

  it("should return 500 on database error", async () => {
    (prisma.commande.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/ordersAdmin");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Internal Server Error" });
  });

  it("should call findMany with correct filters", async () => {
    const request = new NextRequest("http://localhost/api/ordersAdmin");
    await GET(request);

    expect(prisma.commande.findMany).toHaveBeenCalledWith({
      where: {
        statutId: { in: [2, 4, 5] },
      },
      include: {
        statut: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
});
