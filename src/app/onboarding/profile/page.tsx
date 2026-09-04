"use client";

import { ArrowLeft } from "lucide-react";
import { useUser } from "~/lib/auth-client";
import { ProfileDetailsForm } from "~/features/profile/components/ProfileDetailsForm";

export default function OnboardingProfilePage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  return (
    <main className="auth-shell">
      <section className="auth-card onboarding-card">
        <div className="onboarding-progress" aria-label="Step 1 of 2"><span className="active" /><span /></div>
        <a href="/" className="back-action static" aria-label="Back"><ArrowLeft size={18} /></a>
        <h1>Tell us about yourself</h1>
        <p>This helps you connect with the right study groups.</p>
        <div className="mt-6"><ProfileDetailsForm userId={userId} mastersValue="Masters Student" /></div>
        <a className="primary-action mt-4 w-full" href="/onboarding/courses">Continue</a>
      </section>
    </main>
  );
}
