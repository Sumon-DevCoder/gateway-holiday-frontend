import { User, UserRole, UserStats, UserStatus } from "@/types/user";

export const users: User[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    profileImg: "/thoughtful-man.png",
    role: "user",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:20:00Z",
  },
  {
    _id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1-555-987-6543",
    profileImg: "/diverse-woman-portrait.png",
    role: "admin",
    status: "active",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-21T11:30:00Z",
  },
  {
    _id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    phone: "+1-555-456-7890",
    profileImg: "/young-woman-smiling.png",
    role: "user",
    status: "deactive",
    createdAt: "2024-01-05T16:45:00Z",
    updatedAt: "2024-01-18T08:20:00Z",
  },
  {
    _id: "4",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    phone: "+1-555-321-0987",
    profileImg: "/diverse-group.png",
    role: "admin",
    status: "active",
    createdAt: "2023-12-01T12:00:00Z",
    updatedAt: "2024-01-21T16:45:00Z",
  },
  {
    _id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1-555-654-3210",
    profileImg: "/abstract-geometric-shapes.png",
    role: "user",
    status: "block",
    createdAt: "2024-01-08T14:30:00Z",
    updatedAt: "2024-01-19T10:15:00Z",
  },
  {
    _id: "6",
    name: "Alice Cooper",
    email: "alice.cooper@example.com",
    phone: "+1-555-789-0123",
    role: "admin",
    status: "active",
    createdAt: "2024-01-12T11:20:00Z",
    updatedAt: "2024-01-22T09:10:00Z",
  },
  {
    _id: "7",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phone: "+1-555-345-6789",
    profileImg: "/professional-man.png",
    role: "user",
    status: "deactive",
    createdAt: "2024-01-07T15:30:00Z",
    updatedAt: "2024-01-17T12:45:00Z",
  },
];

export const userStats: UserStats = {
  totalUsers: 247,
  activeUsers: 198,
  blockedUsers: 15,
  deactiveUsers: 34,
  admins: 5,
  moderators: 12,
  regularUsers: 230,
};

export const getUsersByStatus = (users: User[], status: UserStatus): User[] => {
  return users.filter((user) => user.status === status);
};

export const getUsersByRole = (users: User[], role: UserRole): User[] => {
  return users.filter((user) => user.role === role);
};

export const getUsersStats = (users: User[]): UserStats => {
  const activeUsers = getUsersByStatus(users, "active");
  const blockedUsers = getUsersByStatus(users, "block");
  const deactiveUsers = getUsersByStatus(users, "deactive");
  const admins = getUsersByRole(users, "admin");
  const regularUsers = getUsersByRole(users, "user");

  return {
    totalUsers: users.length,
    activeUsers: activeUsers.length,
    blockedUsers: blockedUsers.length,
    deactiveUsers: deactiveUsers.length,
    admins: admins.length,
    moderators: 0, // Moderator role deprecated
    regularUsers: regularUsers.length,
  };
};
