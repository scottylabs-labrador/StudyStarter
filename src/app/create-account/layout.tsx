import "~/styles/globals.css";
import React from "react";

export const metadata = {
  title: "CMU Study",
  description: "Totally novel way to support your grade",
  icons: [{ rel: "icon", url: "/CMUStudy.ico" }],
};

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-lightbg dark:bg-darkbg">
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div> 
    </div>
  );
}