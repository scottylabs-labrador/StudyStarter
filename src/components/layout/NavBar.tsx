"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Ban, CalendarDays, ClipboardEdit, Compass, LogOut, Moon, Palette, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { SignOutButton, useUser } from "~/lib/auth-client";
import { useUserTheme } from "~/features/profile/hooks/useUserTheme";
import CreateGroupModal from "~/features/groups/components/CreateGroupModal";
import { Wordmark } from "./Wordmark";

const navItems = [
  { href: "/feed", label: "Group Finder", icon: Compass },
  { href: "/my-groups", label: "My Groups", icon: UsersRound },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/blocked-students", label: "Blocked Students", icon: Ban },
  { href: "/calendar-settings", label: "Calendar Settings", icon: CalendarDays },
  { href: "/appearance", label: "Appearance", icon: Palette },
  { href: "/feedback", label: "Feedback", icon: ClipboardEdit },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const { theme, toggleTheme } = useUserTheme(userId);

  return (
    <Fragment>
      <aside className="sidebar-shell">
        <div className="sidebar-content">
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="/feed" aria-label="CMU Study home"><Wordmark /></a>
            <div className="desktop-nav-list">
              {navItems.map(({ href, label, icon: Icon }) => (
                <a key={href} href={href} className={`nav-link ${pathname === href ? "nav-link-active" : ""}`}>
                  <Icon size={16} strokeWidth={1.8} /> {label}
                </a>
              ))}
            </div>
            <div className="desktop-nav-bottom">
              <button type="button" className="secondary-action theme-quick w-full" onClick={() => void toggleTheme()}>
                <Moon size={14} /> {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
              <SignOutButton><button type="button" className="nav-link nav-subtle"><LogOut size={16} /> Sign out</button></SignOutButton>
            </div>
          </nav>
        </div>
      </aside>
      <CreateGroupModal />
    </Fragment>
  );
}
