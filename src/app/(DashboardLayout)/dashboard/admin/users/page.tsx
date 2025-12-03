"use client";

import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserFormData, createUserSchema } from "@/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Crown,
  // MoreHorizontal,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import {
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetUserStatsQuery,
} from "@/redux/api/features/user/usersApi";
import { useCurrentUser } from "@/redux/authSlice";
import {
  CurrentUser,
  User,
  UserDetailModalProps,
  UserRoleFilter,
  UserStatusFilter,
  UserTableColumn,
} from "@/types/user";
import { canManageUser, getUserPermissions } from "@/utils/permissions";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  deactive: "bg-gray-100 text-gray-800",
  block: "bg-red-100 text-red-800", // Changed from 'blocked' to 'block' to match backend
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  super_admin: "bg-red-100 text-red-800",
  user: "bg-yellow-100 text-yellow-800",
};

export default function UsersPage(): React.ReactElement {
  // Get the actual authenticated user from Redux store
  const authUser = useSelector(useCurrentUser);

  // Convert TUser to CurrentUser type
  const currentUser: CurrentUser | null =
    authUser && authUser._id
      ? {
          _id: authUser._id,
          name: authUser.name || "Unknown",
          email: authUser.email,
          role: authUser.role as "user" | "admin" | "super_admin",
        }
      : null;

  // State declarations
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  // API hooks - MUST be called before any conditional returns
  const {
    data: usersResponse,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery(
    {
      page: currentPage,
      limit: 10,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(roleFilter !== "all" && { role: roleFilter }),
    },
    {
      skip: !currentUser, // Skip query if not authenticated
      refetchOnMountOrArgChange: true, // Force refetch when component mounts or args change
    }
  );

  const {
    data: statsResponse,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetUserStatsQuery(undefined, {
    skip: !currentUser, // Skip query if not authenticated
    refetchOnMountOrArgChange: true,
  });

  const [changeUserStatus] = useChangeUserStatusMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const permissions = getUserPermissions(currentUser);

  // Show loading or redirect if user is not authenticated - AFTER all hooks
  if (!currentUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Lock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            Authentication Required
          </h3>
          <p className="text-muted-foreground">
            Please log in to access user management.
          </p>
        </div>
      </div>
    );
  }

  const usersData = usersResponse?.data || [];
  const stats = statsResponse?.data || {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    deactiveUsers: 0,
    admins: 0,
    moderators: 0,
    regularUsers: 0,
  };

  // Note: RTK Query automatically refetches when query parameters change
  // No need for manual useEffect refetch - it can cause unnecessary network requests
  // The query hook will automatically refetch when statusFilter, roleFilter, searchTerm, or currentPage changes

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }

    return undefined;
  }, [openDropdown]);

  if (!permissions.canViewUsers) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Lock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view user management.
          </p>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (
    userId: string,
    newStatus: "active" | "deactive" | "block"
  ): Promise<void> => {
    // Enhanced validation
    if (!userId || userId.trim() === "") {
      toast.error("Invalid user ID provided");
      return;
    }

    if (!newStatus || !["active", "deactive", "block"].includes(newStatus)) {
      toast.error("Invalid status provided");
      return;
    }

    const targetUser = usersData.find((user) => user._id === userId);
    if (!targetUser) {
      toast.error("User not found");
      return;
    }

    if (!canManageUser(currentUser, targetUser, newStatus)) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    // Prevent users from changing their own status
    if (currentUser && targetUser._id === currentUser._id) {
      toast.error("You cannot change your own status");
      return;
    }

    try {
      await changeUserStatus({
        id: userId,
        data: { status: newStatus },
      }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
      // Force refetch to ensure UI updates immediately
      await Promise.all([refetchUsers(), refetchStats()]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const handleRoleUpdate = async (
    userId: string,
    newRole: "user" | "admin" | "super_admin"
  ): Promise<void> => {
    // Enhanced validation
    if (!userId || userId.trim() === "") {
      toast.error("Invalid user ID provided");
      return;
    }

    if (!newRole || !["user", "admin", "super_admin"].includes(newRole)) {
      toast.error("Invalid role provided");
      return;
    }

    const targetUser = usersData.find((user) => user._id === userId);
    if (!targetUser) {
      toast.error("User not found");
      return;
    }

    if (!canManageUser(currentUser, targetUser, "roleChange")) {
      toast.error("You don't have permission to change this user's role");
      return;
    }

    // Prevent users from changing their own role
    if (currentUser && targetUser._id === currentUser._id) {
      toast.error("You cannot change your own role");
      return;
    }

    // Prevent downgrading super_admin role
    if (targetUser.role === "super_admin" && newRole !== "super_admin") {
      toast.error("Cannot downgrade super admin role");
      return;
    }

    try {
      await changeUserRole({
        id: userId,
        data: { role: newRole },
      }).unwrap();
      toast.success(`User role updated to ${newRole}`);
      // Force refetch to ensure UI updates immediately
      await Promise.all([refetchUsers(), refetchStats()]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (): Promise<void> => {
    // Enhanced validation
    if (!userToDelete) {
      toast.error("No user selected for deletion");
      return;
    }

    if (!userToDelete._id || userToDelete._id.trim() === "") {
      toast.error("Invalid user ID");
      return;
    }

    if (!canManageUser(currentUser, userToDelete, "delete")) {
      toast.error("You don't have permission to delete this user");
      return;
    }

    // Prevent users from deleting themselves
    if (currentUser && userToDelete._id === currentUser._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    // Prevent deleting super_admin users
    if (userToDelete.role === "super_admin") {
      toast.error("Cannot delete super admin users");
      return;
    }

    try {
      // Delete the user
      await deleteUser(userToDelete._id).unwrap();

      toast.success("User deleted successfully");

      // Close modal and clear state
      setDeleteModalOpen(false);
      setUserToDelete(null);

      // Force refetch to ensure UI updates immediately
      await Promise.all([refetchUsers(), refetchStats()]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const openDeleteModal = (user: User): void => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const handleCreateUser = async (data: CreateUserFormData): Promise<void> => {
    // Check permission based on role
    if (currentUser.role === "admin" && data.role !== "user") {
      toast.error("Admin can only create users with 'user' role");
      return;
    }

    if (currentUser.role === "super_admin" && data.role === "super_admin") {
      toast.error("Cannot create another super admin");
      return;
    }

    try {
      await createUser(data).unwrap();
      toast.success("User created successfully");
      // Only reset form and close modal on success
      setCreateModalOpen(false);
      setShowPassword(false);
      reset();
      // Force refetch to ensure UI updates immediately
      await Promise.all([refetchUsers(), refetchStats()]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user");
      // Don't reset form or close modal on error - keep user's input
    }
  };

  const getRoleOptions = () => {
    if (currentUser.role === "super_admin") {
      return [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ];
    }
    // Admin can only create regular users
    return [{ value: "user", label: "User" }];
  };

  // Watch form values for modal management
  const formRole = watch("role");

  const columns: UserTableColumn[] = [
    {
      header: "User",
      accessorKey: "user",
      cell: (user: User) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.profileImg || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-foreground font-medium">
              {user.name}
              {currentUser._id === user._id && (
                <span className="text-muted-foreground ml-2 text-xs">
                  (You)
                </span>
              )}
            </div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessorKey: "phone",
      cell: (user: User) => <span className="text-sm">{user.phone}</span>,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user: User) => (
        <Badge variant="secondary" className={roleColors[user.role]}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (user: User) => (
        <Badge variant="secondary" className={statusColors[user.status]}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Join Date",
      accessorKey: "createdAt",
      cell: (user: User) => new Date(user.createdAt).toLocaleDateString(),
    },
    // STATUS ACTIONS COLUMN
    {
      header: "Status Actions",
      accessorKey: "statusActions",
      cell: (user: User) => {
        const isOpen = openDropdown === `status-${user._id}`;
        const canManageThisUser = canManageUser(currentUser, user, "manage");

        if (!canManageThisUser) {
          return (
            <div className="flex h-8 w-8 items-center justify-center">
              <Lock className="text-muted-foreground h-3 w-3" />
            </div>
          );
        }

        return (
          <div className="relative flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(isOpen ? null : `status-${user._id}`);
                }}
                className="h-8 w-8 p-0"
              >
                {/* Use Settings icon for Status Actions */}
                <Settings className="h-4 w-4" />
              </Button>

              {isOpen && (
                <div className="absolute top-8 right-0 z-50 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    <div className="border-b px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Status Actions
                    </div>

                    {permissions.canActivateUsers &&
                      user.status !== "active" && (
                        <button
                          onClick={() => {
                            handleStatusUpdate(user._id, "active");
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                          Activate User
                        </button>
                      )}

                    {permissions.canDeactivateUsers &&
                      user.status !== "deactive" && (
                        <button
                          onClick={() => {
                            handleStatusUpdate(user._id, "deactive");
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          <UserX className="mr-2 h-4 w-4 text-gray-600" />
                          Deactivate User
                        </button>
                      )}

                    {permissions.canBlockUsers && user.status !== "block" && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(user._id, "block");
                          setOpenDropdown(null);
                        }}
                        className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <UserX className="mr-2 h-4 w-4 text-red-600" />
                        Block User
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },

    // ROLE ACTIONS COLUMN
    {
      header: "Role Actions",
      accessorKey: "roleActions",
      cell: (user: User) => {
        const isOpen = openDropdown === `role-${user._id}`;
        const canManageThisUser = canManageUser(
          currentUser,
          user,
          "roleChange"
        );

        if (!canManageThisUser) {
          return (
            <div className="flex h-8 w-8 items-center justify-center">
              <Lock className="text-muted-foreground h-3 w-3" />
            </div>
          );
        }

        return (
          <div className="relative flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(isOpen ? null : `role-${user._id}`);
                }}
                className="h-8 w-8 p-0"
              >
                {/* Use Crown icon for Role Actions */}
                <Crown className="h-4 w-4" />
              </Button>

              {isOpen && (
                <div className="absolute top-8 right-0 z-50 w-52 rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    <div className="border-b px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Role Actions
                    </div>

                    {permissions.canMakeAdmin &&
                      user.role !== "admin" &&
                      user.role !== "super_admin" && (
                        <button
                          onClick={() => {
                            handleRoleUpdate(user._id, "admin");
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          <ShieldCheck className="mr-2 h-4 w-4 text-purple-600" />
                          Make Admin
                        </button>
                      )}

                    {permissions.canMakeAdmin &&
                      user.role !== "super_admin" && (
                        <button
                          onClick={() => {
                            handleRoleUpdate(user._id, "super_admin");
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          <Crown className="mr-2 h-4 w-4 text-red-600" />
                          Make Super Admin
                        </button>
                      )}

                    {permissions.canDemoteUsers && user.role !== "user" && (
                      <button
                        onClick={() => {
                          handleRoleUpdate(user._id, "user");
                          setOpenDropdown(null);
                        }}
                        className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-orange-600" />
                        Remove Privileges
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },

    // DELETE ACTIONS COLUMN
    {
      header: "Delete Actions",
      accessorKey: "deleteActions",
      cell: (user: User) => {
        const isOpen = openDropdown === `delete-${user._id}`;
        const canManageThisUser = canManageUser(currentUser, user, "delete");

        if (!canManageThisUser || currentUser._id === user._id) {
          return (
            <div className="flex h-8 w-8 items-center justify-center">
              <Lock className="text-muted-foreground h-3 w-3" />
            </div>
          );
        }

        return (
          <div className="relative flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(isOpen ? null : `delete-${user._id}`);
                }}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {isOpen && (
                <div className="absolute top-8 right-0 z-50 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    <div className="border-b px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Delete Actions
                    </div>

                    {permissions.canDeleteUsers && (
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },

    // VIEW DETAILS COLUMN
    {
      header: "Details",
      accessorKey: "details",
      cell: (user: User) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedUser(user)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description={`Manage user accounts and permissions (${currentUser.role} access)`}
      >
        <div className="flex items-center space-x-2">
          {permissions.canCreateUsers && (
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          )}
          <Select
            value={statusFilter}
            onValueChange={(value: UserStatusFilter) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deactive">Deactive</SelectItem>
              <SelectItem value="block">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={roleFilter}
            onValueChange={(value: UserRoleFilter) => setRoleFilter(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Deactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.deactiveUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.blockedUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and their permissions ({usersData.length} of{" "}
            {usersResponse?.pagination?.total || 0} users)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={usersData}
            columns={columns}
            searchable={true}
            pagination={true}
            loading={usersLoading || statsLoading}
            currentPage={currentPage}
            totalPages={usersResponse?.pagination?.pages || 1}
            onPageChange={setCurrentPage}
            onSearch={setSearchTerm}
          />
        </CardContent>
      </Card>

      {selectedUser && permissions.canViewUserDetails && (
        <UserDetailModal
          user={selectedUser}
          currentUser={currentUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Create User Modal */}
      <Dialog
        open={createModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Only reset when manually closing (not on error)
            reset();
            setShowPassword(false);
          }
          setCreateModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Create New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account.{" "}
              {currentUser.role === "admin"
                ? "As an admin, you can only create regular users."
                : "As a super admin, you can create both admins and regular users."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit(handleCreateUser)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter user's full name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter user's email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (min 8 characters)"
                    {...register("password")}
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formRole}
                  onValueChange={(value: "user" | "admin" | "super_admin") =>
                    setValue("role", value)
                  }
                >
                  <SelectTrigger
                    id="role"
                    className={errors.role ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getRoleOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateModalOpen(false);
                  setShowPassword(false);
                  reset();
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove all associated data.
            </DialogDescription>
          </DialogHeader>

          {userToDelete && (
            <div className="py-4">
              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={userToDelete.profileImg || "/placeholder.svg"}
                    alt={userToDelete.name}
                  />
                  <AvatarFallback>{userToDelete.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">
                    {userToDelete.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {userToDelete.email}
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={roleColors[userToDelete.role]}
                    >
                      {userToDelete.role.charAt(0).toUpperCase() +
                        userToDelete.role.slice(1)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={statusColors[userToDelete.status]}
                    >
                      {userToDelete.status.charAt(0).toUpperCase() +
                        userToDelete.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserDetailModal({
  user,
  currentUser,
  onClose,
}: UserDetailModalProps & { currentUser: CurrentUser }): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              User Details
              {currentUser._id === user._id && (
                <span className="ml-2 text-sm text-gray-500">
                  (Your Account)
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-white/30">
                <AvatarImage
                  src={user.profileImg || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user.name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={`${
                      roleColors[user.role]
                    } bg-opacity-80 backdrop-blur-sm`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`${
                      statusColors[user.status]
                    } bg-opacity-80 backdrop-blur-sm`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/30 p-4 backdrop-blur-sm">
              <h4 className="mb-1 font-medium text-gray-900">Contact</h4>
              <p className="text-gray-600">{user.phone}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/20 bg-white/30 p-4 backdrop-blur-sm">
                <h4 className="mb-1 font-medium text-gray-900">Created At</h4>
                <p className="text-gray-600">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/30 p-4 backdrop-blur-sm">
                <h4 className="mb-1 font-medium text-gray-900">Last Updated</h4>
                <p className="text-gray-600">
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
