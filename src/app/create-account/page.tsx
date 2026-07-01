"use client";

import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ClassList } from "~/features/profile/components/ClassList";
import { ProfileDetailsForm } from "~/features/profile/components/ProfileDetailsForm";
import { ProfileHeader } from "~/features/profile/components/ProfileHeader";
import { db } from "~/lib/api/firebaseConfig";
import { useUser } from "~/lib/auth-client";

function ContinueButton() {
  return (
    <a href="/feed" className="button-outline bg-lightbg dark:bg-darkbg">
      Continue
    </a>
  );
}

export default function CreateAccountPage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    if (!userId) return;

    const loadTheme = async () => {
      try {
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const theme = docSnap.data().theme;
        document.documentElement.classList.toggle("dark", theme === "dark");
      } catch (error) {
        console.error(error);
      }
    };

    loadTheme();
  }, [userId]);

  return (
    <div className="profile-page-panel">
      <ProfileHeader user={user} showLogout />
      <ProfileDetailsForm userId={userId} mastersValue="Masters" />
      <ClassList />
      <br />
      <ContinueButton />
    </div>
  );
}
