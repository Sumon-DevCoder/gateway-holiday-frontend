"use client";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { ArrowUp, MessageSquare, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

// Facebook Messenger Icon Component
const MessengerIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8l3.13 3.259L19.826 8l-6.633 6.963z" />
  </svg>
);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState(false);

  // Use global company info hook
  const { getPrimaryPhone, getSocialLinks } = useCompanyInfo();

  // Show button when page is scrolled down 300px
  const toggleVisibility = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get current scroll position
    const currentPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // If already at top, do nothing
    if (currentPosition === 0) return;

    // Smooth scroll with better control
    const startTime = performance.now();
    const duration = 800; // 800ms duration for smooth scroll

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Calculate new position
      const newPosition = currentPosition * (1 - easeOut);

      // Apply scroll
      window.scrollTo(0, newPosition);

      // Continue animation if not finished
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Ensure we're exactly at the top
        window.scrollTo(0, 0);
      }
    };

    // Start animation
    requestAnimationFrame(animateScroll);
  };

  // Toggle contact menu
  const toggleContactMenu = () => {
    setShowContactMenu(!showContactMenu);
  };

  // Open Facebook Messenger
  const openMessenger = () => {
    const socialLinks = getSocialLinks();
    const facebookUrl = socialLinks?.facebook;
    if (facebookUrl) {
      // Extract page username from Facebook URL for m.me link
      const pageMatch = facebookUrl.match(/facebook\.com\/([^\/]+)/);
      if (pageMatch) {
        const pageUsername = pageMatch[1];
        window.open(`https://m.me/${pageUsername}`, "_blank");
      } else {
        // Fallback to direct Facebook URL
        window.open(facebookUrl, "_blank");
      }
    } else {
      // Fallback URL if no Facebook link is configured
      window.open("https://m.me/gatewayholidaysbd", "_blank");
    }
    setShowContactMenu(false);
  };

  // Open WhatsApp
  const openWhatsApp = () => {
    const primaryPhone = getPrimaryPhone();

    if (primaryPhone) {
      // Clean phone number and ensure it has country code
      let phoneNumber = primaryPhone.replace(/[^\d+]/g, "");

      // If it doesn't start with +, add +880
      if (!phoneNumber.startsWith("+")) {
        if (phoneNumber.startsWith("0")) {
          // Remove leading 0 and add +880
          phoneNumber = "+880" + phoneNumber.substring(1);
        } else {
          // Add +880 prefix
          phoneNumber = "+880" + phoneNumber;
        }
      }

      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    } else {
      // Fallback phone number
      window.open("https://wa.me/+8801822822711", "_blank");
    }
    setShowContactMenu(false);
  };

  // Make phone call
  const makeCall = () => {
    const primaryPhone = getPrimaryPhone();
    if (primaryPhone) {
      window.open(`tel:${primaryPhone}`, "_self");
    } else {
      // Fallback phone number
      window.open("tel:+8801822822711", "_self");
    }
    setShowContactMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      toggleVisibility();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Listen for custom event to open contact menu
  useEffect(() => {
    const handleOpenContactMenu = () => {
      setShowContactMenu(true);
    };

    window.addEventListener("openContactMenu", handleOpenContactMenu);

    return () => {
      window.removeEventListener("openContactMenu", handleOpenContactMenu);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContactMenu(false);
    };

    if (showContactMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showContactMenu]);

  return (
    <>
      {/* Scroll to Top Button - Shows when scrolled and contact menu is closed */}
      {isVisible && (
        <button
          onClick={(e) => {
            scrollToTop(e);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          className={`group fixed right-8 bottom-24 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none ${
            showContactMenu
              ? "pointer-events-none -translate-y-4 scale-95 opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          }`}
          aria-label="Scroll to top"
          style={{
            pointerEvents: showContactMenu ? "none" : "auto",
            zIndex: 9999,
          }}
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      )}

      {/* Contact Menu */}
      <div className="fixed right-8 bottom-8 z-50">
        {/* Contact Options Menu */}
        <div className="mb-4 space-y-3">
          {/* WhatsApp Button */}
          <button
            onClick={openWhatsApp}
            className={`group flex h-12 w-12 transform items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:outline-none ${showContactMenu ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-95 opacity-0"} transition-delay-100`}
            aria-label="Chat with us on WhatsApp"
            style={{ transitionDelay: showContactMenu ? "100ms" : "0ms" }}
          >
            <WhatsAppIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </button>

          {/* Facebook Messenger Button */}
          <button
            onClick={openMessenger}
            className={`group flex h-12 w-12 transform items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none ${showContactMenu ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-95 opacity-0"}`}
            aria-label="Chat with us on Facebook Messenger"
            style={{ transitionDelay: showContactMenu ? "150ms" : "0ms" }}
          >
            <MessengerIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </button>

          {/* Phone Call Button */}
          <button
            onClick={makeCall}
            className={`group flex h-12 w-12 transform items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:outline-none ${showContactMenu ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-95 opacity-0"}`}
            aria-label="Call us"
            style={{ transitionDelay: showContactMenu ? "200ms" : "0ms" }}
          >
            <Phone className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </button>
        </div>

        {/* Main Contact Button */}
        <div className="relative">
          <button
            onClick={toggleContactMenu}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
            aria-label={showContactMenu ? "Close contact menu" : "Contact us"}
          >
            <div className="relative h-5 w-5">
              <MessageSquare
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  showContactMenu
                    ? "scale-75 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100 group-hover:scale-110"
                }`}
              />
              <X
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  showContactMenu
                    ? "scale-100 rotate-0 opacity-100 group-hover:scale-110"
                    : "scale-75 -rotate-90 opacity-0"
                }`}
              />
            </div>
          </button>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-bold whitespace-nowrap text-gray-700">
            Live chat
          </span>
        </div>
      </div>
    </>
  );
};

export default ScrollToTop;
