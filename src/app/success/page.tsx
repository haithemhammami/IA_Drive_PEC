"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id: sessionId } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function confirmPayment() {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/payment-confirm?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setMessage("Paiement réussi ! 🎉");
      } catch (err: unknown) {
        setMessage("Erreur de confirmation du paiement.");
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto text-center mt-20">
      <h1 className="text-3xl font-bold">🎉 Paiement réussi</h1>
      <p className="mt-4">{loading ? "Vérification en cours..." : message}</p>
    </div>
  );
}
