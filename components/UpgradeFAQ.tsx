"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { upgradeFaqs } from "@/lib/faqs";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-800/50 transition-colors"
      >
        <span className="font-medium text-neutral-200">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 text-sm text-neutral-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UpgradeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center text-white mb-8">
        Perguntas Frequentes
      </h2>
      <div className="flex flex-col gap-3">
        {upgradeFaqs.map((faq, i) => (
          <FAQItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onClick={() => handleToggle(i)}
          />
        ))}
      </div>
    </div>
  );
}
