"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SignInButton } from "~/lib/auth-client";
import { Wordmark } from "~/components/layout/Wordmark";

export default function SignInPage() {
  const [create, setCreate] = useState(false);
  useEffect(() => setCreate(new URLSearchParams(window.location.search).get("mode") === "create"), []);
  return (
    <main className="entry-page">
      <a href="/" className="entry-back"><ArrowLeft size={17} /> Back</a>
      <div className="entry-cards">
        <section className={`entry-card ${!create ? "entry-card-active" : ""}`}>
          <Wordmark />
          <h1>Welcome back!</h1>
          <p>Sign in with your CMU account.</p>
          <label>CMU email<input disabled value="username@andrew.cmu.edu" aria-label="CMU email" readOnly /></label>
          <SignInButton forceRedirectUrl="/login"><button type="button" className="primary-action w-full">Sign in with SSO (CMU)</button></SignInButton>
          <a href="/sign-in?mode=create">New to CMU Study? <strong>Create an account</strong></a>
        </section>
        <section className={`entry-card ${create ? "entry-card-active" : ""}`}>
          <Wordmark />
          <h1>Create your account</h1>
          <p>Use your CMU email to get started.</p>
          <div className="entry-identity"><ShieldCheck size={18} /> Your CMU identity is securely provided through single sign-on.</div>
          <SignInButton forceRedirectUrl="/login"><button type="button" className="primary-action w-full">Create account with SSO</button></SignInButton>
          <a href="/sign-in">Already have an account? <strong>Sign in</strong></a>
        </section>
      </div>
    </main>
  );
}
