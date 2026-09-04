import { ArrowLeft } from "lucide-react";

const sections = [
  ["Calendar Permissions", <>CMU Study requests only the permission needed to create new study-related events and delete events it previously created. It does not read, view, or access existing calendar events, their titles, descriptions, times, locations, attendees, or other calendar content.</>],
  ["Calendar Event Handling", <>Calendar access is used only when you request a study-group event to be created, updated, or removed. We do not process, analyze, scan, advertise with, or combine calendar information with other sources.</>],
  ["Data We Collect", <>We store only the identifier for an event created by CMU Study so that the event can later be updated or deleted at your request. We do not store calendar titles, descriptions, dates, times, locations, attendee lists, or calendar content.</>],
  ["Data Retention", <>Event identifiers are retained only while they are needed to manage events created by CMU Study and may be removed when no longer necessary. You may request deletion of stored event identifiers by contacting cmustudy.help@gmail.com.</>],
  ["Revoking Calendar Access", <>You can revoke CMU Study&apos;s access to your Google Account at any time through your <a className="inline-action" href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">Google Account Permissions</a>. Once revoked, CMU Study can no longer create, update, or delete calendar events.</>],
  ["Contact & Support", <>For questions, support, or data-deletion requests, contact <strong>cmustudy.help@gmail.com</strong>. We do not share, sell, or transmit stored event identifiers or Google user data to advertisers, analytics providers, researchers, or other third parties.</>],
] as const;

export default function PrivacyPage() {
  return <main className="privacy-page"><section className="privacy-card">
    <a href="/" className="back-action static"><ArrowLeft size={19} /></a>
    <h1 className="privacy-title">Privacy Policy</h1>
    <p className="privacy-intro">CMU Study respects your privacy and keeps your data safe. Effective November 1, 2025.</p>
    <div className="privacy-accordion">{sections.map(([title, content], index) => <details key={title} open={index === 0}><summary>{title}</summary><div>{content}</div></details>)}</div>
    <footer>Last updated: May 1, 2025</footer>
  </section></main>;
}
