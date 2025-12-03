"use client";

/* eslint-disable react/no-unescaped-entities */
import HeadingSection from "@/components/HeadingSection";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { Facebook, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import FacebookPageEmbed from "./FacebookPageEmbed";

const ConnectWithUs = () => {
  const {
    getSocialLinks,
    isLoading: _isLoading,
    companyInfo,
  } = useCompanyInfo();
  const [facebookUrl, setFacebookUrl] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>("");

  useEffect(() => {
    const socialLinks = getSocialLinks();
    if (socialLinks?.facebook) {
      setFacebookUrl(socialLinks.facebook);
    }
    if (socialLinks?.youtube) {
      setYoutubeUrl(socialLinks.youtube);
    }
    if ((companyInfo as any)?.youtube_video) {
      setYoutubeVideoUrl((companyInfo as any).youtube_video);
    }
  }, [getSocialLinks, companyInfo]);

  const [_followStats, _setFollowStats] = useState({
    facebook: 570985,
    youtube: 125000,
    instagram: 89000,
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Connect With Us Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <HeadingSection
            badgeText="Our Social Media"
            badgeIcon="🌍"
            title="Connect With Us"
            subtitle="Join our travel community and stay updated with the latest adventures, tips, and exclusive content"
          />

          {/* FIXED: Responsive layout with explicit ordering */}
          <div className="mx-auto max-w-7xl flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Facebook Community */}
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 p-6 transition-all duration-500 hover:shadow-2xl md:rounded-3xl md:p-8 order-1 md:order-none">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 md:h-12 md:w-12">
                  <Facebook className="h-5 w-5 text-white md:h-6 md:w-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 md:text-2xl">
                  Facebook
                </h4>
              </div>

              <div className="lg:mb-6 ">
                <FacebookPageEmbed facebookUrl={facebookUrl} />
              </div>

              <button
                onClick={() =>
                  window.open(
                    facebookUrl || "https://www.facebook.com/gatewayholidaysbd",
                    "_blank"
                  )
                }
                className="mt-6 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:mt-10 md:text-base"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                <span>Follow Our Page</span>
              </button>
            </div>

            {/* YouTube Channel */}
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-red-50 p-6 transition-all duration-500 hover:shadow-2xl md:rounded-3xl md:p-8 order-2 md:order-none">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 md:h-12 md:w-12">
                  <Youtube className="h-5 w-5 text-white md:h-6 md:w-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 md:text-2xl">
                  YouTube
                </h4>
              </div>

              <div className="mb-6">
                <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-white">
                  <iframe
                    className="h-full w-full rounded-2xl"
                    src={
                      youtubeVideoUrl ||
                      "https://www.youtube.com/embed/Vqxls_ExOGQ?si=PI1rde0iENI9CnRK"
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <h5 className="mb-2 break-words text-lg font-semibold text-gray-800 md:text-xl">
                  Explore the World with Gateway Holidays
                </h5>

                <p className="mb-3 break-words text-sm text-gray-600 md:mb-4 md:text-base">
                  At <strong>Gateway Holidays Ltd.</strong>, we believe travel
                  is more than just visiting places — it's about creating
                  unforgettable memories. With over 300K happy followers, we are
                  proud to be Bangladesh's leading travel agency, trusted by
                  thousands of explorers.
                </p>

                <p className="mb-3 break-words text-sm text-gray-600 md:mb-4 md:text-base">
                  Our featured destinations include{" "}
                  <strong>Vietnam, Dubai, and Kashmir</strong> — carefully
                  handpicked to deliver a mix of natural beauty, culture, and
                  unique experiences. We manage flights, hotels, guided tours,
                  and even special requests to give you a complete package.
                </p>

                <p className="mb-3 break-words text-sm text-gray-600 md:mb-4 md:text-base">
                  <strong>01873-073111</strong> or visit our Youtube{" "}
                  <strong>Channel</strong> for travel inspiration and tips.
                </p>
              </div>

              <button
                onClick={() =>
                  window.open(
                    youtubeUrl || "https://www.youtube.com/@gatewayholidays",
                    "_blank"
                  )
                }
                className="mt-6 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 md:mt-10 md:text-base"
              >
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
                <span>Subscribe to Channel</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConnectWithUs;
