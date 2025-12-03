/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// pages/contact.js or components/ContactForm.js
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import {
  ContactFormData,
  useSubmitContactMutation,
} from "@/redux/api/features/contact/contactApi";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";
import ContactInfoSection from "./ContactInfo";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isRobot, setIsRobot] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [submitContact, { isLoading: isSubmitting }] =
    useSubmitContactMutation();

  // Get company info using custom hook
  const { companyInfo } = useCompanyInfo();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      const message = "Name is required";
      setSubmitStatus({ type: "error", message });
      toast.error(message, { duration: 3000, position: "top-center" });
      return false;
    }
    if (!formData.email.trim()) {
      const message = "Email is required";
      setSubmitStatus({ type: "error", message });
      toast.error(message, { duration: 3000, position: "top-center" });
      return false;
    }
    if (!formData.phone.trim()) {
      const message = "Phone number is required";
      setSubmitStatus({ type: "error", message });
      toast.error(message, { duration: 3000, position: "top-center" });
      return false;
    }
    if (!formData.message.trim()) {
      const message = "Message is required";
      setSubmitStatus({ type: "error", message });
      toast.error(message, { duration: 3000, position: "top-center" });
      return false;
    }
    if (!isRobot) {
      const message = "Please verify you are not a robot";
      setSubmitStatus({ type: "error", message });
      toast.error(message, { duration: 3000, position: "top-center" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous status
    setSubmitStatus({ type: null, message: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const response = await submitContact(formData).unwrap();

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message:
            response.message ||
            "Message sent successfully! We'll get back to you soon.",
        });

        // Track successful form submission
        analytics.trackFormSubmit("Contact Form", true, {
          email: formData.email,
          phone: formData.phone,
        });

        // Show success toast
        toast.success(
          response.message ||
            "Message sent successfully! We'll get back to you soon.",
          {
            duration: 4000,
            position: "top-center",
          }
        );

        // Reset form
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsRobot(false);
      } else {
        setSubmitStatus({
          type: "error",
          message:
            response.message || "Failed to send message. Please try again.",
        });
        
        // Track failed form submission
        analytics.trackFormSubmit("Contact Form", false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again later.";

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });

      // Track error
      analytics.trackFormSubmit("Contact Form", false);
      analytics.trackError(errorMessage, "contact_form_submission");

      // Show error toast
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="bg-white">
      <ContactInfoSection />
      <div className="b min-h-screen p-4">
        <div className="container mx-auto">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Google Maps Section */}
              <div className="map-section relative h-96 min-h-[600px] lg:h-full">
                {/* Map Container */}
                <div className="h-full w-full">
                  <iframe
                    src={
                      companyInfo?.googleMapUrl ||
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4329.8649687502675!2d90.41140497533779!3d23.81132617862879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c6553bf21b09%3A0x39b5dcbc4826be6d!2sGateway Holidays Ltd.!5e1!3m2!1sen!2sbd!4v1757485902786!5m2!1sen!2sbd"
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-l-2xl lg:rounded-l-2xl lg:rounded-r-none"
                  />
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="contact-form-section bg-gray-50 p-8 lg:p-12">
                <div className="mx-auto max-w-md">
                  <h2 className="mb-8 text-3xl font-bold text-gray-800">
                    Contact Form
                  </h2>

                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div
                      className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${
                        submitStatus.type === "success"
                          ? "border border-green-200 bg-green-50 text-green-800"
                          : "border border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">
                        {submitStatus.message}
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Contact No
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter Contact No"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter Message"
                        rows={4}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Robot Checkbox */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="robot-check"
                        checked={isRobot}
                        onChange={(e) => setIsRobot(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="robot-check"
                        className="text-sm text-gray-700"
                      >
                        I'm not a robot
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
