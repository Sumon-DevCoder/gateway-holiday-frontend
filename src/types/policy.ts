export interface IPolicyPage {
    _id: string;
    slug: "terms" | "privacy" | "refund";
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface PolicyPageProps {
    policy: IPolicyPage;
}

export type PolicySlug = "terms" | "privacy" | "refund";

// API Request/Response Types
export interface CreatePolicyPageRequest {
    slug: "terms" | "privacy" | "refund";
    content: string;
}

export interface UpdatePolicyPageRequest {
    content: string;
}

export interface PolicyPageResponse {
    success: boolean;
    message: string;
    data: IPolicyPage;
}

export interface PolicyPagesListResponse {
    success: boolean;
    message: string;
    data: IPolicyPage[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}