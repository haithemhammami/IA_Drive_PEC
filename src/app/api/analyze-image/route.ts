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
    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json({ error: "❌ Aucun URL d'image fourni." }, { status: 400 })
    }

    console.log("📸 Analyse de l'image en cours...")

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            Vous êtes un assistant IA spécialisé dans l'analyse d'images de nourriture et la création de listes de courses.
            Votre tâche est d'analyser l'image fournie et de générer une réponse JSON valide contenant les informations suivantes :
            - Le plat principal identifié
            - Une liste des ingrédients visibles
            - Une liste d'ingrédients supplémentaires suggérés
            - Une recette simple basée sur les ingrédients identifiés

            Assurez-vous que votre réponse soit un JSON valide, sans backticks (\`\`\`) ni autres marqueurs.
            Utilisez le format suivant :
            {
              "dish": "Nom du plat principal",
              "visibleIngredients": ["ingrédient1", "ingrédient2", ...],
              "suggestedIngredients": ["ingrédient3", "ingrédient4", ...],
              "recipe": {
                "name": "Nom de la recette",
                "ingredients": ["quantité ingrédient1", "quantité ingrédient2", ...],
                "instructions": ["étape 1", "étape 2", ...]
              }
            }
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analysez cette image de nourriture et fournissez les détails demandés en JSON valide.",
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      // max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      console.warn("⚠️ Aucune réponse valide de l'API OpenAI.")
      return NextResponse.json({ error: "Aucune réponse reçue de l'IA." }, { status: 500 })
    }

    console.log("✅ Réponse reçue :", content)

    // Parse the JSON response
    const analysisResult = JSON.parse(content)

    return NextResponse.json(analysisResult)
  } catch (error: any) {
    console.error("❌ Erreur lors de l'analyse de l'image :", error)
    return NextResponse.json({ error: "Erreur lors de l'analyse de l'image" }, { status: 500 })
  }
}

