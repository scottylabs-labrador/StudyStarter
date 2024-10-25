import "~/styles/globals.css";

import NavBar from "~/components/NavBar";
import React from "react";

export const metadata = {
  title: "BoilerGram",
  description: "Your new favorite social media platform.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <div className="bg-slate-400 left-0 top-0 flex-none w-[10vw] h-full">
        <NavBar />
      </div>
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div> 
    </div>
  );
}