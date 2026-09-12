import "server-only";

import { db } from "~/server/db";

type FacultyCheckResponse = {
  success?: boolean;
};

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
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn(
        `Faculty check failed: ${response.status} ${response.statusText}`,
      );
      return false;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.warn(
        `Faculty check returned non-JSON response: ${contentType ?? "unknown"}`,
      );
      return false;
    }

    const result = (await response.json()) as FacultyCheckResponse;
    return result?.success === true;
  } catch (error) {
    console.warn("Faculty check failed:", error);
    return false;
  }
}

export async function userHasCreatedProfile(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { courseCodes: true },
  });

  return (user?.courseCodes.length ?? 0) > 0;
}
