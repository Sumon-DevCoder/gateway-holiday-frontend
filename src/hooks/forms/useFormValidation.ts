import { useState } from "react";

// Form validation schemas and hooks
// This is prepared for React Hook Form integration

export interface FormField {
  name: string;
  value: any;
  error?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: "text" | "email" | "url" | "number" | "date";
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export function useFormValidation(initialFields: Record<string, FormField>) {
  const [state, setState] = useState<FormState>({
    fields: initialFields,
    isValid: false,
    isDirty: false,
    isSubmitting: false,
    errors: {},
  });

  const validateField = (field: FormField): string | undefined => {
    if (
      field.required &&
      (!field.value || field.value.toString().trim() === "")
    ) {
      return `${field.name} is required`;
    }

    if (
      field.minLength &&
      field.value &&
      field.value.length < field.minLength
    ) {
      return `${field.name} must be at least ${field.minLength} characters`;
    }

    if (
      field.maxLength &&
      field.value &&
      field.value.length > field.maxLength
    ) {
      return `${field.name} must be no more than ${field.maxLength} characters`;
    }

    if (
      field.type === "email" &&
      field.value &&
      !/\S+@\S+\.\S+/.test(field.value)
    ) {
      return `${field.name} must be a valid email address`;
    }

    if (
      field.type === "url" &&
      field.value &&
      !/^https?:\/\/.+/.test(field.value)
    ) {
      return `${field.name} must be a valid URL`;
    }

    if (field.pattern && field.value && !field.pattern.test(field.value)) {
      return `${field.name} format is invalid`;
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.values(state.fields).forEach((field) => {
      const error = validateField(field);
      if (error) {
        errors[field.name] = error;
        isValid = false;
      }
    });

    setState((prev) => ({
      ...prev,
      errors,
      isValid,
    }));

    return isValid;
  };

  const updateField = (name: string, value: any) => {
    setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          value,
          error: undefined,
        } as any,
      },
      isDirty: true,
    }));
  };

  const setFieldError = (name: string, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error,
      },
    }));
  };

  const clearErrors = () => {
    setState((prev) => ({
      ...prev,
      errors: {},
    }));
  };

  const reset = () => {
    setState({
      fields: initialFields,
      isValid: false,
      isDirty: false,
      isSubmitting: false,
      errors: {},
    });
  };

  const setSubmitting = (isSubmitting: boolean) => {
    setState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  };

  return {
    ...state,
    updateField,
    setFieldError,
    clearErrors,
    validateForm,
    reset,
    setSubmitting,
  };
}

// Common validation patterns
export const validationPatterns = {
  email: /^\S+@\S+\.\S+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  name: /^[a-zA-Z\s]+$/,
};

// Common field configurations
export const commonFields = {
  name: {
    name: "name",
    value: "",
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: validationPatterns.name,
    type: "text" as const,
  },
  email: {
    name: "email",
    value: "",
    required: true,
    type: "email" as const,
    pattern: validationPatterns.email,
  },
  phone: {
    name: "phone",
    value: "",
    required: true,
    pattern: validationPatterns.phone,
    type: "text" as const,
  },
  url: {
    name: "url",
    value: "",
    required: false,
    type: "url" as const,
    pattern: validationPatterns.url,
  },
  description: {
    name: "description",
    value: "",
    required: false,
    maxLength: 500,
    type: "text" as const,
  },
};

export default useFormValidation;
