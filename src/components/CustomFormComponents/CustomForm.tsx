/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, cloneElement, isValidElement } from "react";
import { FieldValues, FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CustomFormProps<T extends FieldValues> {
  onSubmit: (data: T) => Promise<void> | void;
  children: ReactNode;
  defaultValues?: Partial<T>; // Changed from T to Partial<T>
  resolver?: Resolver<T>;
  className?: string;
  hideSubmitUntilValid?: boolean; // New prop to enable/disable this feature
}

function CustomForm<T extends FieldValues>({
  onSubmit,
  children,
  defaultValues,
  resolver,
  className,
  hideSubmitUntilValid = false,
}: CustomFormProps<T>): React.ReactElement {
  // Configure React Hook Form with passed props
  const formConfig: any = {
    mode: "onChange",
    reValidateMode: "onChange",
  };
  if (defaultValues) formConfig.defaultValues = defaultValues;
  if (resolver) formConfig.resolver = resolver;

  const methods = useForm<T>(formConfig);
  const {
    formState: { errors, isDirty },
  } = methods;

  // Form is valid when: no errors AND form has been modified (user has filled fields)
  const isFormValid = Object.keys(errors).length === 0 && isDirty;

  const submit = async (data: T): Promise<void> => {
    try {
      await onSubmit(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error submitting form: ${errorMessage}`);
    }
  };

  // Function to recursively process children and inject isValid prop into submit buttons
  const processChildren = (children: ReactNode): ReactNode => {
    return React.Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const childProps = child.props as any;

      // Check if it's a Button component with type="submit"
      if (
        child.type &&
        typeof child.type !== "string" &&
        (childProps?.type === "submit" ||
          child.type?.toString().includes("Button"))
      ) {
        // If hideSubmitUntilValid is enabled, disable button until form is valid
        if (hideSubmitUntilValid && childProps?.type === "submit") {
          return cloneElement(child, {
            ...childProps,
            disabled: !isFormValid || childProps?.disabled,
            className:
              `${childProps?.className || ""} ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`.trim(),
          } as any);
        }
      }

      // Recursively process children
      if (childProps?.children) {
        return cloneElement(child, {
          ...childProps,
          children: processChildren(childProps.children),
        } as any);
      }

      return child;
    });
  };

  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={methods.handleSubmit(submit)}>
        {hideSubmitUntilValid ? processChildren(children) : children}
      </form>
    </FormProvider>
  );
}

export default CustomForm;
