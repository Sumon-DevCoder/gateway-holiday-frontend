"use client";

import { IPolicyPage } from "@/types/policy";
import ReactMarkdown from "react-markdown";

interface PolicyPageComponentProps {
  policy: IPolicyPage;
}

export default function PolicyPageComponent({
  policy,
}: PolicyPageComponentProps) {
  const getTitleBySlug = (slug: string) => {
    const titles = {
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
    };
    return titles[slug as keyof typeof titles] || "Policy";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          {/* Header */}
          <h1 className="mb-10 text-center text-4xl font-extrabold text-gray-800">
            <span className="text-purple-600">
              {getTitleBySlug(policy.slug)}
            </span>
          </h1>

          {/* Last Updated */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 border-b border-gray-300"></div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-8 mb-6 text-3xl font-bold text-gray-800">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => {
                  const text = children?.toString() || "";
                  const match = text.match(/^(\d+)\.\s*(.*)/);
                  const sectionNumber = match ? match[1] : null;
                  const sectionTitle = match ? match[2] : text;

                  return (
                    <section className="mb-8">
                      <h2 className="mb-4 flex items-center text-2xl font-bold text-gray-800">
                        {sectionNumber && (
                          <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                            {sectionNumber}
                          </span>
                        )}
                        {sectionTitle}
                      </h2>
                    </section>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-700">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-lg leading-relaxed text-gray-600">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-6 list-inside list-disc space-y-2 pl-4 text-gray-600">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-6 list-inside list-decimal space-y-2 pl-4 text-gray-600">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-black">
                    {children}
                  </strong>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-black hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {policy.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
