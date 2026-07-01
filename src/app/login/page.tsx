import { redirect } from "next/navigation";

import { checkFacultyStatus, userHasCreatedProfile } from "~/features/profile/services/serverAccountService";
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

  const isFaculty = await checkFacultyStatus(email, session.user.name ?? "User");

  if (isFaculty) {
    redirect("/access-restricted");
  }

  if (!(await userHasCreatedProfile(email))) {
    redirect("/create-account");
  }
  redirect("/feed");
}
