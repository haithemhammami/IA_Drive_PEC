"use client";
import { useState, FormEvent, useEffect } from 'react';

export default function Home() {
  const [userMessage, setUserMessage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai_shoper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data.response);
        setSuggestedProducts(data.products || []);
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

  useEffect(() => {
    console.log("Produits suggérés :", suggestedProducts);
  }, [suggestedProducts]);

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
          <h2>Produits disponibles en stock :</h2>
          <ul>
            {suggestedProducts.map((product) => (
              <li key={product.id}>
                <strong>{product.nom}</strong> - {product.description}
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
