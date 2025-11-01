// app/privacy/page.tsx
"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-950 px-6 py-12 transition-colors duration-300">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-4xl font-bold mb-4 text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-10">
          Effective date: November 1, 2025
        </p>

        <section className="space-y-8 leading-relaxed">
          <p>
            <strong>CMU Study</strong> uses the Google Calendar API solely to
            help users add events to their Google Calendar and, if requested by
            the user, delete those same events.
          </p>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Data We Access</h2>
            <p>
              This app <strong>never reads or accesses existing calendar events</strong> or
              other calendar data. It only has permission to create new events
              on your behalf and optionally delete events that it previously
              created.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Data We Store</h2>
            <p>
              The only data stored by the app is the <strong>event ID</strong> for each
              event it creates. This ID is used solely to identify which events
              can be modified or deleted later if the user chooses to remove
              them.
            </p>
            <p>
              No other calendar information (such as event titles, times, or
              attendee details) is ever stored or retained.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">How We Use Data</h2>
            <p>
              Stored event IDs are used only to manage events that were created
              by the app. We do not share, sell, or transmit any user data to
              third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">User Control</h2>
            <p>
              You can revoke our app's access to your Google Account at any time
              via your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Google Account Permissions
              </a>{" "}
              page.
            </p>
            <p>
              You may also request deletion of any data the app has stored by
              contacting us at <strong>cmustudy.help@gmail.com</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
            <p>
              We take reasonable measures to protect stored event IDs and ensure
              that no unauthorized access occurs. Since no personal calendar
              data is stored, exposure risk is minimal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any updates
              will be reflected on this page with a revised effective date.
            </p>
          </div>
        </section>

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12">
          &copy; {new Date().getFullYear()} CMU Study. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
