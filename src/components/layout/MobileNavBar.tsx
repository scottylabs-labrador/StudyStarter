"use client";
import darkLogo from "~/image/darkLogo2.png";
import lightLogo from "~/image/lightLogo2.png";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "~/lib/auth-client";
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
      <div className="md:hidden">
        <div className="flex justify-between bg-lightSidebar p-[1rem] dark:bg-darkSidebar">
          <div className="">
            <a href="/feed">
              <Image
                className="hidden dark:block"
                src={darkLogo}
                alt="dark-mode-logo"
                width={150}
                height={75}
              />
              <Image
                className="block dark:hidden"
                src={lightLogo}
                alt="light-mode-logo"
                width={150}
                height={75}
              />
            </a>
          </div>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="ml-auto md:hidden"
          >
            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Drawer Menu - animated dropdown */}
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-out ${
            isDrawerOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="bg-lightSidebar px-[1rem] pb-4 dark:bg-darkSidebar">
              <nav className="flex flex-col gap-y-1">
                <a
                  href="/profile"
                  className={`py-2 ${page === "profile" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}
                >
                  View Profile
                </a>
                <a
                  href="/feed"
                  className={`py-2 ${page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}
                >
                  Group Finder
                </a>
                <a
                  href="/my-groups"
                  className={`py-2 ${page === "my-groups" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}
                >
                  My Groups
                </a>
                <div className="flex justify-between py-2">
                  <button
                    onClick={toggleTheme}
                    className="button-inverse modeButton p-2"
                    id="mode"
                  >
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
