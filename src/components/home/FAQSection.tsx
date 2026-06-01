"use client";

import { SectionHeading } from "@/components/home/SectionHeading";
import type { FAQ } from "@prisma/client";
import { ChevronDown, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section id="faq" className="section-padding border-t border-medical-blue/5 bg-surface-soft">
      <div className="section-container max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-medical-coral/15">
            <Heart className="h-6 w-6 text-medical-coral" />
          </div>
          <SectionHeading
            eyebrow="Para familias"
            title="Información útil para familias"
            description="Respuestas claras sobre guardia, obras sociales, vacunatorio y qué llevar a la consulta. Si tenés dudas, escribinos por WhatsApp."
          />
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white shadow-soft transition",
                  isOpen
                    ? "border-medical-teal/30 shadow-card"
                    : "border-medical-blue/10"
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-medical-deep md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-medical-sky transition",
                      isOpen && "bg-medical-teal/15"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-medical-teal transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-medical-blue/5 bg-medical-sky/20 px-5 pb-5 pt-4 md:px-6">
                    <p className="text-sm leading-relaxed text-text-muted md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
