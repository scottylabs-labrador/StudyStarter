"use client";

import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useMemo } from "react";
import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";
import { useRouter } from "next/navigation";

type CompatUser = {
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string;
  fullName: string;
  id: string;
  imageUrl?: string;
  username?: string;
};

type ButtonProps = {
  children: ReactNode;
};

type SignInButtonProps = ButtonProps & {
  forceRedirectUrl?: string;
};

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? `${window.location.origin}/api/auth`
      : `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/api/auth`,
  plugins: [genericOAuthClient()],
});

function getCompatUser(session: ReturnType<typeof authClient.useSession>["data"]): CompatUser | null {
  if (!session?.user) {
    return null;
  }

  const name = session.user.name ?? "";
  const firstName = name.split(" ").filter(Boolean)[0];

  return {
    id: session.user.id,
    fullName: name,
    firstName,
    username: undefined,
    imageUrl: session.user.image ?? undefined,
    emailAddresses: [{ emailAddress: session.user.email }],
  };
}

function withClickHandler(children: ReactNode, onClick: () => void): ReactNode {
  if (!isValidElement(children)) {
    return (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    );
  }

  const element = children as ReactElement<{ onClick?: () => void }>;

  return cloneElement(element, {
    onClick: () => {
      element.props.onClick?.();
      onClick();
    },
  });
}

export function useUser() {
  const session = authClient.useSession();
  const user = useMemo(() => getCompatUser(session.data), [session.data?.user]);

  return {
    user,
    isLoaded: !session.isPending,
    isSignedIn: Boolean(user),
  };
}

export function SignedIn({ children }: ButtonProps) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return <>{children}</>;
}

export function SignedOut({ children }: ButtonProps) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return <>{children}</>;
}

export function SignInButton({ children, forceRedirectUrl = "/login" }: SignInButtonProps) {
  const handleSignIn = async () => {
    await authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: forceRedirectUrl,
    });
  };

  return <>{withClickHandler(children, handleSignIn)}</>;
}

export function SignOutButton({ children }: ButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return <>{withClickHandler(children, handleSignOut)}</>;
}
