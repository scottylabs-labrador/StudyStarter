"use client";

import { ArrowLeft } from "lucide-react";
import { ClassList } from "~/features/profile/components/ClassList";

export default function OnboardingCoursesPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card onboarding-card onboarding-courses-card">
        <div className="onboarding-progress" aria-label="Step 2 of 2"><span className="active" /><span className="active" /></div>
        <a href="/onboarding/profile" className="back-action static" aria-label="Back"><ArrowLeft size={18} /></a>
        <h1>Add at least one course</h1>
        <p>Search the catalog to add your courses.</p>
        <ClassList />
        <a className="primary-action mt-4 w-full" href="/feed">Continue</a>
      </section>
    </main>
  );
}
