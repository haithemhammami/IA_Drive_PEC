import { NextResponse, NextRequest } from "next/server";
import prisma from "lib/prisma";

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const orderId = Number.parseInt(id || "", 10);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "ID de commande invalide" }, { status: 400 });
  }

  const { statusId } = await request.json();

  try {
    const updatedOrder = await prisma.commande.update({
      where: { id: orderId },
      data: { statutId: statusId },
      include: { statut: true },
    });

    // Add status change to history
    await prisma.commandeStatutHistorique.create({
      data: {
        commandeId: orderId,
        statutId: statusId,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

