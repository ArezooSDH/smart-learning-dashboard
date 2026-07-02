export type User = {
  name: string;
  email: string;
};

const STORAGE_KEY = "smart-learning-user";

export const login = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};
