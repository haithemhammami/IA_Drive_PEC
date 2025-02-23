import { OpenAI } from 'openai';
import { prisma } from '@/lib/prisma';



export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
  try {
    // Extraire le message envoyé dans la requête
    const { message }: { message: string } = await req.json();

    // Appel à l'API OpenAI pour générer une réponse
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    const aiResponse = response.choices[0].message.content ?? '';

    // Vérifier si le message demande une recette ou des ingrédients
    if (message.toLowerCase().includes('ingrédient') || message.toLowerCase().includes('recette')) {
      const ingredients = extractIngredients(aiResponse);

      // Rechercher les produits dans la base de données
      const products = await prisma.produit.findMany({
        where: {
          OR: ingredients.map((ingredient) => ({
            OR: [
              {
                nom: {
                  contains: ingredient,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: ingredient,
                  mode: 'insensitive',
                },
              },
            ],
          })),
        },
        include: {
          categorie: true,
        },
      });

      return new Response(
        JSON.stringify({ response: aiResponse, products }),
        { status: 200 }
      );
    }

    // Retourner la réponse générée par OpenAI
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la communication avec l\'API OpenAI:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la communication avec l\'API OpenAI.' }),
      { status: 500 }
    );
  }
}

// Fonction améliorée pour extraire les ingrédients de la réponse de l'IA
function extractIngredients(aiResponse: string): string[] {
    // Convertir la réponse en minuscules et supprimer la ponctuation
    const text = aiResponse.toLowerCase().replace(/[,.]/g, '');
  
    // Liste d'ingrédients communs
    const ingredientPatterns = [
      'farine', 'levure', 'eau', 'huile d\'olive', 'sauce tomate', 'ail',
      'mozzarella', 'parmesan', 'poivrons', 'oignons', 'champignons',
      'olives', 'épinards', 'tomates', 'ananas', 'bacon', 'pepperoni',
      'poulet', 'saucisse', 'jambon', 'artichauts', 'jalapeños', 'anchois',
    ];
  
    // Extraire les ingrédients présents dans la réponse de l'IA
    return ingredientPatterns.filter(ingredient => text.includes(ingredient));
}
