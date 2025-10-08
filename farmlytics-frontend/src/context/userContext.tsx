// src/context/userContext.tsx (Updated)
"use client";

import {LocalStorageUser} from "@/lib/types";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface UserContextType {
  user: LocalStorageUser | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: LocalStorageUser, tokenData: string) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<LocalStorageUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      let parsedUser: LocalStorageUser | null = null;

      // Only attempt to parse if storedUser is a non-empty string and not the string "undefined" or "null"
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        parsedUser = JSON.parse(storedUser) as LocalStorageUser;
      }

      if (parsedUser && storedToken) { // Check if parsedUser is valid
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // If there's an error parsing, it means localStorage data is corrupt.
      // Clear it to prevent future errors and ensure a clean state.
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setTokenCookie = (token: string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 1); // Expires in one day
    document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  const deleteTokenCookie = () => {
    document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  };

  const login = (userData: LocalStorageUser, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
    setTokenCookie(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    deleteTokenCookie();
  };

  return (
      <UserContext.Provider
          value={{
            user,
            token,
            isLoading,
            login,
            logout,
          }}
      >
        {children}
      </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};