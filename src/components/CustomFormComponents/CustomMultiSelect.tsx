"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface SelectOption {
  value: string | boolean;
  label: string;
}

interface CustomMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string | boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: SelectOption[];
  className?: string;
}

function CustomMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Select options",
  required,
  disabled,
  options,
  className,
}: CustomMultiSelectProps<T>): React.ReactElement {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{ 
          required: required ? "This field is required" : false,
          ...(required && {
            validate: (value: any) => {
              if (!value || !Array.isArray(value) || value.length === 0) {
                return "This field is required";
              }
              return true;
            }
          })
        }}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value)
            ? field.value
            : [];

          const handleSelect = (value: string) => {
            if (!selectedValues.includes(value)) {
              field.onChange([...selectedValues, value]);
            }
          };

          const handleRemove = (valueToRemove: string) => {
            field.onChange(
              selectedValues.filter((value: string) => value !== valueToRemove)
            );
          };

          const getSelectedLabels = () => {
            return selectedValues.map((value: string) => {
              const option = options.find(
                (opt) => String(opt.value) === String(value)
              );
              return option ? option.label : value;
            });
          };

          return (
            <div className={`${className || ""}`}>
              {label && (
                <label htmlFor={name} className="text-lg font-semibold">
                  {label}
                </label>
              )}

              <div className="space-y-2">
                {/* Selected items display */}
                {selectedValues.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {getSelectedLabels().map((label, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemove(selectedValues[index]!)}
                          className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Select dropdown */}
                <Select
                  onValueChange={handleSelect}
                  disabled={disabled || false}
                >
                  <SelectTrigger className="w-full" id={name}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options
                      .filter(
                        (option) =>
                          !selectedValues.includes(String(option.value))
                      )
                      .map((option) => (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {errors?.[name] && (
                <small style={{ color: "red" }}>
                  {errors?.[name]?.message as string}
                </small>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}

export default CustomMultiSelect;
