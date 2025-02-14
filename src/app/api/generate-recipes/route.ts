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
    const { ingredients, dish } = await request.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            Tu es une API d'intelligence artificielle utilisée par un Drive alimentaire, spécialisée dans la reconnaissance d'images et la génération de recettes de cuisine.

            🎯 **Tes capacités :**
            - Identifier les **ingrédients** d'un plat à partir d'une **photo** envoyée par l'utilisateur.
            - Proposer des **recettes adaptées** en fonction des ingrédients détectés ou demandés par l'utilisateur.
            - Si un ingrédient **manque** dans la base de produits, envoyer une **alerte à l'administrateur**.
            - Permettre à l'utilisateur d'écrire ce qu'il **a envie de manger aujourd'hui** et suggérer des plats correspondants.
            - Présenter les recettes sous une **forme attrayante**, avec des **étapes numérotées et des instructions bien structurées**.

            📌 **Règles pour tes réponses :**
            - Pour chaque **recette générée**, mets en évidence les **verbes d'action** en les entourant d'un \`<span class="font-bold text-blue-500"></span>\`.
            - Rends tes explications **claires**, avec un **ton amical et engageant**.
            - Si l'utilisateur mentionne un plat sans donner d'ingrédients, devine la recette en fonction de plats populaires et propose plusieurs options.
          `,
        },
        {
          role: "user",
          content: `Génère des suggestions de recettes en utilisant ces ingrédients : ${ingredients.join(", ")}. ${dish ? `Le plat principal devrait être ${dish}.` : ""}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: "Aucune réponse valide de l'API OpenAI" }, { status: 500 })
    }

    const parsedContent = JSON.parse(content)

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error("❌ Erreur lors de la génération des recettes :", error)
    return NextResponse.json({ error: "Erreur lors de la génération des recettes" }, { status: 500 })
  }
}

