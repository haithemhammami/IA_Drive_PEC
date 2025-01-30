"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isWaving, setIsWaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsWaving(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">IA_Drive</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Catégories</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem>
                <Link href="/fruits-vegetables" className="flex items-center">
                  🍎 Fruits et Légumes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dairy-eggs" className="flex items-center">
                  🥚 Produits Laitiers et Œufs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/meat-seafood" className="flex items-center">
                  🍖 Viande et Fruits de Mer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/bakery" className="flex items-center">
                  🍞 Boulangerie
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <nav className="ml-auto flex items-center space-x-6 text-sm font-medium">
          <Button variant="ghost" onClick={() => scrollToSection("about")}>
            À propos
          </Button>
          <Button variant="ghost" onClick={() => scrollToSection("features")}>
            Fonctionnalités
          </Button>
          <Button variant="ghost" onClick={() => scrollToSection("tutorial")}>
            Guide
          </Button>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Input type="search" placeholder="Rechercher..." className="h-9 w-[200px] lg:w-[300px]" />
          <Button variant="ghost" size="icon" className="relative" aria-label="Panier">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <AnimatePresence>
            {isWaving ? (
              <motion.div
                key="waving"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="ghost" size="icon" aria-label="Compte utilisateur">
                  <motion.div
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                    transition={{ duration: 2.5, loop: Number.POSITIVE_INFINITY, repeatDelay: 7 }}
                  >
                    <User className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            ) : (
              <motion.div key="static" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button variant="ghost" size="icon" aria-label="Compte utilisateur">
                  <User className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Changer de thème"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer de thème</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

