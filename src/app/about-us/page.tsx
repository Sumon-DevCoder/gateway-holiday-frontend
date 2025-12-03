"use client";
/* eslint-disable react/no-unescaped-entities */
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useGetLeadershipHighlightQuery } from "@/redux/api/features/leadership/leadershipApi";
import { useGetTeamMembersQuery } from "@/redux/api/features/team/teamApi";
import { Award, Clock, Shield, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/newsletter-animations.css";

// Dynamic imports to prevent SSR issues

const TeamSection = dynamic(() => import("@/components/about-us/TeamSection"), {
  ssr: false,
  loading: () => <div className="py-20 text-center">Loading team...</div>,
});

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}
const AboutUsPage = () => {
  // Router for navigation
  const router = useRouter();

  // Company info hook
  const {
    getYearsOfExperience,
    getSocialLinks,
    getCustomerReviewCount,
    getDestinations,
  } = useCompanyInfo();

  // Team API call
  const {
    data: teamResponse,
    isLoading: isLoadingTeam,
    error: teamError,
  } = useGetTeamMembersQuery({});

  const {
    data: leadershipResponse,
    isLoading: isLoadingLeadership,
    error: leadershipError,
  } = useGetLeadershipHighlightQuery();

  // Extract team members from response
  const teamMembers = teamResponse?.data || [];

  // Get years of experience from company info
  const yearsOfExperience = getYearsOfExperience();
  const customerReviewCount = getCustomerReviewCount();
  const destinations = getDestinations();

  // Get social links
  const socialLinks = getSocialLinks();

  const leadershipHighlight = leadershipResponse?.data ?? null;
  const leadershipName = leadershipHighlight?.name ?? "Our Honourable Leader";
  const leadershipDesignation =
    leadershipHighlight?.designation ?? "Leadership Team";
  const leadershipQuote = leadershipHighlight?.quote ?? "";
  const leadershipImage =
    leadershipHighlight?.image ??
    "https://res.cloudinary.com/dj2sim7gr/image/upload/v1760078917/profile-images/f3qtlgavuao1if3mgihz.jpg";
  const leadershipImageAlt =
    leadershipHighlight?.imageAlt || leadershipName || "Leadership image";
  const leadershipHeading = leadershipHighlight
    ? `Meet ${leadershipName}`
    : "Our Honourable Leadership";
  const fallbackLeadershipParagraphs = [
    "Meet our visionary leader who brings over two decades of industry expertise and innovative thinking to drive our company forward.",
    "With a proven track record of transforming businesses and building high-performing teams, our leadership combines strategic insight with hands-on guidance.",
    "Under their direction, we continue to push boundaries and deliver exceptional value to our clients worldwide, making travel dreams a reality.",
    '"Our mission is to create unforgettable travel experiences that inspire, connect, and transform lives."',
    "We believe that travel is not just about visiting places; it's about creating memories that last a lifetime. Our commitment to excellence and customer satisfaction drives us to go beyond expectations in everything we do. From personalized itineraries to 24/7 support, we ensure that every journey with us is seamless, enriching, and truly unforgettable.",
  ];

  const [_particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);
  }, []);

  // Handler for Watch Tour button
  const handleWatchTour = () => {
    const youtubeLink = socialLinks?.youtube;
    if (youtubeLink) {
      window.open(youtubeLink, "_blank");
    } else {
      alert("YouTube link not available. Please contact support.");
    }
  };

  // Handler for Find Out More button
  const handleFindOutMore = () => {
    router.push("/package");
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:px-0">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <div className="w-full max-w-3xl space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-center text-2xl leading-tight font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                  We provide the
                  <span className="text-blue-600"> best tour </span>
                  facilities
                </h1>
                <p className="mt-3 text-center text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                  Experience unforgettable journeys with our premium travel
                  services. From visa assistance to luxury accommodations, we
                  handle everything for your perfect vacation.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={handleFindOutMore}
                  className="transform rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                >
                  Find Out More
                </button>
                <button
                  onClick={handleWatchTour}
                  className="rounded-full border-2 border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white sm:px-6 sm:py-3 sm:text-base"
                >
                  Watch Tour
                </button>
              </div>
              <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-blue-600 sm:text-xl md:text-2xl">
                      {yearsOfExperience > 0 ? yearsOfExperience : "05"}
                    </div>
                    <div className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                      Years of Experience
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 sm:h-10"></div>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-blue-600 sm:text-xl md:text-2xl">
                      {customerReviewCount || "1000+"}
                    </div>
                    <div className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                      Happy Travelers
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 sm:h-10"></div>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-blue-600 sm:text-xl md:text-2xl">
                      {destinations || "50+"}
                    </div>
                    <div className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                      Destinations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl">
              Why Choose <span className="text-blue-600">Gateway Holidays</span>
            </h2>
            <p className="text-base text-gray-600 sm:text-lg lg:text-xl">
              We ensure your journey is safe, memorable, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[
              {
                icon: (
                  <Shield className="h-10 w-10 text-blue-600 sm:h-12 sm:w-12" />
                ),
                title: "Safety First Always",
                description:
                  "Your safety is our top priority with certified guides and secure transportation.",
              },
              {
                icon: (
                  <Award className="h-10 w-10 text-blue-600 sm:h-12 sm:w-12" />
                ),
                title: "Trusted Travel Guide",
                description:
                  "Experienced local guides with deep knowledge of destinations and culture.",
              },
              {
                icon: (
                  <Users className="h-10 w-10 text-blue-600 sm:h-12 sm:w-12" />
                ),
                title: "Expertise And Experience",
                description: `Over ${yearsOfExperience > 0 ? yearsOfExperience : 5} years of excellence in providing unforgettable travel experiences.`,
              },
              {
                icon: (
                  <Clock className="h-10 w-10 text-blue-600 sm:h-12 sm:w-12" />
                ),
                title: "Time And Stress Savings",
                description:
                  "We handle all arrangements so you can focus on enjoying your vacation.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md sm:rounded-2xl sm:p-6 lg:p-8"
              >
                <div className="mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Highlight */}
      <section id="leadership" className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="relative order-1 h-[320px] overflow-hidden rounded-lg shadow-xl sm:h-[380px] md:h-[400px] lg:h-[450px]">
              {isLoadingLeadership ? (
                <div className="absolute inset-0 animate-pulse bg-linear-to-br from-gray-200 via-gray-300 to-gray-200" />
              ) : (
                <Image
                  src={leadershipImage}
                  alt={leadershipImageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  quality={100}
                  priority
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6 lg:p-8">
                <h3 className="mb-1 text-2xl font-bold text-white sm:mb-2 sm:text-3xl md:text-3xl lg:text-4xl">
                  {leadershipName}
                </h3>
                <p className="mb-0.5 text-lg font-semibold text-blue-400 sm:mb-1 sm:text-xl md:text-xl lg:text-2xl">
                  {leadershipDesignation}
                </p>
                <p className="text-base text-gray-200 sm:text-lg md:text-lg lg:text-xl">
                  Gateway Holiday
                </p>
              </div>
            </div>

            <div className="order-2 flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <span className="mb-2 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white sm:mb-3 sm:px-4 sm:text-sm">
                  Leadership
                </span>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-3xl lg:text-4xl">
                  {leadershipHeading}
                </h2>
                {leadershipHighlight && !isLoadingLeadership && (
                  <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    Insight from {leadershipName}
                  </p>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {isLoadingLeadership ? (
                  <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 sm:h-5" />
                    <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200 sm:h-5" />
                    <div className="h-4 w-10/12 animate-pulse rounded bg-gray-200 sm:h-5" />
                    <div className="h-4 w-9/12 animate-pulse rounded bg-gray-200 sm:h-5" />
                  </div>
                ) : leadershipQuote ? (
                  <div
                    className="space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg [&_em]:italic [&_strong]:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: leadershipQuote }}
                  />
                ) : (
                  fallbackLeadershipParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg ${
                        index === 3 ? "font-semibold text-gray-800 italic" : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))
                )}

                {leadershipError && !isLoadingLeadership && (
                  <p className="text-sm text-red-500 sm:text-base">
                    Unable to load leadership highlight right now. Showing
                    default content.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-0">
          <TeamSection
            teamMembers={teamMembers}
            isLoading={isLoadingTeam}
            error={teamError}
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
