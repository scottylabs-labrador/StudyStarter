import "~/styles/globals.css";
import { redirect } from "next/navigation";
import NavBar from "~/components/layout/NavBar";
import React from "react";
import MobileNavBar from "~/components/layout/MobileNavBar";
import { checkFacultyStatus, userHasCreatedProfile } from "~/features/profile/services/serverAccountService";
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

  const email = session.user.email;

  if (!email) {
    redirect("/");
  }

  const isFaculty = await checkFacultyStatus(email, session.user.name ?? "User");

  if (isFaculty) {
    redirect("/access-restricted");
  }

  if (!(await userHasCreatedProfile(email))) {
    redirect("/create-account");
  }

  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-content">     
        <MobileNavBar />
        <main className="app-main">
          {children}
        </main>
      </div> 
    </div>
  );
}
