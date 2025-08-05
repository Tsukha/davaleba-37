export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: number;
}
