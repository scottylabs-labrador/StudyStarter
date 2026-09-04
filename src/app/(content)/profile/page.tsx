"use client";

import { useUser } from "~/lib/auth-client";
import { ClassList } from "~/features/profile/components/ClassList";
import { ProfileDetailsForm } from "~/features/profile/components/ProfileDetailsForm";
import { ProfileHeader } from "~/features/profile/components/ProfileHeader";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;

  return (
    <>
    <div className="profile-page-panel">
        <ProfileHeader user={user} />
        <ProfileDetailsForm userId={userId} />
        <ClassList />
        <br />
    </div>
    </>
  );
}
