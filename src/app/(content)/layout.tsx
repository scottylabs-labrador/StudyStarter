import "~/styles/globals.css";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavBar from "~/components/NavBar";
import React from "react";
import MobileNavBar from "~/components/MobileNavBar";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";

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
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  // const email = "copetas@cs.cmu.edu"

  if (!email) {
    redirect("/");
  }

  const facultyResult = await fetch("https://updateuser-jmpi7y54bq-uc.a.run.app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName: user?.firstName ?? "Test",
    }),
    cache: "no-store",
  }).then((response) => response.json());

  console.log("faculty result from layout: ", facultyResult);

  if (facultyResult?.success === true) {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { faculty: true },
    });
    redirect("/access-restricted");
  }

  const userRef = doc(db, "Users", email);
  const classesRef = collection(userRef, "Classes");
  const classesSnap = await getDocs(classesRef);

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
