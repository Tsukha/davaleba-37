import React, { useState, useEffect } from "react";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

interface UserFormProps {
  user?: User;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    company: {
      name: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        website: user.website,
        company: {
          name: user.company.name,
        },
      });
    }
  }, [user, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    }

    if (!formData.company.name.trim()) {
      newErrors.companyName = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === "edit" && user) {
      onSubmit({ ...formData, id: user.id } as UpdateUserRequest);
    } else {
      onSubmit(formData as CreateUserRequest);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "companyName") {
      setFormData((prev) => ({
        ...prev,
        company: { name: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="user-form-container">
      <h2>{mode === "create" ? "Create New User" : "Edit User"}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "error" : ""}
            disabled={isLoading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "error" : ""}
            disabled={isLoading}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? "error" : ""}
            disabled={isLoading}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="website">Website *</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className={errors.website ? "error" : ""}
            disabled={isLoading}
            placeholder="https://example.com"
          />
          {errors.website && (
            <span className="error-message">{errors.website}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.company.name}
            onChange={handleInputChange}
            className={errors.companyName ? "error" : ""}
            disabled={isLoading}
          />
          {errors.companyName && (
            <span className="error-message">{errors.companyName}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : mode === "create"
              ? "Create User"
              : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
};
