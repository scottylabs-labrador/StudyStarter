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

export function ProfileHeader({
  user,
  showLogout = false,
}: ProfileHeaderProps) {
  const displayName =
    user?.fullName ?? user?.firstName ?? user?.username ?? "User";
  const emailAddress = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div className="profile-identity">
      <UserAvatar user={user} size="lg" />
      <div>
        <h1>{displayName}</h1>
        <p>{emailAddress}</p>
      </div>
      {showLogout && (
        <SignOutButton><button className="button-primary">Logout</button></SignOutButton>
      )}
    </div>
  );
}
