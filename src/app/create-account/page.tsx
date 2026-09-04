"use client";

import { ClassList } from "~/features/profile/components/ClassList";
import { ProfileDetailsForm } from "~/features/profile/components/ProfileDetailsForm";
import { ProfileHeader } from "~/features/profile/components/ProfileHeader";
import { useUserTheme } from "~/features/profile/hooks/useUserTheme";
import { useUser } from "~/lib/auth-client";

function ContinueButton() {
  return (
    <a href="/feed" className="button-primary">
      Continue
    </a>
  );
}

export default function CreateAccountPage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  useUserTheme(userId);

  return (
    <div className="profile-page-panel">
      <section className="workspace-header mb-5">
        <div>
          <div className="workspace-kicker">Welcome</div>
          <h1 className="workspace-title">Set up CMU Study</h1>
          <p className="workspace-subtitle">
            Add your profile details and at least one course to start finding
            useful study groups.
          </p>
        </div>
        <div className="workspace-actions">
          <ContinueButton />
        </div>
      </section>
      <div className="profile-workspace">
        <div className="profile-column">
          <ProfileHeader user={user} showLogout />
          <div className="settings-panel">
            <ProfileDetailsForm userId={userId} mastersValue="Masters" />
          </div>
        </div>
        <div className="profile-column">
          <div className="settings-panel">
            <ClassList />
          </div>
        </div>
      </div>
    </div>
  );
}
