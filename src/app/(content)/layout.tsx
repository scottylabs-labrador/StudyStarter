import "~/styles/globals.css";

import NavBar from "~/components/NavBar";
import React from "react";
import { redirect } from "next/navigation";
import MobileNavBar from "~/components/MobileNavBar";
import { requireServerSession } from "~/lib/auth";

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
  const session = await requireServerSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen bg-lightbg dark:bg-darkbg">
      <NavBar />
      <div className="flex-1 overflow-auto">     
        <MobileNavBar />
        <main className="container mx-auto px-4 bg-lightbg dark:bg-darkbg">
          {children}
        </main>
      </div> 
    </div>
  );
}
