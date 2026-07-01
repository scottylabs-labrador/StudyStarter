"use client";
import darkLogo from "~/image/darkLogo2.png"
import lightLogo from "~/image/lightLogo2.png"
import { Fragment, useState } from "react";
import CreateGroupModal from "~/features/groups/components/CreateGroupModal";
import { usePathname } from "next/navigation";
import { useUser } from "~/lib/auth-client";
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { ProfileMenu } from "~/components/ui/ProfileMenu";
import { useUserTheme } from "~/features/profile/hooks/useUserTheme";


export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useUserTheme(userId);
  

  return (
    <Fragment>
      <div className="sidebar-shell">
      <div className="sidebar-content">
        {/* Top Section */}
        <div>
          <div className="flex flex-row items-center w-full">
            <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden mr-auto">
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* Hide content after first button on small screens */}
            <a href="/feed" className="hidden md:flex h-[50px] items-center">
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
        <div className="hidden md:flex flex-col gap-y-4">
          <a href="/feed" className={`nav-link ${page == "feed" ? "nav-link-active" : ""}`}>
            Group Finder
          </a>
          <a href="/my-groups" className={`nav-link ${page == "my-groups" ? "nav-link-active" : ""}`}>
            My Groups
          </a>
          <button
            onClick={toggleTheme}
            className="button-inverse w-full modeButton"
            id="mode"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>


        {/* Bottom Section (Feedback Button) - Hidden on small screens */}
        <div className="hidden md:block pb-4">
          <a href='https://forms.gle/MEQ7miCZCrC48P6y8' target="_blank" rel="noopener noreferrer" className="button-primary block w-full text-center">
              Feedback
          </a>
          <a 
            href="/privacy" 
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center pb-2 rounded-lg text-xs underline ${page == "privacy" ? "font-bold text-lightSelected dark:text-darkSelected" : " text-black dark:text-white"}`}
          >
            Privacy Policy
          </a>
        </div>
      </div>
      </div>

      {/* Drawer Menu */}
      {isDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
        <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
          <div>
            <button onClick={() => setIsDrawerOpen(false)} className="mb-4 text-black dark:text-white">
              <X size={24}/>
            </button>
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
            <nav className="flex flex-col gap-y-4">
              <a href="/feed" className={`py-2 ${page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}>
                Group Finder
              </a>
              <a href="/my-groups" className={page === "my-groups" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}>
                My Groups
              </a>
              <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg modeButton" id="mode">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
              <ProfileMenu containerClassName="drawer-profile-menu-container" />
            </nav>
          </div>
      
          {/* Feedback Button */}
          <div className="pb-4">
            <a href='https://forms.gle/MEQ7miCZCrC48P6y8' target="_blank" rel="noopener noreferrer" className="feedback-link">
              Feedback
            </a>
            <a 
              href="/privacy" 
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full text-center pb-2 rounded-lg text-xs underline ${page == "privacy" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
      
      )}

      <CreateGroupModal />
    </Fragment>
  );
}
