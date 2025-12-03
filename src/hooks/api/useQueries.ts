import { IQuery } from "@/types/schemas";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";

// Mock API functions - replace with actual API calls
const mockApiCalls = {
  getQueries: async (): Promise<IQuery[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        _id: "1",
        formType: "package_tour",
        name: "John Doe",
        email: "john.doe@email.com",
        contactNumber: "+1234567890",
        startingDate: new Date("2024-03-15"),
        returnDate: new Date("2024-03-25"),
        airlineTicketCategory: "economy",
        specialRequirements: "Vegetarian meals preferred",
        visitingCountry: "Thailand",
        visitingCities: "Bangkok, Phuket, Chiang Mai",
        status: "pending",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        _id: "2",
        formType: "hajj_umrah",
        name: "Sarah Ahmed",
        email: "sarah.ahmed@email.com",
        contactNumber: "+1234567891",
        startingDate: new Date("2024-06-10"),
        returnDate: new Date("2024-06-25"),
        airlineTicketCategory: "business",
        nightsStayMakkah: 10,
        nightsStayMadinah: 5,
        maleAdults: 2,
        femaleAdults: 1,
        childs: 1,
        accommodationType: "4_star",
        foodsIncluded: true,
        guideRequired: true,
        privateTransportation: false,
        status: "reviewed",
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-16"),
      },
    ];
  },

  updateQueryStatus: async (id: string, status: string): Promise<IQuery> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      _id: id,
      formType: "package_tour",
      name: "Updated Query",
      email: "updated@email.com",
      contactNumber: "+1234567890",
      startingDate: new Date(),
      returnDate: new Date(),
      airlineTicketCategory: "economy",
      status: status as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  deleteQuery: async (_id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export function useQueries() {
  const [queries, setQueries] = useState<IQuery[]>([]);
  const { loading, error, execute } = useApi(mockApiCalls.getQueries);

  const fetchQueries = async () => {
    const result = await execute();
    if (result) {
      setQueries(result);
    }
  };

  const updateQueryStatus = useApi(mockApiCalls.updateQueryStatus);
  const deleteQuery = useApi(mockApiCalls.deleteQuery);

  const handleUpdateStatus = async (id: string, status: string) => {
    const result = await updateQueryStatus.execute(id, status);
    if (result) {
      setQueries((prev) =>
        prev.map((query) =>
          query._id === id
            ? { ...query, status: status as any, updatedAt: new Date() }
            : query
        )
      );
    }
  };

  const handleDeleteQuery = async (id: string) => {
    const result = await deleteQuery.execute(id);
    if (result !== null) {
      setQueries((prev) => prev.filter((query) => query._id !== id));
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return {
    queries,
    loading,
    error,
    refetch: fetchQueries,
    updateQueryStatus: handleUpdateStatus,
    deleteQuery: handleDeleteQuery,
    isUpdating: updateQueryStatus.loading,
    isDeleting: deleteQuery.loading,
  };
}

export default useQueries;
