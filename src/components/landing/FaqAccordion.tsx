"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/lib/faq-content";

type FaqAccordionProps = {
  readonly items: readonly FaqItem[];
};

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="divide-y divide-lcdv-gold-2/20 rounded-2xl border border-lcdv-gold-2/25 bg-lcdv-bg/40">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div key={item.id} className="px-5 sm:px-6">
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-start justify-between gap-4 py-5 text-left font-sans text-base font-semibold text-lcdv-text transition-colors hover:text-lcdv-highlight sm:text-lg"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(item.id)}
              >
                <span>{item.question}</span>
                <span
                  className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-lcdv-gold-2/35 text-lcdv-highlight transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5"
            >
              <p className="text-sm leading-relaxed text-lcdv-text-2 sm:text-base">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
