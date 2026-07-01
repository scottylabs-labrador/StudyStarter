import "server-only";

import { getAdminDb } from "~/lib/firebase-admin";

export async function checkFacultyStatus(email: string, firstName: string) {
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

export async function userHasCreatedProfile(email: string) {
  const classesSnap = await getAdminDb()
    .collection("Users")
    .doc(email)
    .collection("Classes")
    .get();

  return !classesSnap.empty;
}
