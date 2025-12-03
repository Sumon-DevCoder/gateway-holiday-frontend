export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string; // Changed from contact to phone to match backend
  profileImg?: string;
  status: "active" | "block" | "deactive";
  role: "user" | "admin" | "super_admin"; // Updated to match backend validation
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
}

export interface UserPermissions {
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canActivateUsers: boolean;
  canDeactivateUsers: boolean;
  canBlockUsers: boolean;
  canMakeModerator: boolean;
  canMakeAdmin: boolean;
  canDemoteUsers: boolean;
  canDeleteUsers: boolean;
  canViewUserDetails: boolean;
}

export interface UsersPageProps {
  initialUsers?: User[];
  initialStats?: UserStats;
  currentUser: CurrentUser;
}

export interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

export interface UserTableColumn {
  header: string;
  accessorKey: string;
  cell: (user: User) => React.ReactNode;
}

export type UserStatus = "active" | "block" | "deactive";
export type UserRole = "user" | "admin" | "super_admin";
export type UserStatusFilter = "all" | UserStatus;
export type UserRoleFilter = "all" | UserRole;

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  deactiveUsers: number;
  admins: number;
  moderators: number;
  regularUsers: number;
}

// API Request/Response interfaces
export interface CreateUserRequest {
  name?: string;
  email: string;
  phone?: string;
  profileImg?: string;
  password: string;
  status?: "active" | "block" | "deactive";
  role?: "user" | "admin" | "super_admin";
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  profileImg?: string;
  password?: string;
  status?: "active" | "block" | "deactive";
  role?: "user" | "admin" | "super_admin";
}

export interface ChangeUserStatusRequest {
  status: "active" | "block" | "deactive";
}

export interface ChangeUserRoleRequest {
  role: "user" | "admin" | "super_admin";
}

export interface UserFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: "active" | "block" | "deactive";
  role?: "user" | "admin" | "super_admin";
}

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number; // Changed from "totalPages" to "pages" to match backend majority pattern
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
