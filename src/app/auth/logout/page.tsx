'use client';

import { useEffect } from 'react';

const LogoutPage = () => {
  useEffect(() => {
    const logout = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Effectuer l'appel API pour la déconnexion
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        // Supprimer le token localStorage
        localStorage.removeItem('token');
      }

      // Redirection vers la page de connexion
      window.location.href = '/auth/login';
    };

    logout();
  }, []);

  return <p>Déconnexion en cours...</p>;
};

export default LogoutPage;
