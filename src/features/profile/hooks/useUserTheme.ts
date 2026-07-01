"use client";

import { useEffect, useState } from "react";
import { getUserTheme, updateUserTheme } from "../services/profileService";
import type { ThemePreference } from "../types";

const getInitialTheme = (): ThemePreference => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
};

export function useUserTheme(userId?: string) {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!userId) return;

    const loadTheme = async () => {
      try {
        const savedTheme = await getUserTheme(userId);
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    void loadTheme();
  }, [userId]);

  const toggleTheme = async () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    if (!userId) return;

    try {
      await updateUserTheme(userId, nextTheme);
    } catch (error) {
      console.error("Error saving theme to DB:", error);
    }
  };

  return { theme, toggleTheme };
}
