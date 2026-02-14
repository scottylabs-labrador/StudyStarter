"use client";

import "~/styles/globals.css";
import Image from "next/image";
import darkLogo from "~/image/darkLogoLarge.png";
import lightLogo from "~/image/lightLogoLarge.png";
import { ShieldAlert } from "lucide-react";

export default function FacultyRestrictedPage() {
  return (
    <div className="min-h-screen bg-lightbg dark:bg-darkbg flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center py-16">
        
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image
            className="hidden dark:block"
            src={darkLogo}
            alt="CMU Study Logo"
            width={500}
            height={250}
            priority
          />
          <Image
            className="block dark:hidden"
            src={lightLogo}
            alt="CMU Study Logo"
            width={500}
            height={250}
            priority
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-lightButton dark:bg-darkButton shadow-lg">
            <ShieldAlert className="w-10 h-10 text-black dark:text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white">
          Access Restricted
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl text-black dark:text-white leading-relaxed">
          This platform is intended exclusively for CMU students.
          <br />
          Faculty members are not permitted to access or use this application.
        </p>

        {/* Subtle footer note */}
        <div className="mt-12 text-sm text-black dark:text-white opacity-70">
        If you believe you reached this page in error, please contact{" "}
        <a
          href="mailto:cmustudy.help@gmail.com?subject=Faculty%20Access%20Restriction%20Issue"
          className="underline hover:text-lightSelected dark:hover:text-darkSelected transition-colors"
        >
          cmustudy.help@gmail.com
        </a>
        .
        </div>

      </div>
    </div>
  );
}
