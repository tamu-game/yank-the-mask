export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
};
