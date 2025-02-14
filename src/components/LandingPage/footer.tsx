import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold">
              <Image
                width={176}
                height={32}
                src="/images/logo.svg"
                alt="YumiMind"
                priority
                className="dark:hidden"
                //style={{ width: "auto", height: "auto" }}
              />
              <Image
                width={176}
                height={32}
                src="/images/logo.svg"
                alt="YumiMind"
                priority
                className="hidden dark:block"
                //style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 max-w-md">
              YumiMind est un assistant de courses alimenté par l'IA qui vous aide à gérer efficacement vos achats
              alimentaires. Simplifiez votre vie avec notre technologie innovante.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Liens rapides</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
        <p className="text-base text-gray-400 text-center">© 2025 YumiMind. Tous droits réservés.</p>
      </div>
    </footer>
  );
}