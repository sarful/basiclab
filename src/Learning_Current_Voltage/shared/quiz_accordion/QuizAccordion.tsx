"use client";

import { useState } from "react";

export type QuizAccordionItem = {
  answer: string;
  question: string;
};

export default function QuizAccordion({
  items,
}: {
  items: QuizAccordionItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
            >
              <span className="text-sm font-semibold leading-6 text-slate-900 md:text-[15px]">
                {index + 1}. {item.question}
              </span>
              <span className="shrink-0 text-lg font-bold text-slate-500">
                {isOpen ? "-" : "+"}
              </span>
            </button>

            {isOpen ? (
              <div className="border-t border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700 md:text-[15px]">
                <p>
                  <strong>Answer:</strong> {item.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
