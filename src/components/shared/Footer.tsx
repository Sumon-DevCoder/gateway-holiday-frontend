import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useGetCompanyImagesQuery } from "@/redux/api/features/companyImages/companyImagesApi";
import {
  CreditCard,
  Facebook,
  FileText,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import newLogo from "../../../public/logo/logo.png";

interface FooterProps {
  // Remove companyData prop since we'll use the hook internally
}

const Footer = ({}: FooterProps) => {
  // Get company info using custom hook
  const {
    getPrimaryPhone,
    getPrimaryEmail,
    getAddress,
    getSocialLinks,
    getDescription,
    getCompanyName,
    getLogo,
  } = useCompanyInfo();

  // Get company images directly from API
  const { data: companyImagesResponse } = useGetCompanyImagesQuery();

  // Extract company images data
  const companyImages = Array.isArray(companyImagesResponse?.data)
    ? companyImagesResponse?.data?.[0]
    : companyImagesResponse?.data;

  // Get affiliation and payment images
  const affiliations = companyImages?.affiliation || [];

  const paymentMethods = companyImages?.paymentAccept || [];

  // Dynamic contact info from company data
  const contactInfo = {
    phone: getPrimaryPhone(),
    email: getPrimaryEmail(),
    address: getAddress(),
  };

  // Dynamic social links from company data
  const socialLinksData = getSocialLinks();
  const socialLinks = [
    {
      icon: Facebook,
      href: socialLinksData?.facebook || "#",
      color: "hover:text-blue-400",
      isActive: !!socialLinksData?.facebook,
    },
    {
      icon: Twitter,
      href: socialLinksData?.twitter || "#",
      color: "hover:text-sky-300",
      isActive: !!socialLinksData?.twitter,
    },
    {
      icon: Instagram,
      href: socialLinksData?.instagram || "#",
      color: "hover:text-pink-400",
      isActive: !!socialLinksData?.instagram,
    },
    {
      icon: Linkedin,
      href: socialLinksData?.linkedin || "#",
      color: "hover:text-blue-500",
      isActive: !!socialLinksData?.linkedin,
    },
    {
      icon: Youtube,
      href: socialLinksData?.youtube || "#",
      color: "hover:text-red-400",
      isActive: !!socialLinksData?.youtube,
    },
  ];

  return (
    <footer className="relative bg-linear-to-br from-teal-900 via-emerald-900 to-cyan-900 text-white">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-teal-600/20 via-emerald-600/20 to-cyan-600/20"></div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Responsive grid layout - 3 columns */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Company Info & Contact */}
          <div className="space-y-6">
            {/* Logo and title section */}
            <div className="space-y-4">
              <div className="flex w-2/3 items-center space-x-3 rounded-lg p-2">
                <Image
                  src={getLogo() || newLogo}
                  alt={getCompanyName() || "Gateway Holidays Logo"}
                  width={500}
                  height={500}
                  className="h-16 w-auto rounded-lg sm:h-20"
                  onError={(e) => {
                    // Fallback to static logo if dynamic logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = newLogo.src;
                  }}
                />
              </div>
              <p className="flex w-2/3 items-center text-sm text-slate-300">
                <Sparkles className="mr-2 h-4 w-4 text-teal-400" />
                {getDescription() || "Explore the world with wonders"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Phone</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm break-all text-slate-300 transition-colors hover:text-white"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Address
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks
                  .filter((social) => social.isActive)
                  .map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50 text-slate-300 transition-all hover:bg-teal-600 hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Quick Links - Policies */}
          <div className="mt-5 space-y-6">
            <h3 className="text-lg font-semibold text-white">
              Legal & Policies
            </h3>
            <div className="space-y-3">
              <Link
                href="/terms-conditions"
                className="flex items-center space-x-2 text-slate-300 transition-colors hover:text-white"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Terms & Conditions</span>
              </Link>
              <Link
                href="/privacy-policy"
                className="flex items-center space-x-2 text-slate-300 transition-colors hover:text-white"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/refund-policy"
                className="flex items-center space-x-2 text-slate-300 transition-colors hover:text-white"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Refund Policy</span>
              </Link>
            </div>
          </div>

          {/* Affiliations */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              Our Affiliations
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2">
              {affiliations?.map((affiliation: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-lg border border-slate-700 bg-white p-4 transition-all hover:border-teal-500"
                >
                  <div className="flex h-16 w-full items-center justify-center">
                    <Image
                      src={affiliation}
                      alt={`Affiliation ${index + 1}`}
                      width={120}
                      height={60}
                      className="h-full w-auto max-w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-slate-700/50 pt-8">
          <div className="space-y-6">
            <h3 className="text-center text-lg font-semibold text-white">
              We Accept
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {paymentMethods.map((method: string, index: number) => {
                const isImageUrl =
                  typeof method === "string" && method.startsWith("http");
                const methodName =
                  typeof method === "string" ? method : `Payment ${index + 1}`;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-center rounded-lg border border-slate-700 bg-white p-2 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="flex h-8 items-center justify-center sm:h-10">
                      {isImageUrl ? (
                        <Image
                          src={method}
                          alt={`Payment Method ${index + 1}`}
                          width={60}
                          height={40}
                          className="h-8 w-auto object-contain sm:h-10"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <>
                          {methodName === "Visa" && (
                            <CreditCard className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
                          )}
                          {methodName === "Mastercard" && (
                            <CreditCard className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
                          )}
                          {methodName === "bKash" && (
                            <span className="text-base font-bold text-pink-500 sm:text-lg">
                              bK
                            </span>
                          )}
                          {methodName === "Nagad" && (
                            <span className="text-base font-bold text-orange-500 sm:text-lg">
                              N
                            </span>
                          )}
                          {!["Visa", "Mastercard", "bKash", "Nagad"].includes(
                            methodName
                          ) && (
                            <Shield className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative border-t border-slate-700/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-3 text-center sm:flex-row sm:space-y-0">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Gateway Holidays Ltd. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Developed by</span>
              <a
                href="https://www.facebook.com/Sumon.DevCoder/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                DevCoder Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
