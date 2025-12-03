/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";

export default function ContactInfoSection() {
  // Get company info using custom hook
  const { companyInfo } = useCompanyInfo();

  // State to track hover for phone and email cards
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  // Function to open live chat (ScrollToTop contact menu)
  const openLiveChat = (e: React.MouseEvent<HTMLDivElement>) => {
    // Create ripple effect
    const ripple = document.createElement("span");
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple-effect");

    const rippleContainer = e.currentTarget.querySelector(".ripple-container");
    if (rippleContainer) {
      rippleContainer.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Dispatch custom event to open contact menu
    window.dispatchEvent(new Event("openContactMenu"));

    // Scroll down a bit so user can see the menu
    setTimeout(() => {
      window.scrollTo({
        top: Math.max(400, window.scrollY),
        behavior: "smooth",
      });
    }, 100);
  };

  // Function to handle office card click - scroll to map section
  const handleOfficeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Create ripple effect
    const ripple = document.createElement("span");
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple-effect");

    const rippleContainer = e.currentTarget.querySelector(".ripple-container");
    if (rippleContainer) {
      rippleContainer.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Scroll to the map section on the contact page
    setTimeout(() => {
      const mapSection = document.querySelector(".map-section");
      if (mapSection) {
        mapSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        // If map section not found, scroll to contact form
        const contactForm = document.querySelector(".contact-form-section");
        if (contactForm) {
          contactForm.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }, 100);
  };

  // Default values for fallback
  const defaultContactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      primary: "+01873-073111",
      secondary: "+880 9876-543210",
      description: "Call us anytime",
      bgColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: "tel:+8801234567890",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      primary: "info@gatewayholidays.com",
      secondary: "support@gatewayholidays.com",
      description: "Send us a message",
      bgColor: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      action: "mailto:info@gatewayholidays.com",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office",
      primary: "House 123, Road 456",
      secondary: "Dhanmondi, Dhaka 1205",
      description: "Visit our office",
      bgColor: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      action: "#",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      primary: "24/7 Support",
      secondary: "Instant Response",
      description: "Chat with us now",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      action: "livechat",
    },
  ];

  const defaultBusinessHours = [
    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ];

  const defaultSocialLinks = [
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "#" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "#" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "#" },
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", url: "#" },
  ];

  // Get all phone numbers and emails
  const allPhones = companyInfo?.phone || [
    "+880 1234-567890",
    "+880 9876-543210",
  ];
  const allEmails = companyInfo?.email || [
    "info@gatewayholidays.com",
    "support@gatewayholidays.com",
  ];

  // Dynamic data from API or fallback to defaults
  const contactMethods = companyInfo
    ? [
        {
          icon: <Phone className="h-6 w-6" />,
          title: "Phone",
          primary: allPhones[0] || "+880 1234-567890",
          secondary: allPhones[1] || "+880 9876-543210",
          allItems: allPhones,
          description: "Call us anytime",
          bgColor: "bg-blue-500",
          hoverColor: "hover:bg-blue-600",
          action: `tel:${allPhones[0]?.replace(/\s+/g, "") || "+8801234567890"}`,
          type: "phone" as const,
        },
        {
          icon: <Mail className="h-6 w-6" />,
          title: "Email",
          primary: allEmails[0] || "info@gatewayholidays.com",
          secondary: allEmails[1] || "support@gatewayholidays.com",
          allItems: allEmails,
          description: "Send us a message",
          bgColor: "bg-blue-500",
          hoverColor: "hover:bg-blue-600",
          action: `mailto:${allEmails[0] || "info@gatewayholidays.com"}`,
          type: "email" as const,
        },
        {
          icon: <MapPin className="h-6 w-6" />,
          title: "Office",
          primary: companyInfo.address || "House 123, Road 456",
          secondary: companyInfo.companyName || "Gateway Holidays Ltd.",
          description: "Visit our office",
          bgColor: "bg-blue-600",
          hoverColor: "hover:bg-blue-700",
          action: "office",
        },
        {
          icon: <MessageCircle className="h-6 w-6" />,
          title: "Live Chat",
          primary: "24/7 Support",
          secondary: "Instant Response",
          description: "Chat with us now",
          bgColor: "bg-blue-500",
          hoverColor: "hover:bg-blue-600",
          action: "livechat",
        },
      ]
    : defaultContactMethods;

  const businessHours = companyInfo?.openingHours
    ? [
        { day: "General Hours", time: companyInfo.openingHours },
        ...(companyInfo.close
          ? [{ day: "Closed On", time: companyInfo.close }]
          : []),
      ]
    : (companyInfo as any)?.officeHours?.length
      ? (companyInfo as any).officeHours.map((hour: any) => ({
          day: hour.day,
          time: `${hour.open} - ${hour.close}`,
        }))
      : defaultBusinessHours;

  const socialLinks = companyInfo?.socialLinks
    ? [
        ...(companyInfo.socialLinks.facebook
          ? [
              {
                icon: <Facebook className="h-5 w-5" />,
                name: "Facebook",
                url: companyInfo.socialLinks.facebook,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.instagram
          ? [
              {
                icon: <Instagram className="h-5 w-5" />,
                name: "Instagram",
                url: companyInfo.socialLinks.instagram,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.twitter
          ? [
              {
                icon: <Twitter className="h-5 w-5" />,
                name: "Twitter",
                url: companyInfo.socialLinks.twitter,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.linkedin
          ? [
              {
                icon: <Linkedin className="h-5 w-5" />,
                name: "LinkedIn",
                url: companyInfo.socialLinks.linkedin,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.youtube
          ? [
              {
                icon: <Youtube className="h-5 w-5" />,
                name: "YouTube",
                url: companyInfo.socialLinks.youtube,
              },
            ]
          : []),
      ]
    : defaultSocialLinks;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800">
            Get In Touch
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Contact us to plan your dream vacation. We're here to make your
            travel experience unforgettable and provide excellent service.
          </p>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-blue-500"></div>
        </div>

        {/* Contact Methods Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, index) => {
            const isPhone = method.type === "phone";
            const isEmail = method.type === "email";
            const isExpandable = isPhone || isEmail;
            const allItems = (method as any).allItems || [];
            const isHovered = isPhone
              ? isPhoneHovered
              : isEmail
                ? isEmailHovered
                : false;

            return (
              <div
                key={index}
                onMouseEnter={() => {
                  if (isPhone) setIsPhoneHovered(true);
                  if (isEmail) setIsEmailHovered(true);
                }}
                onMouseLeave={() => {
                  if (isPhone) setIsPhoneHovered(false);
                  if (isEmail) setIsEmailHovered(false);
                }}
                onClick={(e) => {
                  if (method.action === "livechat") {
                    openLiveChat(e);
                  } else if (method.action === "office") {
                    handleOfficeClick(e);
                  } else if (method.action !== "#" && !isExpandable) {
                    window.open(method.action, "_self");
                  } else if (isExpandable && allItems.length > 0) {
                    // For phone, open first number; for email, open first email
                    const firstItem = allItems[0];
                    if (isPhone) {
                      window.open(
                        `tel:${firstItem.replace(/\s+/g, "")}`,
                        "_self"
                      );
                    } else if (isEmail) {
                      window.open(`mailto:${firstItem}`, "_self");
                    }
                  }
                }}
                className={`group relative transform cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-md ${
                  isExpandable && allItems.length > 2
                    ? `lg:transition-all lg:duration-500 ${
                        isHovered ? "lg:min-h-[200px]" : "lg:min-h-0"
                      }`
                    : ""
                } ${
                  method.action === "livechat"
                    ? "hover:border-blue-300 active:scale-95"
                    : method.action === "office"
                      ? "hover:border-blue-300 active:scale-95"
                      : ""
                }`}
              >
                {/* Ripple container for live chat and office */}
                {(method.action === "livechat" ||
                  method.action === "office") && (
                  <div className="ripple-container absolute inset-0" />
                )}

                {/* Glow effect for live chat and office on hover */}
                {method.action === "livechat" && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-green-400/20 to-blue-400/20" />
                  </div>
                )}
                {method.action === "office" && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20" />
                  </div>
                )}

                <div
                  className={`${method.bgColor} ${method.hoverColor} relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110 ${
                    method.action === "livechat"
                      ? "group-hover:rotate-12"
                      : method.action === "office"
                        ? "group-hover:rotate-12"
                        : ""
                  }`}
                >
                  {method.icon}
                </div>
                <h3 className="relative z-10 mb-2 text-lg font-bold text-gray-800">
                  {method.title}
                </h3>

                {/* Show all items on mobile or when hovered on large devices */}
                {isExpandable && allItems.length > 2 ? (
                  <>
                    {/* Mobile: Always show all items */}
                    <div className="relative z-10 space-y-2 lg:hidden">
                      {allItems.map((item: string, itemIndex: number) => (
                        <a
                          key={itemIndex}
                          href={
                            isPhone
                              ? `tel:${item.replace(/\s+/g, "")}`
                              : `mailto:${item}`
                          }
                          onClick={(e) => e.stopPropagation()}
                          className={`block font-medium transition-colors duration-200 ${
                            itemIndex === 0
                              ? "text-blue-600 hover:text-blue-700"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          {item}
                        </a>
                      ))}
                    </div>

                    {/* Desktop: Show 2 items initially, all on hover */}
                    <div className="relative z-10 hidden lg:block">
                      {/* Initial 2 items */}
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          isHovered
                            ? "mb-0 max-h-0 overflow-hidden opacity-0"
                            : "mb-3 max-h-[100px] opacity-100"
                        }`}
                      >
                        <p className="mb-1 font-medium text-blue-600">
                          {method.primary}
                        </p>
                        {method.secondary && (
                          <p className="text-sm text-gray-500">
                            {method.secondary}
                          </p>
                        )}
                      </div>

                      {/* All items on hover */}
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          isHovered
                            ? "mb-3 max-h-[500px] opacity-100"
                            : "mb-0 max-h-0 overflow-hidden opacity-0"
                        }`}
                      >
                        <div className="space-y-2">
                          {allItems.map((item: string, itemIndex: number) => (
                            <a
                              key={itemIndex}
                              href={
                                isPhone
                                  ? `tel:${item.replace(/\s+/g, "")}`
                                  : `mailto:${item}`
                              }
                              onClick={(e) => e.stopPropagation()}
                              className={`block font-medium transition-colors duration-200 ${
                                itemIndex === 0
                                  ? "text-blue-600 hover:text-blue-700"
                                  : "text-gray-600 hover:text-blue-600"
                              }`}
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="relative z-10 mb-1 font-medium text-blue-600">
                      {method.primary}
                    </p>
                    {method.secondary && (
                      <p className="relative z-10 mb-3 text-sm text-gray-500">
                        {method.secondary}
                      </p>
                    )}
                  </>
                )}

                <p className="relative z-10 mb-4 text-xs text-gray-400">
                  {method.description}
                </p>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(34, 197, 94, 0.4);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
          }

          @keyframes ripple-animation {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>

        {/* Business Hours & Social Links */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Business Hours */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Office Hours</h3>
            </div>

            <div className="space-y-4">
              {businessHours.map((hour: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
                >
                  <span className="font-medium text-gray-700">{hour.day}</span>
                  <span className="font-semibold text-blue-600">
                    {hour.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">
                <Clock className="mr-2 inline h-4 w-4" />
                Emergency Support: 24/7 Available
              </p>
            </div>
          </div>

          {/* Social Media & Quick Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Connect With Us
              </h3>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <p className="mb-4 text-gray-600">
                Follow us on social media for updates:
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex h-12 w-12 transform items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-all duration-300 hover:scale-110 hover:bg-blue-600"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-3">
              {companyInfo?.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-3 h-4 w-4 text-blue-500" />
                  <span>{companyInfo.address}</span>
                </div>
              )}
              {companyInfo?.description && (
                <div className="flex items-center text-gray-600">
                  <MessageCircle className="mr-3 h-4 w-4 text-blue-500" />
                  <span className="text-sm">{companyInfo.description}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            {/* <button className="mt-6 w-full transform rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 font-bold text-purple-900 shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-600">
              Book Consultation Now
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
