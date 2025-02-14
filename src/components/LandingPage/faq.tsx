"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "YumiMind est-il totalement gratuit ?",
    answer: "Oui, YumiMind est totalement gratuit à utiliser.",
  },
  {
    question: "Puis-je l'utiliser pour un usage commercial ?",
    answer: "Oui, vous pouvez l'utiliser dans un projet commercial.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous acceptons les paiements en ligne via carte bancaire et PayPal.",
  },
  {
    question: "Proposez-vous un support technique ?",
    answer: "Le support technique est inclus uniquement pour les utilisateurs premium.",
  },
]

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900" id="faq">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Foire Aux Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              initial={false}
            >
              <motion.button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </motion.button>
              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-6 py-4 text-gray-600 dark:text-gray-300">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

