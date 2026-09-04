"use client";

import { LockKeyhole } from "lucide-react";
import { SignOutButton } from "~/lib/auth-client";
import { Wordmark } from "~/components/layout/Wordmark";

export default function AccessRestrictedPage() {
  return (
    <main className="center-page">
      <section className="center-panel">
        <Wordmark />
        <div className="access-lock mt-10"><LockKeyhole size={33} /></div>
        <h1>CMU Students Only</h1>
        <p>CMU Study is available only to current Carnegie Mellon students. If you believe you should have access, please contact support.</p>
        <div className="mt-7 flex justify-center gap-3">
          <a className="primary-action" href="mailto:cmustudy.help@gmail.com">Contact Support</a>
          <SignOutButton><button type="button" className="secondary-action">Sign out</button></SignOutButton>
        </div>
      </section>
    </main>
  );
}
