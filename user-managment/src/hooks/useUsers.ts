import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

// Query keys for better cache management
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Hook to fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch single user
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => userApi.createUser(userData),
    onSuccess: (newUser: User) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Optionally, you can also update the cache directly
      queryClient.setQueryData(
        userKeys.lists(),
        (oldData: User[] | undefined) => {
          if (oldData) {
            return [...oldData, { ...newUser, id: Date.now() }]; // JSONPlaceholder returns id: 11, we use timestamp for uniqueness
          }
          return [newUser];
        }
      );
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => userApi.updateUser(userData),
    onSuccess: (updatedUser: User, variables: UpdateUserRequest) => {
      // Invalidate the specific user query
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });

      // Invalidate the users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Optionally update the cache directly for immediate UI update
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);

      // Update the user in the list cache as well
      queryClient.setQueryData(
        userKeys.lists(),
        (oldData: User[] | undefined) => {
          if (oldData) {
            return oldData.map((user) =>
              user.id === variables.id ? updatedUser : user
            );
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: (_, deletedId: number) => {
      // Remove the user from the list cache
      queryClient.setQueryData(
        userKeys.lists(),
        (oldData: User[] | undefined) => {
          if (oldData) {
            return oldData.filter((user) => user.id !== deletedId);
          }
          return oldData;
        }
      );

      // Remove the individual user query
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};
