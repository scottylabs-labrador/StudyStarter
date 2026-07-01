"use client";

import { SignOutButton } from "~/lib/auth-client";
import { UserAvatar } from "~/components/ui/UserAvatar";

type ProfileHeaderProps = {
  user?: {
    image?: unknown;
    imageUrl?: string | null;
    firstName?: string | null;
    fullName?: string | null;
    username?: string | null;
    emailAddresses?: { emailAddress?: string }[];
  } | null;
  showLogout?: boolean;
};

export function ProfileHeader({ user, showLogout = false }: ProfileHeaderProps) {
  const displayName = user?.fullName || user?.firstName || user?.username || "User";
  const emailAddress = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div className="flex items-center mb-4">
      <UserAvatar user={user} size="lg" />
      <div className="ml-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">{displayName}</h1>
        <p className="text-black dark:text-white">{emailAddress}</p>
      </div>
      {showLogout && (
        <div className="ml-auto">
          <SignOutButton>
            <button className="button-primary">Logout</button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}
