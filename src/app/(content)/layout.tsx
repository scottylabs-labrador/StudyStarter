import "~/styles/globals.css";


import NavBar from "~/components/NavBar";
import React from "react";

export const metadata = {
  title: "CMU Study",
  description:"Totally novel way to support your grade",
  icons: [{ rel: "icon", url: "/CMUStudy.ico" }],
};

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-lightbg dark:bg-darkbg">
      <div className=" left-0 top-0 flex-none w-[10vw] h-full bg-lightSidebar dark:bg-darkSidebar">
        <NavBar />
      </div>
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto px-4 py-8 bg-lightbg dark:bg-darkbg">
          {children}
        </main>
      </div> 
    </div>
  );
}