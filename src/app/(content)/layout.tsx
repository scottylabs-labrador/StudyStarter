import "~/styles/globals.css";
import { redirect } from "next/navigation";
import NavBar from "~/components/layout/NavBar";
import React from "react";
import MobileNavBar from "~/components/layout/MobileNavBar";
import { requireServerSession } from "~/lib/auth";
import { getAdminDb } from "~/lib/firebase-admin";

export const metadata = {
  title: "CMU Study",
  description:"Totally novel way to support your grade",
  icons: [{ rel: "icon", url: "/CMUStudy.ico" }],
};

async function checkFacultyStatus(email: string, firstName: string) {
  try {
    const response = await fetch("https://updateuser-jmpi7y54bq-uc.a.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Faculty check failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.warn(`Faculty check returned non-JSON response: ${contentType ?? "unknown"}`);
      return false;
    }

    const result = await response.json();
    return result?.success === true;
  } catch (error) {
    console.warn("Faculty check failed:", error);
    return false;
  }
}

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

  const classesSnap = await getAdminDb()
    .collection("Users")
    .doc(email)
    .collection("Classes")
    .get();

  if (classesSnap.empty) {
    redirect("/create-account");
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
