import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Mock user data for frontend-only mode
  const user = {
    id: 1,
    username: "demo_user",
    email: "user@fitnessforge.com",
    role: "member",
    fullName: "Alex Fitness",
    firstName: "Alex",
    lastName: "Fitness",
    membershipType: "premium",
    membershipStatus: "active",
    profileImageUrl: ""
  };

  return {
    user,
    isLoading: false,
    isAuthenticated: true,
  };
}
