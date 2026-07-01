"use client";

import { ConfirmProvider } from "~/components/ui/ConfirmContext";
import { useUser } from "~/lib/auth-client";
import { BlockList } from "~/features/profile/components/BlockList";
import { ClassList } from "~/features/profile/components/ClassList";
import { ProfileDetailsForm } from "~/features/profile/components/ProfileDetailsForm";
import { ProfileHeader } from "~/features/profile/components/ProfileHeader";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;

  return (
    <div className="profile-page-panel">
      <ConfirmProvider>
        <ProfileHeader user={user} />
        <ProfileDetailsForm userId={userId} />
        <ClassList />
        <BlockList />
        <br />
      </ConfirmProvider>
    </div>
  );
}
