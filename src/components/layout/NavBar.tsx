"use client";
import darkLogo from "~/image/darkLogo2.png";
import lightLogo from "~/image/lightLogo2.png";
import { Fragment } from "react";
import CreateGroupModal from "~/features/groups/components/CreateGroupModal";
import { usePathname } from "next/navigation";
import { useUser } from "~/lib/auth-client";
import Image from "next/image";
import { useUserTheme } from "~/features/profile/hooks/useUserTheme";

export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const { theme, toggleTheme } = useUserTheme(userId);

  return (
    <Fragment>
      <div className="sidebar-shell">
        <div className="sidebar-content">
          {/* Top Section */}
          <div>
            <div className="flex w-full flex-row items-center">
              {/* Hide content after first button on small screens */}
              <a href="/feed" className="hidden h-[50px] items-center md:flex">
                <Image
                  className="hidden dark:block"
                  src={darkLogo}
                  alt="dark-mode-logo"
                  width={400}
                  height={200}
                />
                <Image
                  className="block dark:hidden"
                  src={lightLogo}
                  alt="light-mode-logo"
                  width={400}
                  height={200}
                />
              </a>
            </div>
          </div>

          {/* Middle Section (Navigation Buttons) - Hidden on small screens */}
          <div className="hidden flex-col gap-y-4 md:flex">
            <a
              href="/feed"
              className={`nav-link ${page === "feed" ? "nav-link-active" : ""}`}
            >
              Group Finder
            </a>
            <a
              href="/my-groups"
              className={`nav-link ${page === "my-groups" ? "nav-link-active" : ""}`}
            >
              My Groups
            </a>
          </div>

          {/* Bottom Section (Feedback Button) - Hidden on small screens */}
          <div className="hidden pb-4 md:block">
            <button
              onClick={toggleTheme}
              className="button-inverse modeButton mb-4 w-full"
              id="mode"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <a
              href="https://forms.gle/MEQ7miCZCrC48P6y8"
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary feedback-button block w-full text-center"
            >
              Feedback
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full rounded-lg pb-2 text-center text-xs underline ${page === "privacy" ? "font-bold text-lightSelected dark:text-darkSelected" : " text-black dark:text-white"}`}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <CreateGroupModal />
    </Fragment>
  );
}
