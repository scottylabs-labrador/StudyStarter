import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/lib/api/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

export default async function LoginPage() {
  console.log("LOGIN PAGE HIT");
  /* ===============================
     1. CHECK AUTH
  =============================== */

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();

  const email = user?.emailAddresses[0]?.emailAddress;
  // const email = "jmackey@andrew.cmu.edu"
  console.log("Email:", email);

  if (!email) {
    redirect("/");
  }

  /* ===============================
     2. CHECK FACULTY VIA PYTHON API
  =============================== */

  const response = await fetch(
    "https://updateuser-jmpi7y54bq-uc.a.run.app",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName: "Test",
      }),
      cache: "no-store", // always re-check
    }
  );

  const result = await response.json();

  console.log("Faculty result:", result);

  if (result?.success === true) {
    redirect("/faculty-restricted");
  }

  /* ===============================
     3. NORMAL USER FLOW
  =============================== */

  const userRef = doc(db, "Users", email);
  const classesRef = collection(userRef, "Classes");
  const classesSnap = await getDocs(classesRef);

  if (classesSnap.empty) {
    redirect("/create_account");
  }

  redirect("/feed");
}