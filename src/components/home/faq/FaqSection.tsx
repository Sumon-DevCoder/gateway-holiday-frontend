"use client";

import { useGetActiveFaqsQuery } from "@/redux/api/features/faq/faqApi";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FaqItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem = ({ question, answer, isOpen, onToggle }: FaqItemProps) => {
  return (
    <div className="border-b border-gray-200 transition-all duration-300 last:border-b-0 hover:bg-blue-50">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left transition-all duration-300 hover:bg-blue-50 sm:p-5 md:p-6"
      >
        <div className="flex min-w-0 flex-1 items-center space-x-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-sm sm:h-9 sm:w-9 md:h-10 md:w-10">
              <span className="text-xs font-bold text-white sm:text-sm">?</span>
            </div>
          </div>
          <h3 className="pr-2 text-sm leading-tight font-semibold text-gray-800 transition-colors duration-300 hover:text-blue-600 sm:pr-4 sm:text-base md:text-lg">
            {question}
          </h3>
        </div>
        <div className="ml-2 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-blue-600 transition-transform duration-300 sm:h-6 sm:w-6" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600 transition-transform duration-300 sm:h-6 sm:w-6" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
              <div className="ml-8 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3 text-sm leading-relaxed text-gray-700 sm:ml-10 sm:p-4 sm:text-base md:ml-12 lg:ml-14">
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection() {
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(5);

  const { data: faqs, isLoading, error } = useGetActiveFaqsQuery();

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
    // Optionally close all FAQs when showing less
    setOpenFaqs(new Set());
  };

  if (isLoading) {
    return (
      <section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-2xl font-bold text-blue-600 sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <div className="animate-pulse">
              <div className="mx-auto mb-6 h-3 w-1/2 rounded bg-gray-200 sm:h-4 sm:w-1/3 md:mb-8 md:w-1/4"></div>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded bg-gray-100 sm:h-18 md:h-20"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-2xl font-bold text-blue-600 sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-600 sm:text-base md:text-lg">
              Unable to load FAQs at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <section className="bg-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-2xl font-bold text-blue-600 sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-600 sm:text-base md:text-lg">
              No FAQs available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mb-8 text-center md:mb-10 lg:mb-12">
            <h2 className="mb-3 text-2xl font-bold text-blue-600 sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base md:text-lg">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:rounded-2xl">
            {faqs &&
              Array.isArray(faqs) &&
              faqs
                .slice(0, visibleCount)
                .map((faq) => (
                  <FaqItem
                    key={faq._id}
                    id={faq._id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaqs.has(faq._id)}
                    onToggle={() => toggleFaq(faq._id)}
                  />
                ))}
          </div>

          {/* See More / Show Less Buttons */}
          {faqs && Array.isArray(faqs) && faqs.length > 5 && (
            <div className="mt-6 text-center md:mt-8">
              {visibleCount < faqs.length ? (
                <button
                  onClick={handleSeeMore}
                  className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
                >
                  <span>See More</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              ) : (
                <button
                  onClick={handleShowLess}
                  className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
                >
                  <span>Show Less</span>
                  <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
