import { NextResponse } from "next/server"
import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ Clé API OpenAI manquante. Assurez-vous de l'ajouter dans votre fichier .env !")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { messages, currentDish, detectedIngredients, suggestedIngredients, missingIngredients } =
      await request.json()

    if (!Array.isArray(messages) || messages.length === 0 || !messages.every((m) => m.role && m.content)) {
      return NextResponse.json({ error: "Format de messages invalide" }, { status: 400 })
    }

    const systemMessage = `
      Vous êtes un assistant culinaire intelligent pour un service de livraison de courses. Vos tâches incluent :
      1. Suggérer des idées de repas basées sur les préférences de l'utilisateur.
      2. Fournir des recettes détaillées avec ingrédients et quantités.
      3. Aider à créer des listes de courses basées sur les recettes ou les ingrédients manquants.
      4. Répondre aux questions sur la cuisine et les aliments.
      5. Gérer les demandes d'achat de produits.

      Contexte actuel :
      - Plat actuel : ${currentDish || "Aucun plat spécifié"}
      - Ingrédients détectés : ${detectedIngredients?.join(", ") || "Aucun"}
      - Ingrédients suggérés : ${suggestedIngredients?.join(", ") || "Aucun"}
      - Ingrédients manquants : ${missingIngredients?.join(", ") || "Aucun"}

      Règles importantes :
      - Soyez toujours poli et amical dans vos réponses.
      - Si on vous demande une recette, fournissez toujours les ingrédients avec leurs quantités et les étapes de préparation.
      - Utilisez des emojis appropriés pour rendre la conversation plus engageante.
      - Si l'utilisateur demande d'acheter des produits, répondez positivement et demandez confirmation avant de les rediriger.
      - Si l'utilisateur change de plat, mettez à jour le contexte en conséquence.
      - Mentionnez les ingrédients manquants et suggérez des alternatives si possible.
      - Si l'utilisateur pose une question générale sur la cuisine, répondez de manière informative et encouragez-le à poser d'autres questions.

      IMPORTANT: Votre réponse DOIT être un JSON valide, sans aucun texte supplémentaire avant ou après.
      N'incluez PAS de backticks (\`\`\`) ni d'autres marqueurs dans votre réponse.

      Format JSON pour la réponse :
      {
        "message": "Votre message convivial ici",
        "recipe": {
          "name": "Nom de la recette",
          "ingredients": ["quantité ingrédient1", "quantité ingrédient2", ...],
          "instructions": ["étape 1", "étape 2", ...]
        },
        "products": ["Nom du produit 1", "Nom du produit 2", ...],
        "purchaseRequest": ["Nom du produit 1", "Nom du produit 2", ...],
        "newDish": "Nouveau plat si changé"
      }
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemMessage }, ...messages],
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: "Aucune réponse valide de l'API OpenAI" }, { status: 500 })
    }

    let parsedContent

    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      console.error("❌ Erreur lors de l'analyse de la réponse JSON :", parseError)
      return NextResponse.json({ error: "Erreur lors de l'analyse de la réponse de l'IA" }, { status: 500 })
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error("❌ Erreur dans le chat :", error)
    return NextResponse.json({ error: "Erreur lors du traitement de la requête de chat" }, { status: 500 })
  }
}

