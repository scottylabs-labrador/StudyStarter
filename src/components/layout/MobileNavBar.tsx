"use client";
import darkLogo from "~/image/darkLogo2.png";
import lightLogo from "~/image/lightLogo2.png";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "~/lib/auth-client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useUserTheme } from "~/features/profile/hooks/useUserTheme";

export default function MobileNavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useUserTheme(userId);

  return (
    <Fragment>
        <nav className="mobile-nav-bar">
            <a href="/feed" className="flex items-center">
                <Image
                  className="hidden dark:block h-8 w-auto"
                  src={darkLogo}
                  alt="dark-mode-logo"
                  width={150}
                  height={75}
                />
                <Image
                  className="block dark:hidden h-8 w-auto"
                  src={lightLogo}
                  alt="light-mode-logo"
                  width={150}
                  height={75}
                />
            </a>

            <button
              type="button"
              aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-nav-list"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2"
            >
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </nav>

        {/* Dropdown list */}
        <div
            id="mobile-nav-list"
            aria-hidden={!isDrawerOpen}
            className={`mobile-nav-list ${isDrawerOpen ? "max-h-80 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
        >
            <ul className="flex flex-col gap-2">
                <li>
                    <a
                        href="/feed"
                        onClick={() => setIsDrawerOpen(false)}
                        className="nav-link"
                        tabIndex={isDrawerOpen ? 0 : -1}
                    >
                        Group Finder
                    </a>
                </li>
                <li>
                    <a
                        href="/my-groups"
                        onClick={() => setIsDrawerOpen(false)}
                        className='nav-link'
                        tabIndex={isDrawerOpen ? 0 : -1}
                    >
                        My Groups
                    </a>
                </li>
                <li>
                    <a
                        href="/profile"
                        onClick={() => setIsDrawerOpen(false)}
                        className='nav-link'
                        tabIndex={isDrawerOpen ? 0 : -1}
                    >
                        My Profile
                    </a>
                    <SignOutButton>
                        <button 
                            type="button" 
                            tabIndex={isDrawerOpen ? 0 : -1}
                            className="nav-link text-xs dark:text-white mb-4 px-4"
                        >
                            Logout
                        </button>
                    </SignOutButton>
                </li>
                <li className="grid grid-cols-3">
                    <button
                        onClick={toggleTheme}
                        className="mb-4 w-full text-xs dark:text-white block"
                        id="mode"
                        tabIndex={isDrawerOpen ? 0 : -1}
                    >
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>
                    <a
                        href="https://forms.gle/MEQ7miCZCrC48P6y8"
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isDrawerOpen ? 0 : -1}
                        className="block w-full text-center text-xs dark:text-white"
                    >
                        Feedback
                    </a>
                    <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isDrawerOpen ? 0 : -1}
                        className={`w-full rounded-lg pb-2 text-center text-xs ${page === "privacy" ? "font-bold text-lightSelected dark:text-darkSelected" : " text-black dark:text-white"}`}
                    >
                        Privacy Policy
                    </a>
                </li>
            </ul>
        </div>
        
        
    </Fragment>
  );
}