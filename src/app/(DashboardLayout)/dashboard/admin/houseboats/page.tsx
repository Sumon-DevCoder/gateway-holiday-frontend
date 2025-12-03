"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomMultiSelect from "@/components/CustomFormComponents/CustomMultiSelect";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";
import CustomTextarea from "@/components/CustomFormComponents/CustomTextarea";
import DynamicRichTextEditor from "@/components/CustomFormComponents/DynamicRichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  DollarSign,
  ImageIcon,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Ship,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PricingTier {
  type: string;
  price: number;
}

interface SelectOption {
  value: string | boolean;
  label: string;
}

interface HouseboatFormData {
  name: string;
  shortDescription: string;
  available: boolean;
  discount: number;
  discountType: string;
  facilities: string[];
  cabins: string[];
  layoutImage: File;
  images: File[];
  offerimages: File[];
  description: string;
}

const HouseboatPage = (): React.ReactElement => {
  const [description, setDescription] = useState<string>("");
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { type: "weekday", price: 0 },
    { type: "weekend", price: 0 },
    { type: "holiday", price: 0 },
  ]);

  // Form options
  const facilitiesOptions: SelectOption[] = [
    { value: "wifi", label: "WiFi" },
    { value: "ac", label: "Air Conditioning" },
    { value: "kitchen", label: "Kitchen" },
    { value: "bathroom", label: "Private Bathroom" },
    { value: "deck", label: "Sun Deck" },
    { value: "fishing", label: "Fishing Equipment" },
    { value: "kayak", label: "Kayak" },
    { value: "bbq", label: "BBQ Grill" },
    { value: "music", label: "Sound System" },
    { value: "tv", label: "Television" },
  ];

  const cabinOptions: SelectOption[] = [
    { value: "single", label: "Single Cabin" },
    { value: "double", label: "Double Cabin" },
    { value: "family", label: "Family Cabin" },
    { value: "luxury", label: "Luxury Suite" },
    { value: "economy", label: "Economy Cabin" },
  ];

  const discountTypeOptions: SelectOption[] = [
    { value: "flat", label: "Flat Amount" },
    { value: "%", label: "Percentage" },
  ];

  const availabilityOptions: SelectOption[] = [
    { value: true, label: "Available" },
    { value: false, label: "Not Available" },
  ];

  const addPricingTier = (): void => {
    setPricingTiers([...pricingTiers, { type: "", price: 0 }]);
  };

  const removePricingTier = (index: number): void => {
    if (pricingTiers.length > 1) {
      setPricingTiers(pricingTiers.filter((_, i) => i !== index));
    }
  };

  // const updatePricingTier = (
  //   index: number,
  //   field: keyof PricingTier,
  //   value: string | number
  // ): void => {
  //   const updated = pricingTiers.map((tier, i) =>
  //     i === index ? { ...tier, [field]: value } : tier
  //   );
  //   setPricingTiers(updated);
  // };

  const onSubmit = async (data: HouseboatFormData): Promise<void> => {
    // Enhanced validation
    if (!data.name.trim()) {
      toast.error("Please enter houseboat name");
      return;
    }

    if (data.name.trim().length < 3) {
      toast.error("Houseboat name must be at least 3 characters long");
      return;
    }

    if (data.name.trim().length > 100) {
      toast.error("Houseboat name must be less than 100 characters");
      return;
    }

    if (!data.shortDescription.trim()) {
      toast.error("Please enter a short description");
      return;
    }

    if (data.shortDescription.trim().length < 10) {
      toast.error("Short description must be at least 10 characters long");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a detailed description");
      return;
    }

    if (description.trim().length < 50) {
      toast.error("Description must be at least 50 characters long");
      return;
    }

    if (!data.layoutImage) {
      toast.error("Please upload a layout image");
      return;
    }

    if (!data.images || data.images.length === 0) {
      toast.error("Please upload at least one houseboat image");
      return;
    }

    if (data.facilities.length === 0) {
      toast.error("Please select at least one facility");
      return;
    }

    if (data.cabins.length === 0) {
      toast.error("Please select at least one cabin type");
      return;
    }

    // Validate pricing tiers
    for (const tier of pricingTiers) {
      if (tier.price < 0) {
        toast.error("All prices must be non-negative");
        return;
      }
      if (tier.price > 100000) {
        toast.error("Price cannot exceed 100,000");
        return;
      }
    }

    // Validate discount
    if (data.discount < 0 || data.discount > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }

    try {
      // TODO: Implement houseboat creation API call

      toast.success("Houseboat created successfully!");
    } catch (error) {
      toast.error("Failed to create houseboat");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-6"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Ship className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-3xl font-bold">
            Houseboat Management
          </h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage your houseboat listings with comprehensive details
        </p>
      </motion.div>

      <CustomForm onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Basic Information */}
          <motion.div variants={cardVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CustomInput
                  name="name"
                  label="Houseboat Name"
                  placeholder="Enter houseboat name"
                  required
                />

                <CustomTextarea
                  name="shortDescription"
                  label="Short Description"
                  placeholder="Brief description for listings"
                  rows={3}
                />

                <CustomSelect
                  name="available"
                  label="Availability Status"
                  options={availabilityOptions}
                  required
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Configuration */}
          <motion.div variants={cardVariants}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricingTiers.map((_tier, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-muted flex items-center gap-2 rounded-lg p-3"
                  >
                    {/* Fixed: Removed value and onChange props since CustomSelect uses react-hook-form */}
                    <CustomSelect
                      name={`pricing_type_${index}`}
                      label=""
                      options={[
                        { value: "weekday", label: "Weekday" },
                        { value: "weekend", label: "Weekend" },
                        { value: "holiday", label: "Holiday" },
                      ]}
                      className="flex-1"
                    />
                    <CustomInput
                      name={`pricing_price_${index}`}
                      type="number"
                      label=""
                      placeholder="Price"
                      className="flex-1"
                    />
                    {pricingTiers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePricingTier(index)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPricingTier}
                  className="w-full bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pricing Tier
                </Button>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    name="discount"
                    type="number"
                    label="Discount Amount"
                    placeholder="0"
                  />
                  <CustomSelect
                    name="discountType"
                    label="Discount Type"
                    options={discountTypeOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features and Amenities */}
        <motion.div variants={cardVariants}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Features & Amenities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomMultiSelect
                  name="facilities"
                  label="Facilities"
                  options={facilitiesOptions}
                  required
                />

                <CustomMultiSelect
                  name="cabins"
                  label="Cabin Types"
                  options={cabinOptions}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Images */}
        <motion.div variants={cardVariants}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomFileUploader
                  name="layoutImage"
                  label="Layout Image"
                  accept={{ "image/*": [] }}
                  multiple={false}
                />

                <CustomFileUploader
                  name="images"
                  label="Gallery Images"
                  accept={{ "image/*": [] }}
                  multiple={true}
                />
              </div>

              <CustomFileUploader
                name="offerimages"
                label="Promotional Images"
                accept={{ "image/*": [] }}
                multiple={true}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Description */}
        <motion.div variants={cardVariants}>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Detailed Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicRichTextEditor
                name="description"
                label="Full Description"
                content={description}
                onChangeHandler={setDescription}
                required
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={cardVariants}
          className="flex justify-end gap-4 pt-6"
        >
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Form
          </Button>

          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Create Houseboat
          </Button>
        </motion.div>
      </CustomForm>
    </motion.div>
  );
};

export default HouseboatPage;
