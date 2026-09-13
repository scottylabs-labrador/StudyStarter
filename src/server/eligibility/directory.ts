import "server-only";

export type DirectoryCheckResult = "ELIGIBLE" | "INELIGIBLE" | "UNAVAILABLE";

type FetchFunction = typeof fetch;

const DIRECTORY_URL = "https://directory.andrew.cmu.edu/index.cgi";
const STUDENT_CLASS_LEVEL_MARKER = "<br /><p><b>Student Class Level:</b><br />";

/**
 * Checks CMU Directory using the same request and student marker as the retired
 * Firebase helper. Only a positive student marker grants access.
 */
export async function checkDirectoryEligibility(
  email: string,
  fetchFunction: FetchFunction = fetch,
): Promise<DirectoryCheckResult> {
  const formData = new URLSearchParams({
    search: email,
    action: "Search",
    searchtype: "basic",
    activetab: "basic",
  });

  try {
    const response = await fetchFunction(DIRECTORY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: formData,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn("CMU Directory eligibility request returned an error", {
        status: response.status,
      });
      return "UNAVAILABLE";
    }

    const html = await response.text();
    if (!html.trim()) {
      console.warn("CMU Directory eligibility request returned an empty page");
      return "UNAVAILABLE";
    }

    return html.includes(STUDENT_CLASS_LEVEL_MARKER)
      ? "ELIGIBLE"
      : "INELIGIBLE";
  } catch (error) {
    console.warn("CMU Directory eligibility request failed", {
      error: error instanceof Error ? error.name : "unknown",
    });
    return "UNAVAILABLE";
  }
}
