// app/privacy/page.tsx
"use client";

import React from "react";
import "~/styles/globals.css";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex justify-center items-start bg-lightbg dark:bg-darkbg px-6 py-12">
      <div className="max-w-3xl w-full bg-lightSidebar dark:bg-darkSidebar text-black dark:text-white rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-4xl font-bold mb-4 text-center text-black dark:text-white">Privacy Policy</h1>
        <p className="text-sm text-black dark:text-white text-center mb-10 opacity-75">
          Effective date: November 1, 2025
        </p>

        <section className="space-y-8 leading-relaxed text-black dark:text-white">
          <p>
            <strong>CMU Study</strong> uses the Google Calendar API solely to
            help users add events to their Google Calendar and, if requested by
            the user, delete those same events.
          </p>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Data We Access</h2>
            <p className="text-black dark:text-white">
              This app <strong>never reads or accesses existing calendar events</strong> or
              other calendar data. It only has permission to create new events
              on your behalf and optionally delete events that it previously
              created.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Data We Store</h2>
            <p className="text-black dark:text-white">
              The only data stored by the app is the <strong>event ID</strong> for each
              event it creates. This ID is used solely to identify which events
              can be modified or deleted later if the user chooses to remove
              them.
            </p>
            <p className="text-black dark:text-white">
              No other calendar information (such as event titles, times, or
              attendee details) is ever stored or retained.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">How We Use Data</h2>
            <p className="text-black dark:text-white">
              Stored event IDs are used only to manage events that were created
              by the app. We do not share, sell, or transmit any user data to
              third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">User Control</h2>
            <p className="text-black dark:text-white">
              You can revoke our app's access to your Google Account at any time
              via your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lightSelected dark:text-darkSelected hover:underline"
              >
                Google Account Permissions
              </a>{" "}
              page.
            </p>
            <p className="text-black dark:text-white">
              You may also request deletion of any data the app has stored by
              contacting us at <strong>cmustudy.help@gmail.com</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Data Security</h2>
            <p className="text-black dark:text-white">
              We take reasonable measures to protect stored event IDs and ensure
              that no unauthorized access occurs. Since no personal calendar
              data is stored, exposure risk is minimal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">Changes to This Policy</h2>
            <p className="text-black dark:text-white">
              We may update this privacy policy from time to time. Any updates
              will be reflected on this page with a revised effective date.
            </p>
          </div>
        </section>

        <footer className="text-center text-sm text-black dark:text-white mt-12 opacity-75">
          &copy; {new Date().getFullYear()} CMU Study. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

