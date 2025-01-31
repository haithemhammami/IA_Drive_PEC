"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, Camera, Upload, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// Définition des types
interface Message {
  type: 'assistant' | 'user';
  content: string;
  initial?: boolean;
}

export function AIShoppingAssistant({ isOpen: initialIsOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Bonjour ! Je suis votre assistant IA pour vos courses.",
      initial: true
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    
    const timer = setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: "Je peux vous aider à :\n• Trouver des produits spécifiques\n• Suggérer des recettes\n• Optimiser votre liste de courses\n• Calculer des quantités"
        }])
        setIsTyping(false)
      }, 2000)
    }, 3000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "Désolé, je n'ai pas pu accéder à votre caméra. Veuillez vérifier les autorisations."
      }])
    }
  }

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(videoRef.current, 0, 0)
      
      const photo = canvas.toDataURL('image/jpeg')
      
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setShowCamera(false)

      setIsLoading(true)
      setMessages(prev => [...prev, {
        type: 'user',
        content: "Photo prise avec succès"
      }])

      setTimeout(() => {
        setIsLoading(false)
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: "J'analyse votre photo... Je vois plusieurs produits intéressants. Que souhaitez-vous savoir à leur sujet ?"
        }])
      }, 2000)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      setMessages(prev => [...prev, {
        type: 'user',
        content: `Image téléchargée : ${file.name}`
      }])

      setTimeout(() => {
        setIsLoading(false)
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: "J'analyse votre image... Que souhaitez-vous savoir sur les produits visibles ?"
        }])
      }, 2000)
    }
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
                  <h3 className="text-lg font-semibold">Assistant IA</h3>
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
                  <div key={index} className="flex items-start space-x-3">
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className={`flex-1 rounded-2xl p-4 shadow-sm ${
                      message.type === 'assistant' 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-blue-500 text-white ml-12'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
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
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <Button
                    onClick={takePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  >
                    Prendre la photo
                  </Button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 space-y-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCameraAccess}
                    variant="outline"
                    className="flex-1 h-10"
                    disabled={showCamera}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button 
                    onClick={handleFileUpload} 
                    variant="outline"
                    className="flex-1 h-10"
                    disabled={isLoading}
                  >
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
                  />
                  <Button 
                    className="absolute right-2 bottom-2 rounded-full w-8 h-8 p-0"
                    size="icon"
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
      <motion.div 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
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