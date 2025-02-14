import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];  // On récupère le token JWT du header Authorization

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    // Décode le token JWT pour récupérer l'ID de l'utilisateur
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'JWT secret non défini' }, { status: 500 });
    }

    // Vérifie si le token est bien formé
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: 'Token invalide ou mal formé' }, { status: 401 });
    }
    console.log("Decoded token:", decoded);

    // Vérification des propriétés du token décodé
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      throw new Error('Le token décodé est invalide.');
    }
    
    // Récupère l'utilisateur dans la base de données
    const user = await prisma.utilisateur.findUnique({
      where: { id: decoded.userId },
    });
    console.log("Fetched user:", user);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
  }
}