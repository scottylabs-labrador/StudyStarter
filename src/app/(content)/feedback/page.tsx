"use client";

import { ArrowLeft, Heart } from "lucide-react";

export default function FeedbackPage() {
  return (
    <section className="feedback-page">
      <a href="/feed" className="back-action" aria-label="Back to Group Finder">
        <ArrowLeft size={20} />
      </a>
      <div className="feedback-card">
        <div className="feedback-heart"><Heart fill="currentColor" size={32} /></div>
        <h1>We&apos;d love your feedback!</h1>
        <p>Help us improve CMU Study for students like you.</p>
        <a
          href="https://forms.gle/MEQ7miCZCrC48P6y8"
          target="_blank"
          rel="noreferrer"
          className="primary-action feedback-send"
        >
          Send Feedback
        </a>
      </div>
    </section>
  );
}
