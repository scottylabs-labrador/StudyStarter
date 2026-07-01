import "~/styles/globals.css";
import React from "react";
import { redirect } from "next/navigation";

import { requireServerSession } from "~/lib/auth";

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
  const session = await requireServerSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        <main className="app-main-padded">
          {children}
        </main>
      </div> 
    </div>
  );
}
