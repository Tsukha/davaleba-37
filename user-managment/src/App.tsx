import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserList } from "./components/UserList";
import { UserForm } from "./components/UserForm";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/useUsers";
import type { User, CreateUserRequest, UpdateUserRequest } from "./types/user";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Query hooks
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleFormSubmit = (
    userData: CreateUserRequest | UpdateUserRequest
  ) => {
    if (editingUser) {
      // Update existing user
      updateUserMutation.mutate(userData as UpdateUserRequest, {
        onSuccess: () => {
          setShowForm(false);
          setEditingUser(null);
        },
      });
    } else {
      // Create new user
      createUserMutation.mutate(userData as CreateUserRequest, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          Error loading users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management System</h1>
        {!showForm && (
          <button onClick={handleCreateUser} className="btn btn-primary">
            Add New User
          </button>
        )}
      </header>

      <main className="app-main">
        {showForm ? (
          <UserForm
            user={editingUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={
              createUserMutation.isPending || updateUserMutation.isPending
            }
            mode={editingUser ? "edit" : "create"}
          />
        ) : (
          <UserList
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            isDeleting={
              deleteUserMutation.isPending
                ? deleteUserMutation.variables
                : undefined
            }
          />
        )}
      </main>

      {/* Display mutation status */}
      {(createUserMutation.isError ||
        updateUserMutation.isError ||
        deleteUserMutation.isError) && (
        <div className="toast toast-error">
          {createUserMutation.error?.message ||
            updateUserMutation.error?.message ||
            deleteUserMutation.error?.message}
        </div>
      )}

      {(createUserMutation.isSuccess ||
        updateUserMutation.isSuccess ||
        deleteUserMutation.isSuccess) && (
        <div className="toast toast-success">
          {createUserMutation.isSuccess && "User created successfully!"}
          {updateUserMutation.isSuccess && "User updated successfully!"}
          {deleteUserMutation.isSuccess && "User deleted successfully!"}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
