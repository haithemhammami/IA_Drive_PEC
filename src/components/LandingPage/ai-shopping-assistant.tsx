"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, Camera, Upload, Send, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface Message {
  type: "assistant" | "user"
  content: string
}

interface Ingredient {
  name: string
  quantity?: string
  unit?: string
}

interface Recipe {
  name: string
  ingredients: string[]
  instructions: string[]
}

interface AnalysisResult {
  dish: string
  visibleIngredients: string[]
  suggestedIngredients: string[]
  recipe: Recipe
}

export function AIShoppingAssistant({ isOpen: initialIsOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([])
  const [suggestedIngredients, setSuggestedIngredients] = useState<string[]>([])
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, []) //Corrected dependency

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendMessage(
        "Bonjour ! Je suis votre assistant culinaire IA. 👨‍🍳 Comment puis-je vous aider aujourd'hui ? Voulez-vous une idée de recette, des conseils pour utiliser certains ingrédients, ou de l'aide pour planifier vos repas ? 🍽️",
        "assistant",
      )
    }
  }, [isOpen, messages.length])

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (err) {
      sendMessage("Désolé, je n'ai pas pu accéder à votre caméra. Veuillez vérifier les autorisations.", "assistant")
    }
  }

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(videoRef.current, 0, 0)

      const photo = canvas.toDataURL("image/jpeg")

      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setShowCamera(false)

      analyzeImage(photo)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photo = e.target?.result as string
        analyzeImage(photo)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (photo: string) => {
    setIsLoading(true)
    sendMessage("Image téléchargée. Analyse en cours...", "assistant")

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse de l'image")
      }

      const data: AnalysisResult = await response.json()
      setDetectedIngredients(data.visibleIngredients)
      setSuggestedIngredients(data.suggestedIngredients)
      setRecipe(data.recipe)

      // Identify and send missing products
      await identifyAndSendMissingProducts(data.visibleIngredients, data.suggestedIngredients)

      sendMessage(
        `J'ai détecté le plat suivant : ${data.dish}. Voici les ingrédients visibles : ${data.visibleIngredients.join(
          ", ",
        )}. Je suggère d'ajouter : ${data.suggestedIngredients.join(
          ", ",
        )}. Voulez-vous voir la recette ou ajouter ces ingrédients à votre liste de courses ?`,
        "assistant",
      )
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image:", error)
      sendMessage("Désolé, une erreur s'est produite lors de l'analyse de l'image. Veuillez réessayer.", "assistant")
    } finally {
      setIsLoading(false)
    }
  }

  const identifyAndSendMissingProducts = async (detectedIngredients: string[], suggestedIngredients: string[]) => {
    const allIngredients = [...detectedIngredients, ...suggestedIngredients]

    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const products = await response.json()
      const productNames = products.map((product: any) => product.nom.toLowerCase())

      const missingProducts = allIngredients.filter((ingredient) => !productNames.includes(ingredient.toLowerCase()))

      if (missingProducts.length > 0) {
        await postMissingProducts(missingProducts)
      }
    } catch (error) {
      console.error("Error identifying and sending missing products:", error)
    }
  }

  const postMissingProducts = async (missingProducts: string[]) => {
    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ missingProducts }),
      })

      if (!response.ok) {
        throw new Error("Failed to post missing products")
      }

      const result = await response.json()
      console.log("Missing products posted successfully:", result)
    } catch (error) {
      console.error("Error posting missing products:", error)
    }
  }

  const sendMessage = async (content: string, type: "user" | "assistant") => {
    const newMessage: Message = { type, content }
    setMessages((prev) => [...prev, newMessage])

    if (type === "user") {
      setIsLoading(true)
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages.map((m) => ({ role: m.type, content: m.content })), { role: "user", content }],
            displayStyle: content.toLowerCase().includes("recette") ? "recipe" : "shopping_list",
          }),
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la communication avec l'assistant")
        }

        const data = await response.json()
        sendMessage(data.message, "assistant")

        if (data.recipe) {
          setRecipe(data.recipe)
        }

        if (data.products && data.products.length > 0) {
          const productMessage = `Voici les produits suggérés : ${data.products.join(
            ", ",
          )}. Cliquez sur le bouton ci-dessous pour voir ces produits dans notre magasin.`
          sendMessage(productMessage, "assistant")
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error)
        sendMessage("Désolé, une erreur s'est produite. Veuillez réessayer.", "assistant")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    sendMessage(userInput, "user")
    setUserInput("")
  }

  const handleViewProducts = () => {
    const allIngredients = [...detectedIngredients, ...suggestedIngredients]
    const queryString = new URLSearchParams({ ingredients: allIngredients.join(",") }).toString()
    router.push(`/products?${queryString}`)
  }

  const renderMessage = (message: Message) => {
    const content = message.content
    const productButtonRegex = /Cliquez sur le bouton ci-dessous pour voir ces produits/

    if (productButtonRegex.test(content)) {
      return (
        <>
          <p className="text-sm whitespace-pre-line">{content}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleViewProducts}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Voir les produits
          </Button>
        </>
      )
    }

    if (recipe && message.type === "assistant" && content.includes("Voici la recette")) {
      return (
        <>
          <p className="text-sm whitespace-pre-line">{content}</p>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold">{recipe.name}</h3>
            <h4 className="font-semibold mt-2">Ingrédients :</h4>
            <ul className="list-disc list-inside">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h4 className="font-semibold mt-2">Instructions :</h4>
            <ol className="list-decimal list-inside">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </>
      )
    }

    return <p className="text-sm whitespace-pre-line">{content}</p>
  }

  return (
    <div
      className="fixed z-50 transition-all duration-300 ease-in-out"
      style={{
        bottom: isOpen ? "24px" : "24px",
        right: "24px",
        transform: `translateY(${isOpen ? "0" : `${Math.min(scrollY, 100)}px`})`,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          >
            <div className="w-[380px] max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Assistant Culinaire IA</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Chat Container */}
              <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-gray-50 dark:bg-gray-900"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${message.type === "user" ? "justify-end" : ""}`}
                  >
                    {message.type === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`flex-1 rounded-2xl p-4 shadow-sm ${
                        message.type === "assistant" ? "bg-white dark:bg-gray-800" : "bg-blue-500 text-white ml-12"
                      }`}
                    >
                      {renderMessage(message)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        className="text-sm"
                      >
                        ...
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera View */}
              {showCamera && (
                <div className="relative w-full h-[200px] bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <Button onClick={takePhoto} className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    Prendre la photo
                  </Button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 space-y-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                  <Button onClick={handleCameraAccess} variant="outline" className="flex-1 h-10" disabled={showCamera}>
                    <Camera className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button onClick={handleFileUpload} variant="outline" className="flex-1 h-10" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Import
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="Posez votre question ici..."
                    className="resize-none pr-12 min-h-[80px]"
                    rows={3}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    className="absolute right-2 bottom-2 rounded-full w-8 h-8 p-0"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Brain className="h-8 w-8 text-white" />
        </Button>
      </motion.div>
    </div>
  )
}

