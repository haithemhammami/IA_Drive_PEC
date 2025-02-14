"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ShoppingCart, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isWaving, setIsWaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [userId, setUserId] = useState("guest");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/auth/check-session', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data as { user?: { id: string } };
        if (data.user) {
          setUserId((response.data as { user: { id: string } }).user.id);
        } else {
          setUserId("guest");
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        setUserId("guest");
      }
    };

    fetchUserId();
  }, []);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsWaving(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold">
            <Image
              width={144}
              height={32}
              src="/images/logo.svg"
              alt="YumiMind"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={144}
              height={32}
              src="/images/logo.svg"
              alt="YumiMind"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/categories" className="flex items-center">
               Catégories
            </Link>
            <Link href="/products" className="flex items-center">
              Tous les produits
            </Link>
            <Link href="/meat-seafood" className="flex items-center">
              IA-shoper
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:block">
            <Input
              type="search"
              placeholder="Rechercher..."
              className="h-9 w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link href={`/cart/${userId}`}>
            <Button variant="ghost" size="icon" className="relative" aria-label="Panier">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>
          <AnimatePresence mode="wait">
            {isWaving ? (
              <motion.div
                key="waving"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Button variant="ghost" size="icon" aria-label="Compte utilisateur">
                  <Link href="/profil">
                    <motion.div
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 2.5, loop: Number.POSITIVE_INFINITY, repeatDelay: 7 }}
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="static"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Button variant="ghost" size="icon" aria-label="Compte utilisateur">
                  <Link href="/auth/login">
                    <User className="h-5 w-5" />
                  </Link>
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
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link href="/categories" className="flex items-center">
              Categories
            </Link>
            <Link href="/products" className="flex items-center">
              Tous les produits
            </Link>
            <Link href="/meat-seafood" className="flex items-center">
              IA-shoper
            </Link>
            <form onSubmit={handleSearch} className="w-full max-w-[300px]">
              <Input
                type="search"
                placeholder="Rechercher..."
                className="h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}