import { redirect } from "next/navigation";
import { doc, collection, getDocs } from "firebase/firestore";

import { db } from "~/lib/api/firebaseConfig";
import { requireServerSession } from "~/lib/auth";

export const dynamic = "force-dynamic";

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

export default async function LoginPage() {
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
    console.log("User identified as faculty. Updating metadata and redirecting.");
    
    redirect("/access-restricted");
  }

  const userRef = doc(db, "Users", email);
  const classesRef = collection(userRef, "Classes");
  const classesSnap = await getDocs(classesRef);

  if (classesSnap.empty) {
    console.log("No classes found for user. Redirecting to account creation.");
    redirect("/create-account");
  }
  console.log("User has classes. Redirecting to feed.");
  redirect("/feed");
}
