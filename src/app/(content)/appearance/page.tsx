"use client";

import { Check, Moon, Sun } from "lucide-react";
import { useUser } from "~/lib/auth-client";
import { useUserTheme } from "~/features/profile/hooks/useUserTheme";

export default function AppearancePage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const { theme, toggleTheme } = useUserTheme(userId);

  const choose = (nextTheme: "light" | "dark") => {
    if (theme !== nextTheme) void toggleTheme();
  };

  return (
    <section className="settings-page">
      <div className="screen-heading">
        <p className="eyebrow">Preferences</p>
        <h1>Appearance</h1>
        <p>Choose the CMU Study look that feels right for you.</p>
      </div>
      <div className="appearance-grid">
        {[
          { value: "light" as const, label: "Light", icon: Sun },
          { value: "dark" as const, label: "Dark", icon: Moon },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            className={`appearance-option ${theme === value ? "appearance-option-active" : ""}`}
            onClick={() => choose(value)}
          >
            {theme === value && <Check size={16} className="appearance-check" />}
            <Icon size={28} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
