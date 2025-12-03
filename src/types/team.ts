

export interface ITeam {
    _id: string;
    name: string;
    designation: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export type TeamMember = ITeam;

export interface TeamSectionProps {
    initialTeamMembers?: TeamMember[];
    onFetchTeamMembers?: () => Promise<TeamMember[]>;
    loading?: boolean;
    error?: string | null;
}

export interface TeamApiResponse {
    success: boolean;
    data: ITeam[];
    message?: string;
    total?: number;
}

export interface TeamApiHooks {
    teamMembers: TeamMember[];
    loading: boolean;
    error: string | null;
    fetchTeamMembers: () => Promise<TeamMember[]>;
    refetch: () => void;
}
