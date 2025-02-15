import "~/styles/globals.css";


import NavBar from "~/components/NavBar";
import React from "react";

export const metadata = {
  title: "Study Group Finder",
  description:"Totally novel way to support your grade",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-lightbg dark:bg-darkbg">
      <div className="left-0 top-0 h-[7%] w-full md:w-[12%] md:h-full bg-lightSidebar dark:bg-darkSidebar">
        <NavBar />
      </div>
      <div className="overflow-auto">
        <main className="container mx-auto px-4 bg-lightbg dark:bg-darkbg">
          {children}
        </main>
      </div> 
    </div>
  );
}