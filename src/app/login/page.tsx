import { redirect } from "next/navigation";
import { doc, collection, getDocs } from "firebase/firestore";

import { db } from "~/lib/api/firebaseConfig";
import { requireServerSession } from "~/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await requireServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const email = session.user.email;

  if (!email) {
    redirect("/");
  }

  const response = await fetch("https://updateuser-jmpi7y54bq-uc.a.run.app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName: session.user.name ?? "User",
    }),
    cache: "no-store",
  });

  const result = await response.json();

  if (result?.success === true) {
    redirect("/faculty-restricted");
  }

  const userRef = doc(db, "Users", email);
  const classesRef = collection(userRef, "Classes");
  const classesSnap = await getDocs(classesRef);

  if (classesSnap.empty) {
    redirect("/create_account");
  }

  redirect("/feed");
}
