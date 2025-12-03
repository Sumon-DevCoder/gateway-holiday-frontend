"use client";

import html2canvas from "html2canvas";
import Image from "next/image";
import React, { useRef } from "react";

const JobOpportunitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadAsImage = async () => {
    if (!sectionRef.current) {
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(sectionRef.current, {
        backgroundColor: "#056EB6",
        scale: 2,
        useCORS: false,
        allowTaint: false,
        logging: false,
        ignoreElements: (element) => {
          // Ignore elements that might cause color parsing issues
          return element.tagName === "STYLE" || element.tagName === "LINK";
        },
        onclone: (clonedDoc) => {
          // Remove any problematic styles that use oklch
          const styleElements = clonedDoc.querySelectorAll("style");
          styleElements.forEach((style) => {
            style.remove();
          });
        },
      });

      // Create download link
      const link = document.createElement("a");
      link.download = "job-opportunities.png";
      link.href = canvas.toDataURL("image/png", 1.0);

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      } catch (error) {
      alert("ডাউনলোডে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Download Button */}
        <div className="mb-4 text-center">
          <button
            onClick={downloadAsImage}
            disabled={isDownloading}
            className={`rounded-lg px-6 py-3 font-bold text-white transition-colors ${
              isDownloading
                ? "cursor-not-allowed bg-gray-500"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isDownloading ? (
              <>⏳ ডাউনলোড হচ্ছে...</>
            ) : (
              <>📱 ইমেজ হিসেবে ডাউনলোড করুন</>
            )}
          </button>
        </div>

        {/* Main Container with Blue Background */}
        <div
          ref={sectionRef}
          className="rounded-lg p-8 text-white"
          style={{ backgroundColor: "#056EB6" }}
        >
          {/* Company Logo and Header Section */}
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Main Headline */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                সরাসরি কোম্পানিতে আকর্ষণীয় বেতনে
              </h2>
              <div className="inline-block rounded-lg bg-red-600 px-6 py-3 shadow-lg">
                <h3 className="text-xl font-bold text-white md:text-2xl">
                  সৌদি আরবের চাকরির সুবর্ণ সুযোগ!
                </h3>
              </div>
            </div>

            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="rounded-xl bg-white p-5 shadow-lg">
                <Image
                  src="/ktc-compnay-logo/bg-remove-ff.png"
                  alt="KTC Company Logo"
                  width={280}
                  height={100}
                  className="h-auto w-auto max-w-[280px]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Introductory Paragraph */}
          <div className="mb-8 text-center">
            <p className="text-lg md:text-xl">
              সৌদি আরবের বিখ্যাত কোম্পানি আল মারাই, লুমি ও এলিট হসপিটালিটিতে
              ড্রাইভার, কিচেন হেলপার ও বাবুর্চি নিয়োগ। দ্রুত প্রসেসিং
            </p>
          </div>

          {/* Job Vacancy Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-white">
              <thead>
                <tr className="bg-blue-700">
                  <th className="border border-white p-4 text-left font-bold">
                    কোম্পানি
                  </th>
                  <th className="border border-white p-4 text-left font-bold">
                    পদসমূহ
                  </th>
                  <th className="border border-white p-4 text-left font-bold">
                    সংখ্যা
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-white p-4">আল মারাই</td>
                  <td className="border border-white p-4">
                    হেভি ড্রাইভার + লাইট ড্রাইভার
                  </td>
                  <td className="border border-white p-4">৫০ জন</td>
                </tr>
                <tr>
                  <td className="border border-white p-4">লুমি</td>
                  <td className="border border-white p-4">
                    বিদেশ ফেরত ড্রাইভার
                  </td>
                  <td className="border border-white p-4">২০ জন</td>
                </tr>
                <tr>
                  <td className="border border-white p-4">এলিট হসপিটালিটি</td>
                  <td className="border border-white p-4">কিচেন হেলপার</td>
                  <td className="border border-white p-4">২০ জন</td>
                </tr>
                <tr>
                  <td className="border border-white p-4">এলিট হসপিটালিটি</td>
                  <td className="border border-white p-4">বাবুর্চি</td>
                  <td className="border border-white p-4">২০ জন</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Benefits and Features Section */}
          <div className="mb-8">
            <h4 className="mb-4 text-left text-xl font-bold">
              সুযোগ-সুবিধা ও বৈশিষ্ট্য:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="mt-1 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-left">
                  ডাইরেক্ট কোম্পানিতে চাকরি, কোন থার্ড পার্টি জড়িত নয়
                </p>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-left">আকর্ষণীয় ও ভালো বেতন-এ নিশ্চয়তা</p>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-left">
                  দ্রুত প্রসেস: দ্রুততম সময়ে আপনার বিদেশ যাওয়ার ব্যবস্থা
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-6 text-center">
            <div className="inline-block rounded-lg bg-red-600 px-8 py-4">
              <h4 className="text-xl font-bold text-white md:text-2xl">
                এখনই যোগাযোগ করুন!
              </h4>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span className="text-xl font-bold">01323-192403</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span className="text-xl font-bold">01806-644157</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobOpportunitiesSection;
