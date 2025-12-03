"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomTextarea from "@/components/CustomFormComponents/CustomTextarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
// Mutations are handled in the parent component
import { CompanyInfoFormData } from "@/types/companyInfo";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

interface CompanyFormProps {
  companyInfo?: any;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CompanyForm({
  companyInfo,
  onCancel,
  isLoading = false,
}: CompanyFormProps) {
  // Loading state is handled in the parent component

  const {
    control,
    formState: { errors },
  } = useFormContext<CompanyInfoFormData>();

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    // @ts-expect-error - Type issue with useFieldArray name property
    name: "email",
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    // @ts-expect-error - Type issue with useFieldArray name property
    name: "phone",
  });

  // Helper function to add fields
  const addEmailField = () => {
    appendEmail("");
  };

  const addPhoneField = () => {
    appendPhone("");
  };

  // Form submission is handled by CustomForm component

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        {companyInfo ? "Update Company Information" : "Add Company Information"}
      </h3>

      {/* Company Name */}
      <CustomInput
        name="companyName"
        label={companyInfo ? "Company Name" : "Company Name *"}
        placeholder="Enter company name"
        required={!companyInfo}
      />

      {/* Logo Upload */}
      <CustomFileUploader
        name="logo"
        label={companyInfo ? "Company Logo" : "Company Logo *"}
        accept={{ "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] }}
        required={!companyInfo}
        existingImages={companyInfo?.logo}
      />

      {/* Address */}
      <CustomTextarea
        name="address"
        label={companyInfo ? "Address" : "Address *"}
        placeholder="Enter company address"
        rows={3}
        required={!companyInfo}
      />

      {/* Description */}
      <CustomTextarea
        name="description"
        label="Description (Optional)"
        placeholder="Enter company description"
        rows={4}
      />

      {/* Google Maps URL */}
      <CustomInput
        name="googleMapUrl"
        label="Google Maps URL (Optional)"
        placeholder="Enter Google Maps URL"
      />

      {/* Email Fields */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{companyInfo ? "Email Addresses" : "Email Addresses *"}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEmailField}
          >
            Add Email
          </Button>
        </div>
        {emailFields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <CustomInput
                  name={`email.${index}` as any}
                  placeholder="Enter email"
                  required={!companyInfo}
                />
              </div>
              {emailFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeEmail(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Phone Fields */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{companyInfo ? "Phone Numbers" : "Phone Numbers *"}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPhoneField}
          >
            Add Phone
          </Button>
        </div>
        {phoneFields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <CustomInput
                  name={`phone.${index}` as any}
                  placeholder="Enter phone number"
                  required={!companyInfo}
                />
              </div>
              {phoneFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePhone(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div className="space-y-2">
        <Label>Social Media Links (Optional)</Label>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              "facebook",
              "twitter",
              "instagram",
              "linkedin",
              "youtube",
              "tiktok",
            ] as const
          ).map((platform) => (
            <div key={platform} className="space-y-1">
              <Label className="text-sm text-gray-600 capitalize">
                {platform}
              </Label>
              <CustomInput
                name={`socialLinks.${platform}` as any}
                placeholder={`Enter ${platform} URL (e.g., https://${platform}.com/username)`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Video */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          YouTube Video URL (Optional)
        </Label>
        <CustomInput
          name="youtube_video"
          placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
        />
        <p className="text-xs text-gray-500">
          Enter the full YouTube embed URL for the video you want to display
        </p>
      </div>

      {/* Years of Experience */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Years of Experience *</Label>
        <CustomInput
          name="yearsOfExperience"
          type="number"
          placeholder="e.g., 5"
          required={true}
        />
        <p className="text-xs text-gray-500">
          Enter the number of years your company has been in business
        </p>
      </div>

      {/* Customer Review Count */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Happy Travelers *</Label>
        <CustomInput
          name="customer_review"
          placeholder="e.g., 1200+"
          required={true}
        />
        <p className="text-xs text-gray-500">
          Enter the total number of travelers (you can include formatting like
          1200+)
        </p>
      </div>

      {/* Destinations */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Destinations *</Label>
        <CustomInput
          name="destinations"
          placeholder="e.g., 50+"
          required={true}
        />
        <p className="text-xs text-gray-500">
          Enter the number of destinations (you can include formatting like 50+)
        </p>
      </div>

      {/* Opening Hours */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Opening Hours *</Label>
        <CustomInput
          name="openingHours"
          placeholder="e.g., 09:00 AM - 06:00 PM"
          required={true}
        />
        <p className="text-xs text-gray-500">
          Enter opening hours in format: HH:MM AM/PM - HH:MM AM/PM
        </p>
      </div>

      {/* Close Day */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Close Day *</Label>
        <Controller
          name="close"
          control={control}
          rules={{ required: "Please select a close day" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select close day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.close && (
          <p className="text-sm text-red-500">{errors.close.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Select the day when your company is closed
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {companyInfo ? "Updating..." : "Creating..."}
            </>
          ) : companyInfo ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
