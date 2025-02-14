import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Fonction d'authentification avec JWT pour récupérer l'utilisateur
const authenticateUser = async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error('Authorization header is missing');
    return null;
  }

  const token = authHeader.split(' ')[1]; // Extraire le token de l'en-tête
  if (!token) {
    console.error('Token is missing in the Authorization header');
    return null; // Retourner null si le token n'est pas présent
  }

  // Vérifier si la clé secrète JWT est définie dans l'environnement
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('La clé secrète JWT est manquante dans les variables d\'environnement');
  }

  try {
    const decoded: any = jwt.verify(token, secretKey);
    const user = await prisma.utilisateur.findUnique({
      where: { id: decoded.userId },
    });
    return user;
  } catch (error: unknown) {
    // Vérification du type d'erreur
    if (error instanceof Error) {
      console.error('Error verifying token:', error.message);
      return null; // Retourner null si l'utilisateur n'est pas authentifié ou si le token est invalide
    } else {
      throw new Error('Erreur inconnue lors de la vérification du token');
    }
  }
};

export async function PUT(req: Request) {
  // Authentifier l'utilisateur avec JWT
  let user;
  try {
    user = await authenticateUser(req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Authentication error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erreur inconnue' }, { status: 500 });
    }
  }

  // Vérifier si l'utilisateur est authentifié
  if (!user) {
    console.error('User not authenticated');
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // Extraire les données du corps de la requête
  const { email, password, currentPassword, telephone, adresse } = await req.json();

  // Validation des champs requis
  const missingFields: string[] = [];
  if (!email) missingFields.push('email');
  if (!telephone) missingFields.push('telephone');
  if (!adresse) missingFields.push('adresse');
  if (!currentPassword) missingFields.push('currentPassword');

  // Vérification des champs manquants
  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Les champs suivants sont obligatoires : ${missingFields.join(', ')}.` },
      { status: 400 }
    );
  }

  // Validation du format du téléphone
  if (!/^\d{10}$/.test(telephone)) {
    return NextResponse.json(
      { error: 'Le numéro de téléphone doit contenir exactement 10 chiffres.' },
      { status: 400 }
    );
  }

  // Vérification si l'email est déjà utilisé par un autre utilisateur
  const existingUserWithEmail = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
    return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
  }

  // Vérification du mot de passe actuel
  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Le mot de passe actuel est incorrect.' }, { status: 400 });
  }

  // Si un nouveau mot de passe est fourni, on le hache
  let passwordHash = user.passwordHash;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10); // Hachage du mot de passe
  }

  // Mise à jour des informations de l'utilisateur dans la base de données
  try {
    const updatedUser = await prisma.utilisateur.update({
      where: { id: user.id },
      data: {
        email,
        passwordHash,
        phone: telephone,
        adresse,
      },
    });

    // Retourner les informations de l'utilisateur mises à jour
    return NextResponse.json(updatedUser); 
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erreur inconnue lors de la mise à jour du profil.' }, { status: 500 });
    }
  }
}
