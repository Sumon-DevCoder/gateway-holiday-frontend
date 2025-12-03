import { CurrentUser, User, UserPermissions } from "@/types/user";

export const getUserPermissions = (
  currentUser: CurrentUser | null | undefined
): UserPermissions => {
  if (!currentUser || !currentUser.role) {
    return {
      canViewUsers: false,
      canCreateUsers: false,
      canActivateUsers: false,
      canDeactivateUsers: false,
      canBlockUsers: false,
      canMakeModerator: false,
      canMakeAdmin: false,
      canDemoteUsers: false,
      canDeleteUsers: false,
      canViewUserDetails: false,
    };
  }

  switch (currentUser.role) {
    case "super_admin":
      return {
        canViewUsers: true,
        canCreateUsers: true,
        canActivateUsers: true,
        canDeactivateUsers: true,
        canBlockUsers: true,
        canMakeModerator: true,
        canMakeAdmin: true,
        canDemoteUsers: true,
        canDeleteUsers: true,
        canViewUserDetails: true,
      };

    case "admin":
      return {
        canViewUsers: true,
        canCreateUsers: true,
        canActivateUsers: true,
        canDeactivateUsers: true,
        canBlockUsers: true,
        canMakeModerator: true,
        canMakeAdmin: true,
        canDemoteUsers: true,
        canDeleteUsers: true,
        canViewUserDetails: true,
      };

    // case "moderator": // Role deprecated
    //   return {
    //     canViewUsers: true,
    //     canActivateUsers: true,
    //     canDeactivateUsers: true,
    //     canBlockUsers: true,
    //     canMakeModerator: false,
    //     canMakeAdmin: false,
    //     canDemoteUsers: false,
    //     canDeleteUsers: false,
    //     canViewUserDetails: true,
    //   };

    case "user":
    default:
      return {
        canViewUsers: false,
        canCreateUsers: false,
        canActivateUsers: false,
        canDeactivateUsers: false,
        canBlockUsers: false,
        canMakeModerator: false,
        canMakeAdmin: false,
        canDemoteUsers: false,
        canDeleteUsers: false,
        canViewUserDetails: false,
      };
  }
};

export const canManageUser = (
  currentUser: CurrentUser | null | undefined,
  targetUser: User,
  action: string
): boolean => {
  if (!currentUser || !currentUser._id || !currentUser.role) {
    return false;
  }

  // Prevent users from managing themselves for certain actions
  if (currentUser._id === targetUser._id) {
    const restrictedActions = ["block", "deactive", "delete", "roleChange"];
    if (restrictedActions.includes(action)) {
      return false;
    }
  }

  const roleHierarchy: Record<string, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
    super_admin: 4,
  };

  const currentUserLevel = roleHierarchy[currentUser.role] || 0;
  const targetUserLevel = roleHierarchy[targetUser.role] || 0;

  // For role changes, allow admins to manage other admins and super_admins to manage everyone
  if (action === "roleChange") {
    // Super admins can manage everyone
    if (currentUser.role === "super_admin") {
      return true;
    }
    // Admins can manage users and other admins (but not super_admins)
    if (currentUser.role === "admin" && targetUser.role !== "super_admin") {
      return true;
    }
    // Regular users cannot change roles
    return false;
  }

  // For other actions, use the hierarchy system
  if (
    currentUserLevel <= targetUserLevel &&
    currentUser._id !== targetUser._id
  ) {
    return false;
  }

  return true;
};
