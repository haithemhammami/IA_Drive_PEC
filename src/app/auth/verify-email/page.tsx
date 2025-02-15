'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Vérification en cours...');
  const router = useRouter();
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setMessage('Token de vérification manquant.');
        messageRef.current?.focus();
        return;
      }

      const res = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.emailVerified) {
          setMessage('Email vérifié avec succès. Redirection...');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setMessage('Échec de la vérification de l\'email.');
        }
      } else {
        const errorData = await res.json();
        setMessage(`Erreur: ${errorData.error}`);
      }
      messageRef.current?.focus();
    };

    verifyToken();
  }, [router]);

  return (
    <div>
      <h1>Vérifiez votre email</h1>
      <p ref={messageRef} tabIndex={-1} aria-live="polite">{message}</p>
    </div>
  );
}