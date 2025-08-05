import React from "react";
import type { User } from "../types/user";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number) => void;
  isDeleting?: number; // ID of user being deleted
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEditUser,
  onDeleteUser,
  isDeleting,
}) => {
  if (users.length === 0) {
    return (
      <div className="user-list-empty">
        <p>No users found. Create your first user!</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Users ({users.length})</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-phone">{user.phone}</p>
              <p className="user-website">
                <a
                  href={
                    user.website.startsWith("http")
                      ? user.website
                      : `https://${user.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              </p>
              <p className="user-company">{user.company.name}</p>
            </div>
            <div className="user-actions">
              <button
                onClick={() => onEditUser(user)}
                className="btn btn-sm btn-outline"
                disabled={isDeleting === user.id}
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="btn btn-sm btn-danger"
                disabled={isDeleting === user.id}
              >
                {isDeleting === user.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
