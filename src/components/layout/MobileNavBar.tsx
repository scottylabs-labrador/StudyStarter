"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Ban, CalendarDays, ClipboardEdit, Compass, Ellipsis, LogOut, Palette, Plus, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import { SignOutButton } from "~/lib/auth-client";

const moreItems = [
  { href: "/blocked-students", label: "Blocked Students", icon: Ban },
  { href: "/calendar-settings", label: "Calendar Settings", icon: CalendarDays },
  { href: "/appearance", label: "Appearance", icon: Palette },
  { href: "/feedback", label: "Feedback", icon: ClipboardEdit },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
];

export default function MobileNavBar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [moreOpen, setMoreOpen] = useState(false);
  const nav = (href: string, label: string, Icon: typeof Compass) => (
    <a key={href} href={href} className={`mobile-nav-item ${pathname === href ? "mobile-nav-item-active" : ""}`}>
      <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
    </a>
  );

  return (
    <>
      {moreOpen && <div className="mobile-more-panel">
        {moreItems.map(({ href, label, icon: Icon }) => <a key={href} href={href} onClick={() => setMoreOpen(false)} className="nav-link"><Icon size={16} />{label}</a>)}
        <SignOutButton><button type="button" onClick={() => setMoreOpen(false)} className="nav-link nav-subtle"><LogOut size={16} />Sign out</button></SignOutButton>
      </div>}
      <nav className="mobile-nav-bar" aria-label="Mobile navigation">
        {nav("/feed", "Finder", Compass)}
        {nav("/my-groups", "My Groups", UsersRound)}
        <button type="button" className="mobile-create" aria-label="Create study group" onClick={() => dispatch(setIsCreateGroupModalOpen(true))}><Plus size={24} /></button>
        {nav("/profile", "Profile", UserRound)}
        <button type="button" className={`mobile-nav-item ${moreOpen ? "mobile-nav-item-active" : ""}`} onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} aria-label="More navigation"><Ellipsis size={20} /><span>More</span></button>
      </nav>
    </>
  );
}
