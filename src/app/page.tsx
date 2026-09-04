"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignedOut, useUser } from "~/lib/auth-client";
import { Wordmark } from "~/components/layout/Wordmark";

function LandingHero() {
  return (
    <div className="landing-hero">
      <section className="landing-copy">
        <h1 className="landing-title">Find. Create. Study.<span className="highlight">Succeed together.</span></h1>
        <p className="landing-subtitle">CMU Study helps Carnegie Mellon students find and create study groups that fit their courses, schedule, and goals.</p>
        <ul className="landing-bullets">
          <li><CheckCircle2 size={15} /> Find upcoming study sessions</li>
          <li><CheckCircle2 size={15} /> Create your own group in minutes</li>
          <li><CheckCircle2 size={15} /> Join, leave, and manage your groups</li>
          <li><CheckCircle2 size={15} /> Add sessions to your personal calendar</li>
        </ul>
        <div className="landing-actions">
          <a className="primary-action" href="/sign-in?mode=create">Get Started</a>
          <a className="secondary-action" href="/sign-in">Sign in</a>
        </div>
        <p className="landing-students-only">◉ CMU students only</p>
      </section>
      <div className="landing-art" aria-label="Students studying together on campus" role="img">
        <div className="campus-tower" /><div className="hero-trees" /><div className="study-group-art" />
        <div className="student student-one" /><div className="student student-two" /><div className="student student-three" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => { if (user) router.replace("/login"); }, [router, user]);

  return <main className="landing-page"><SignedOut><div className="landing-content">
    <header className="landing-header">
      <Wordmark />
      <nav className="landing-links" aria-label="Landing navigation"><a href="#features">Features</a><a href="#students">For Students</a><a href="/privacy">Privacy</a><a href="mailto:cmustudy.help@gmail.com">Support</a></nav>
      <div className="landing-header-actions"><a href="/sign-in" className="text-action">Sign in</a><a href="/sign-in?mode=create" className="primary-action">Get Started</a></div>
    </header>
    <LandingHero />
    <section id="features" className="sr-only"><h2>Features</h2><p>Find, create, join, and manage CMU study groups.</p></section>
    <section id="students" className="sr-only"><h2>For Students</h2><p>CMU Study is for CMU students.</p></section>
  </div></SignedOut></main>;
}
