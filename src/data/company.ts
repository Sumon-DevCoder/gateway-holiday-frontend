import { CompanyData } from "@/types/company";

export const companyInfo: CompanyData = {
  // Backend schema required fields
  companyName: "Gateway Holidays Ltd.",
  logo: "/logo/logo.png", // Default local logo path
  email: ["info@gatewayholidaysbd.com", "support@gatewayholidaysbd.com"],
  phone: [
    "01873 072 111",
    "01873 073 111",
    "01873 074 111",
    "01873 075 111",
    "01873 076 111",
  ],
  address: "House 511, Road 9, 3rd Floor, Baridhara DOHS, Dhaka, Bangladesh",

  // Backend schema optional fields
  googleMapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.2044961582933!2d90.41140497533779!3d23.81132617862879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c6553bf21b09%3A0x39b5dcbc4826be6d!2sGateway Holidays Ltd.!5e0!3m2!1sen!2sbd!4v1759473317826!5m2!1sen!2sbd",
  description:
    "The best travel agency in Bangladesh, delivering luxurious travel experiences at affordable rates.",

  // Backend schema social links
  socialLinks: {
    facebook: "https://www.facebook.com/gatewayholidaysbd",
    instagram: "https://www.instagram.com/gatewayholidays/#",
    linkedin: "https://bd.linkedin.com/company/gatewayholidaysbd",
    youtube: "https://youtube.com/@gatewayholidaysltd-f4j?si=zMrQ3dj94jqPMojU",
    tiktok: "https://tiktok.com/@gatewayholidaysbd",
  },

  // Backend schema opening hours (string format)
  yearsOfExperience: 5,
  customer_review: "1200+",
  destinations: "50+",
  openingHours: "11:00 AM - 07:00 PM",
  close: "Sunday", // Backend schema required field

  // Legacy officeHours for backward compatibility

  // Timestamps
  createdAt: "2024-03-15T08:30:00.000Z",
  updatedAt: "2024-03-20T14:45:30.000Z",
};
