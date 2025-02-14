import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET_Mail;
    if (!secret) {
      return new Response(JSON.stringify({ error: 'JWT secret manquant' }), { status: 500 });
    }
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    const user = await prisma.utilisateur.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });
    }

    // Marquer l'email comme vérifié
    await prisma.utilisateur.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return new Response(
      JSON.stringify({ emailVerified: true }),
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Erreur lors de la vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 403 });
  }
}