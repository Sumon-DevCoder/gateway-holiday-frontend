import { ITeam } from "@/types/schemas";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";

// Mock API functions - replace with actual API calls
const mockApiCalls = {
  getTeamMembers: async (): Promise<ITeam[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        _id: "1",
        name: "John Smith",
        designation: "CEO & Founder",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-01").toISOString(),
      },
      {
        _id: "2",
        name: "Sarah Johnson",
        designation: "Travel Consultant",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        createdAt: new Date("2024-01-02").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
    ];
  },

  createTeamMember: async (
    data: Omit<ITeam, "_id" | "createdAt" | "updatedAt">
  ): Promise<ITeam> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateTeamMember: async (
    id: string,
    data: Partial<ITeam>
  ): Promise<ITeam> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      _id: id,
      name: data.name || "Updated Member",
      designation: data.designation || "Updated Designation",
      image: data.image || "",
      createdAt: new Date("2024-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  deleteTeamMember: async (_id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<ITeam[]>([]);
  const { loading, error, execute } = useApi(mockApiCalls.getTeamMembers);

  const createTeamMember = useApi(mockApiCalls.createTeamMember);
  const updateTeamMember = useApi(mockApiCalls.updateTeamMember);
  const deleteTeamMember = useApi(mockApiCalls.deleteTeamMember);

  const fetchTeamMembers = async () => {
    const result = await execute();
    if (result) {
      setTeamMembers(result);
    }
  };

  const handleCreateMember = async (
    data: Omit<ITeam, "_id" | "createdAt" | "updatedAt">
  ) => {
    const result = await createTeamMember.execute(data);
    if (result) {
      setTeamMembers((prev) => [...prev, result]);
    }
    return result;
  };

  const handleUpdateMember = async (id: string, data: Partial<ITeam>) => {
    const result = await updateTeamMember.execute(id, data);
    if (result) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member._id === id
            ? { ...member, ...data, updatedAt: new Date().toISOString() }
            : member
        )
      );
    }
    return result;
  };

  const handleDeleteMember = async (id: string) => {
    const result = await deleteTeamMember.execute(id);
    if (result !== null) {
      setTeamMembers((prev) => prev.filter((member) => member._id !== id));
    }
    return result;
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers,
    createMember: handleCreateMember,
    updateMember: handleUpdateMember,
    deleteMember: handleDeleteMember,
    isCreating: createTeamMember.loading,
    isUpdating: updateTeamMember.loading,
    isDeleting: deleteTeamMember.loading,
  };
}

export default useTeam;
