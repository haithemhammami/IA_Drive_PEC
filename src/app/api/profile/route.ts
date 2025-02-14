import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 401 });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is missing in the environment variables');
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      if (typeof decoded !== 'object' || !decoded || !('userId' in decoded)) {
        console.error('Invalid token payload:', decoded);
        return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
      }
      const userId = (decoded as { userId: number }).userId;
      const user = await prisma.utilisateur.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nom: true,
          email: true,
          adresse: true,
          phone: true,
          role: true,
          dateCreation: true,
          emailVerified: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      console.error('Server error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
