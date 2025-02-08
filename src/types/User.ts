  export interface UserCreate {
  fullName: string;
  email: string;
  createdAt: any; // Firebase Timestamp type
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone?: string | null;
  profileImage?: string | null;
  notifications: boolean;
  roles: string[];
  createdAt: string;
  companies: UserCompany[];
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInterface {
user: User;
tokens: Tokens;
}

export interface UserCompany {
  companyId: string;
  companyName: string;
  role: string;
  createdAt: string;
  state: string;
  status: string;
}

export interface SignInResponse {
  user: User;
  tokens: Tokens;
}