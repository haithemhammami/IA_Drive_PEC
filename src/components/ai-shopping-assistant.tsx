"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, Camera, Upload, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function AIShoppingAssistant({ isOpen: initialIsOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [scrollY, setScrollY] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle the file upload logic here
      console.log("File uploaded:", file.name)
    }
  }

  return (
    <div
      className="fixed z-50 transition-all duration-300 ease-in-out"
      style={{
        bottom: isOpen ? "20px" : "20px",
        right: "20px",
        transform: `translateY(${isOpen ? "0" : `${Math.min(scrollY, 100)}px`})`,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 h-[500px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assistant IA</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-sm">Bonjour ! Comment puis-je vous aider avec vos courses aujourd'hui ?</p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button onClick={() => console.log("Take photo")} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Prendre une photo
                </Button>
                <Button onClick={handleFileUpload} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <Textarea placeholder="Demandez à propos des plats, courses..." className="resize-none" rows={2} />
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 glow bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <Brain className="h-8 w-8" />
        </Button>
      </motion.div>
    </div>
  )
}

