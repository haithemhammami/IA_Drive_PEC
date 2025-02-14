import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
//import { PrismaClient } from "@prisma/client";

// Utiliser une seule instance de Prisma pour éviter les connexions multiples
//const prisma = new PrismaClient();

export async function middleware(req: NextRequest) {
  console.log("Middleware exécuté pour :", req.nextUrl.pathname); // 🔍 Vérification

  // Vérifier si la requête concerne une route protégée
  if (req.nextUrl.pathname.startsWith("/dashboard/") || req.nextUrl.pathname.startsWith("/api/")) {
    console.log("Vérification de l'authentification...");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("Redirection: Aucun token fourni ou format invalide");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const token = authHeader.split(" ")[1];

    try {
      // Validation du token
      const decodedToken = validateToken(token);

      console.log("Decoded Token:", decodedToken);

      // Vérifier si l'utilisateur est authentifié
      if (!decodedToken) {
        console.warn("Redirection: Utilisateur non authentifié.");
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Vérifier le rôle de l'utilisateur
      if (decodedToken.role === "CLIENT") {
        console.warn("Redirection: L'utilisateur est un client et tente d'accéder à une route admin.");
        return NextResponse.redirect(new URL("/", req.url)); // Rediriger les clients
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur de vérification du token:", error.message);
      } else {
        console.error("Erreur de vérification du token:", error);
      }
      return NextResponse.redirect(new URL("/", req.url)); // Rediriger en cas d'erreur
    }
  }

  return NextResponse.next();
}

// Fonction de validation du token
const validateToken = (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET est manquant dans le fichier .env");
    }

    // Décodage du token JWT
    const decodedToken = jwt.verify(token, secretKey) as { userId: string, role: string };
    return decodedToken;
  } catch (error : unknown) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    throw new Error("Token invalide ou expiré");
  }
};

// Spécifier sur quelles routes ce middleware s'applique
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/api/:path*"
  ],
};

