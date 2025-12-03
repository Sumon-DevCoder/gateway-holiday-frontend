/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCreateQueryMutation } from "@/redux/api/features/queries/queriesApi";
import { CreateQueryRequest } from "@/types/queries";
import { useState } from "react";
import { toast } from "sonner";

export const useQuerySubmit = () => {
  const [createQuery, { isLoading }] = useCreateQueryMutation();
  const [error, setError] = useState<string | null>(null);

  const submitQuery = async (
    formData: any,
    formType: string
  ): Promise<void> => {
    setError(null);

    try {
      // Login check removed - users can now submit queries without logging in

      // Validate required fields
      if (!formData.name || !formData.contactNumber) {
        throw new Error("Please fill in all required fields");
      }

      if (!formData.startingDate || !formData.returnDate) {
        throw new Error("Please select both starting and return dates");
      }

      if (new Date(formData.returnDate) <= new Date(formData.startingDate)) {
        throw new Error("Return date must be after starting date");
      }

      // Map form data to backend schema
      const queryData: CreateQueryRequest = {
        formType: formType as any,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        startingDate: formData.startingDate,
        returnDate: formData.returnDate,
        airlineTicketCategory: (
          formData.airlineTicketCategory || formData.airlineChoice
        )?.replace("-", "_") as any,
        specialRequirements: formData.specialRequirements?.trim() || undefined,
      };

      // Add form-specific validation
      if (formType === "hajj_umrah") {
        if (!formData.accommodationType) {
          throw new Error("Please select accommodation type");
        }
        if (
          formData.foodsIncluded === "" ||
          formData.guideRequired === "" ||
          formData.privateTransportation === ""
        ) {
          throw new Error("Please answer all yes/no questions");
        }
      } else if (formType === "package_tour") {
        if (!formData.visitingCountry) {
          throw new Error("Please specify visiting country");
        }
        if (!formData.persons || formData.persons < 1) {
          throw new Error("Please specify number of persons");
        }
        if (
          !formData.needsVisa ||
          (formData.needsVisa !== "yes" && formData.needsVisa !== "no")
        ) {
          throw new Error("Please specify if visa is required");
        }
      }

      // Add form-specific fields
      if (formType === "hajj_umrah") {
        queryData.nightsStayMakkah = formData.makkahNights;
        queryData.nightsStayMadinah = formData.madinaNights;
        queryData.maleAdults = formData.maleAdults;
        queryData.femaleAdults = formData.femaleAdults;
        queryData.childs = formData.children;
        queryData.accommodationType = formData.accommodationType?.replace(
          "-",
          "_"
        ) as any;
        queryData.foodsIncluded = formData.foodsIncluded === "yes";
        queryData.guideRequired = formData.guideRequired === "yes";
        queryData.privateTransportation =
          formData.privateTransportation === "yes";
      } else if (formType === "package_tour") {
        queryData.visitingCountry = formData.visitingCountry;
        queryData.visitingCities = formData.visitingCities || undefined;
        queryData.persons = formData.persons;
        queryData.needsVisa = formData.needsVisa === "yes";
      }

      await createQuery(queryData).unwrap();

      toast.success(
        "Query submitted successfully! We'll get back to you within 24 hours.",
        {
          duration: 4000,
          position: "top-center",
        }
      );
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to submit query. Please try again.";
      setError(errorMessage);

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });

      throw err;
    }
  };

  return { loading: isLoading, error, submitQuery };
};
