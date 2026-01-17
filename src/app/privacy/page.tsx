// app/privacy/page.tsx
"use client";

import React from "react";
import "~/styles/globals.css";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex justify-center items-start bg-gradient-to-b from-lightbg to-lightSidebar dark:from-darkbg dark:to-darkSidebar px-6 py-16">
      <div className="max-w-3xl w-full backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl p-10 sm:p-14 transition-all duration-300">
        <h1 className="text-5xl font-extrabold mb-4 text-center tracking-tight bg-gradient-to-r from-lightSelected to-blue-500 dark:from-darkSelected dark:to-purple-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-sm text-center mb-12 opacity-70">
          Effective Date: November 1, 2025
        </p>

        <section className="space-y-10 leading-relaxed text-black dark:text-gray-200">
          <p className="text-lg opacity-90 text-center">
            <strong>CMU Study</strong> (“we,” “our,” or “the app”) uses the Google
            Calendar API solely to help users create and manage study-related
            events on their Google Calendar. This Privacy Policy explains what
            data we access, how we use it, how we store and protect it, and what
            control users have over their information.
          </p>

          {/* Data Accessed */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Data Accessed</h2>

            <p>CMU Study only requests the minimum Google Calendar permissions necessary to function.</p>

            <h3 className="font-semibold mt-4">Google User Data Accessed</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Permission to create new events on your Google Calendar</li>
              <li>Permission to delete events previously created by the app</li>
            </ul>

            <h3 className="font-semibold mt-4">Data We Do Not Access</h3>
            <p className="mt-2">We do <strong>not</strong> read, view, or access:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Existing events on your calendar</li>
              <li>Event titles, descriptions, times, or locations</li>
              <li>Attendee information</li>
              <li>Any other personal Google Calendar data</li>
            </ul>

            <p className="mt-3 opacity-90">
              No other Google user data is accessed beyond the limited scope described above.
            </p>
          </div>

          {/* How We Use Data */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">How We Use Google User Data</h2>

            <p>We use your granted calendar access solely to:</p>

            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Create events on your Google Calendar when you request it</li>
              <li>Delete events created by CMU Study if you choose to remove them</li>
            </ul>

            <p className="mt-4 opacity-90">We do <strong>not</strong>:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Process, analyze, or scan your events</li>
              <li>Use your data for advertising or marketing</li>
              <li>Combine calendar data with any other data sources</li>
            </ul>

            <p className="mt-4 opacity-90">
              All event creation and deletion occurs only when you explicitly request it.
            </p>
          </div>

          {/* Data Stored */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Data We Store</h2>

            <p>
              We store only one piece of information: the <strong>event ID</strong> for each event
              created by CMU Study. This ID allows the app to modify or delete the
              event later if you choose.
            </p>

            <p className="mt-4 opacity-90">We do <strong>not</strong> store:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Event titles</li>
              <li>Event descriptions</li>
              <li>Dates, times, or locations</li>
              <li>Attendee lists</li>
              <li>Any personal Google Calendar content</li>
            </ul>
          </div>

          {/* Data Sharing */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Data Sharing</h2>
            <p>
              We <strong>do not</strong> share, sell, or transmit any Google user data or stored
              event IDs to third parties.
            </p>

            <p className="mt-4">Your data is never shared with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Advertisers</li>
              <li>Analytics providers</li>
              <li>External companies or researchers</li>
              <li>Any third-party service</li>
            </ul>

            <p className="mt-4 opacity-90">
              CMU Study operates independently and does not integrate with any third-party
              system that uses your data.
            </p>
          </div>

          {/* Data Storage & Protection */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Data Storage & Protection</h2>

            <p>We use reasonable industry security measures to protect stored event IDs, including:</p>

            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Secure server storage</li>
              <li>Restricted internal access controls</li>
              <li>Logical and physical safeguards</li>
            </ul>

            <p className="mt-4 opacity-90">
              Since we do not store any personal calendar content, overall exposure risk is minimal.
            </p>
          </div>

          {/* Data Retention & Deletion */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Data Retention & Deletion</h2>

            <h3 className="font-semibold">How Long We Retain Data</h3>
            <p className="mt-2">
              Event IDs are retained only as long as needed to allow users to modify or delete
              events created by the app. They may be removed automatically when no longer necessary.
            </p>

            <h3 className="font-semibold mt-4">User Data Deletion</h3>
            <p className="mt-2">
              You may request deletion of stored event IDs at any time by contacting:
              <br />
              <strong>cmustudy.help@gmail.com</strong>
            </p>

            <h3 className="font-semibold mt-4">Revoking Access</h3>
            <p className="mt-2">
              You can revoke the app's access to your Google Account at any time via your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                className="text-lightSelected dark:text-darkSelected hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Account Permissions
              </a>{" "}
              page.  
              After access is revoked, the app will no longer be able to create or delete events.
            </p>
          </div>

          {/* Changes */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any revisions will be posted
              on this page with a new effective date.
            </p>
          </div>

          {/* Contact */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">Contact</h2>
            <p>
              For questions, support, or data deletion requests, please contact:
              <br />
              <strong>cmustudy.help@gmail.com</strong>
            </p>
          </div>
        </section>

        <footer className="text-center text-sm mt-12 opacity-70">
          &copy; {new Date().getFullYear()} CMU Study. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
