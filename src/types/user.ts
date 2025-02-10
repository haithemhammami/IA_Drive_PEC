export interface User {
    id: number;
    nom: string;
    email: string;
    passwordHash: string;
    adresse?: string;
    phone?: string;
    resetToken?: string;
    isActive: boolean;
    role: string;
    dateCreation: string;
    emailVerified: boolean;
    updatedAt: string;
  }