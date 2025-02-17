import { Truck, CreditCard, Clock, Leaf, DollarSign } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Clock,
    title: "Retrait rapide en Drive 🚀",
    description: "Commandez en ligne et récupérez vos courses en quelques minutes",
  },
  {
    icon: CreditCard,
    title: "Paiements en ligne sécurisés 💳",
    description: "Transactions protégées et multiples options de paiement",
  },
  {
    icon: Truck,
    title: "Livraison à domicile 🚚",
    description: "Service de livraison flexible adapté à vos besoins",
  },
  {
    icon: Leaf,
    title: "Produits frais 🥬",
    description: "Sélection quotidienne de produits frais et de qualité",
  },
  {
    icon: DollarSign,
    title: "Prix compétitifs 💰",
    description: "Les meilleurs prix garantis sur tous nos produits",
  },
]

export function TrustFeatures() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" id="trustfeatures" aria-labelledby="trust-features-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <div className="w-full lg:w-1/2">
            <Image
              src="/benefit-one.png"
              alt="Illustration des avantages de YumiMind"
              width={200}
              height={100}
              className="rounded-xl shadow-lg ring-1 ring-gray-400/10 dark:ring-gray-700/10 w-full h-auto object-cover transition-all duration-300 hover:shadow-xl hover:ring-primary/50 sm:max-w-sm lg:max-w-md mx-auto"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 id="trust-features-title" className="text-3xl font-bold text-center lg:text-left mb-8">
              Pourquoi choisir YumiMind ?
            </h2>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <feature.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

