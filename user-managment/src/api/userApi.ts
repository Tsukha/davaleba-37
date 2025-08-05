import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const userApi = {
  // Fetch all users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },

  // Fetch single user by ID
  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }
    return response.json();
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return response.json();
  },

  // Update user
  updateUser: async (userData: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user with id ${userData.id}`);
    }
    return response.json();
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
  },
};
