"use client";
import { useRouter } from "next/navigation";
import "~/styles/globals.css";
import { useUser, SignInButton, SignedIn, SignedOut } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import darkLogo from "~/image/darkLogoLarge.png";
import lightLogo from "~/image/lightLogoLarge.png";
import {
  Users,
  Calendar,
  MapPin,
  BookOpen,
  Search,
  PlusCircle,
} from "lucide-react";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsRedirecting(true);
    router.replace("/login");
  }, [user, router]);

  return (
    <div className="landing-page">
      <SignedOut>
        <div className="landing-content">
          {/* Hero Section */}
          <div className="landing-hero">
            <div className="mb-8 flex justify-center">
              <Image
                className="hidden dark:block"
                src={darkLogo}
                alt="CMU Study Logo"
                width={600}
                height={300}
                priority
              />
              <Image
                className="block dark:hidden"
                src={lightLogo}
                alt="CMU Study Logo"
                width={600}
                height={300}
                priority
              />
            </div>

            <h1 className="landing-title">Find Your Study Group</h1>
            <p className="landing-subtitle">
              Connect with CMU students. Create, find, and join study groups for
              your classes.
            </p>

            <div className="landing-actions">
              <SignInButton forceRedirectUrl="/login">
                <button className="button-large">Create Account</button>
              </SignInButton>
              <SignInButton forceRedirectUrl="/login">
                <button className="button-large">Sign in</button>
              </SignInButton>
            </div>
          </div>

          {/* Features Section */}
          <div className="feature-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <PlusCircle className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="feature-title">Create Groups</h3>
              <p className="feature-copy">
                Easily create study groups for your classes. Set the time,
                location, and purpose.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Search className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="feature-title">Find Groups</h3>
              <p className="feature-copy">
                Search and filter study groups by course, or date to find the
                perfect match.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Users className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="feature-title">Join & Collaborate</h3>
              <p className="feature-copy">
                Join study groups and collaborate with other CMU students to
                achieve your academic goals.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="feature-title">Manage Classes</h3>
              <p className="feature-copy">
                Organize your study groups by class and track all your academic
                commitments in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon">
                <MapPin className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="feature-title">CMU Locations</h3>
              <p className="feature-copy">
                Meet at popular CMU locations like Gates, Wean, Doherty, or join
                virtual sessions on Zoom.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="feature-title">Schedule Sessions</h3>
              <p className="feature-copy">
                Plan your study sessions with clear dates and times. Never miss
                an important study group again.
              </p>
            </div>
          </div>

          {/* Privacy Policy Link */}
          <div className="mb-4 mt-8">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link-subtle"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {isRedirecting && (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-2xl font-bold text-black dark:text-white">
                Welcome back!
              </div>
              <div className="text-black dark:text-white">
                Redirecting you...
              </div>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}
