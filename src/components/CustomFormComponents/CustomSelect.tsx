"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface SelectOption {
  value: string | boolean;
  label: string;
}

interface CustomSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string | boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: SelectOption[];
  className?: string;
}

const CustomSelect = <T extends FieldValues>({
  name,
  label,
  placeholder = "Select an option",
  required,
  disabled,
  options,
  className,
}: CustomSelectProps<T>): React.ReactElement => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const hasError = !!errors?.[name];

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "This field is required" : false }}
        render={({ field }) => (
          <div className={`${className || ""}`}>
            {label && (
              <label htmlFor={name} className="text-lg font-semibold">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              disabled={disabled || false}
            >
              <SelectTrigger
                className={`w-full ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                id={name}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasError && (
              <small className="mt-1 block text-sm text-red-500">
                {errors?.[name]?.message as string}
              </small>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomSelect;
