import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold">
              IA_Drive
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              IA_Drive est un assistant de courses alimenté par l'IA qui vous aide à gérer efficacement vos achats
              alimentaires.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Liens utiles
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Suivez-nous
            </h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-500 dark:text-gray-400">&copy; 2023 IA_Drive. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

