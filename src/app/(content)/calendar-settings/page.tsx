import { CalendarDays, ExternalLink, ShieldCheck } from "lucide-react";

export default function CalendarSettingsPage() {
  return (
    <section className="settings-page">
      <div className="screen-heading">
        <p className="eyebrow">Preferences</p>
        <h1>Calendar Settings</h1>
        <p>Keep study plans close to the rest of your schedule.</p>
      </div>
      <div className="info-stack">
        <article className="info-card">
          <CalendarDays size={22} />
          <div>
            <h2>Study-group calendar events</h2>
            <p>
              When you choose to connect your calendar while creating or joining
              a group, CMU Study adds a one-hour event with the group details.
              Leaving a group removes that event where possible.
            </p>
          </div>
        </article>
        <article className="info-card">
          <ShieldCheck size={22} />
          <div>
            <h2>You stay in control</h2>
            <p>
              Calendar access is optional. You can revoke the app&apos;s access at
              any time from your account permissions.
            </p>
            <a
              className="inline-action"
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
            >
              Open account permissions <ExternalLink size={14} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
