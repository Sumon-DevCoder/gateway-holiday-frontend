import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface CustomCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const CustomCheckbox = <T extends FieldValues>({
  name,
  label,
  disabled,
  className,
}: CustomCheckboxProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={`space-y-2 ${className}`}>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            {label && <Label htmlFor={name}>{label}</Label>}
          </div>
          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default CustomCheckbox;
