import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log('Received request:', req);

    // Extraction des données JSON de la requête
    const { email, password } = await req.json();
    console.log('Parsed request body:', { email, password });

    // Vérification si l'email et le mot de passe sont fournis
    if (!email || !password) {
      console.error('Email et mot de passe requis.');
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
    }

    // Recherche de l'utilisateur dans la base de données par email
    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });
    console.log('Fetched user:', user);

    // Si l'utilisateur n'est pas trouvé
    if (!user) {
      console.error('Utilisateur non trouvé.');
      return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
    }

    // Vérification de la validation de l'email
    if (!user.emailVerified) {
      console.error('Veuillez vérifier votre email avant de vous connecter.');
      return NextResponse.json({ error: 'Veuillez vérifier votre email avant de vous connecter.' }, { status: 403 });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      console.error('Mot de passe incorrect.');
      return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
    }

    // Vérification de la clé secrète pour le JWT
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET est manquant dans le fichier .env');
    }

    // Vérification des propriétés de l'utilisateur
    if (!user.id || !user.role) {
      throw new Error('Les informations utilisateur sont manquantes ou invalides.');
    }

    // Génération du token JWT
    const tokenPayload = { userId: user.id, role: user.role };
    const token = jwt.sign(
      tokenPayload,
      secretKey,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);

    // Création de la session dans la base de données
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });
    console.log('Deleted old sessions for user:', user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expiration dans 1 heure
      },
    });
    console.log('Created new session for user:', user.id);

    // Réponse avec le token et l'utilisateur
    return NextResponse.json({ token, user }, { status: 200 });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}