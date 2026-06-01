"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; active: boolean }>>([]);

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((json) => json.success && setFaqs(json.data));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">FAQ</h1>
      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id} padding="md">
            <p className="font-medium text-medical-blue">{faq.question}</p>
            <p className="mt-1 text-xs text-text-muted">
              {faq.active ? "Activa" : "Inactiva"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
