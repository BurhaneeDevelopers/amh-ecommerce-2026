import { Use_auth } from "@/api/user.service";

/**
 * Hook to check if the current user can view product quantities
 * Only dealers and admins can see quantities
 */
export const useCanViewQuantity = () => {
  const { data: user } = Use_auth();
  
  // Check if user has dealer or admin role
  const canViewQuantity = user?.role === "dealer" || user?.role === "admin";
  
  return canViewQuantity;
};
