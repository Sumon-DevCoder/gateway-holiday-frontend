"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CompanyImagesFormProps {
  companyImages?: any;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CompanyImagesForm({
  companyImages,
  onCancel,
  isLoading = false,
}: CompanyImagesFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        {companyImages ? "Update Company Images" : "Add Company Images"}
      </h3>

      {/* Affiliation Images */}
      <div className="space-y-2">
        <Label>
          {companyImages ? "Affiliation Images" : "Affiliation Images *"}
        </Label>
        <CustomFileUploader
          name="affiliation"
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
          }}
          required={!companyImages}
          multiple={true}
          existingImages={companyImages?.affiliation}
        />
      </div>

      {/* Payment Accept Images */}
      <div className="space-y-2">
        <Label>
          {companyImages ? "Payment Accept Images" : "Payment Accept Images *"}
        </Label>
        <CustomFileUploader
          name="paymentAccept"
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
          }}
          required={!companyImages}
          multiple={true}
          existingImages={companyImages?.paymentAccept}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {companyImages ? "Updating..." : "Creating..."}
            </>
          ) : companyImages ? (
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
