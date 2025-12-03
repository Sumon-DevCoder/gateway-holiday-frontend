import React from "react";
import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface CustomTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

const CustomTextarea = <T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  disabled,
  rows = 4, // default to 4 rows if not passed
  className,
}: CustomTextareaProps<T>): React.ReactElement => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div>
      <Controller
        name={name}
        rules={{ required: required ? "This field is required" : false }}
        control={control}
        render={({ field }) => (
          <div className={className}>
            {label && (
              <label
                htmlFor={name}
                className="text-lg font-semibold block mb-1"
              >
                {label}
              </label>
            )}

            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className="w-full"
            />

            {errors?.[name]?.message && (
              <small className="text-red-500">
                {errors[name]?.message as string}
              </small>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomTextarea;
