export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
  accessToken?: string;
  refreshToken?: string;
}

export interface UserRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Set<string>;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  tokenExpiresIn?: number;
}
export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  active?: boolean;
  roles?: string[];
}