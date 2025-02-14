"use client";
import { useState, FormEvent } from 'react';

export default function Home() {
  const [userMessage, setUserMessage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Envoi du message à l'API Next.js pour récupérer la réponse de l'IA
      const response = await fetch('/api/ai_shoper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data.response);
        setSuggestedProducts(data.products || []); // Mise à jour des produits suggérés
      } else {
        setAiResponse('Erreur de l\'IA, essayez à nouveau.');
      }
    } catch (error) {
      setAiResponse('Erreur lors de la communication avec le serveur.');
    }

    setIsLoading(false);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Produit ajouté au panier');
      } else {
        alert(data.error || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      alert('Erreur lors de la communication avec le serveur.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat avec AI_shoper</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          rows={4}
          cols={50}
          placeholder="Tapez votre message..."
          disabled={isLoading}
        />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement...' : 'Envoyer'}
        </button>
      </form>
      {aiResponse && (
        <div style={{ marginTop: '20px', padding: '10px' }}>
          <strong>AI_shoper:</strong>
          <p>{aiResponse}</p>
        </div>
      )}
      {suggestedProducts.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px' }}>
          <h2>Produits suggérés:</h2>
          <ul>
            {suggestedProducts.map((product) => (
              <li key={product.id}>
                {product.nom} - {product.description}
                {/* Affichage d'autres informations selon vos besoins */}
                {product.categorie && <p>Catégorie: {product.categorie.nom}</p>}
                <button onClick={() => handleAddToCart(product.id)}>Ajouter au panier</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
