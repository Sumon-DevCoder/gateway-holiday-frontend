"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";

export default function PricingTiersField() {
  const { control } = useFormContext();

  // useFieldArray for dynamic fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingTiers",
  });

  return (
    <div className="col-span-2 mt-6 p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Pricing Tiers</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4"
        >
          {/* Tier Code */}
          <CustomSelect
            name={`pricingTiers.${index}.code`}
            label="Tiers"
            options={[
              { label: "Single", value: "SINGLE" },
              { label: "Couple", value: "COUPLE" },
            ]}
            required
          />

          {/* Price */}
          <CustomInput
            type="number"
            name={`pricingTiers.${index}.price`}
            label="Price"
            placeholder="e.g., 1000"
            required
          />

          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      {/* Add New Tier */}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ code: "", price: "" })}
      >
        + Add Pricing Tier
      </Button>
    </div>
  );
}
