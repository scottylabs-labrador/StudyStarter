"use client";

import { ConfirmProvider } from "~/components/ui/ConfirmContext";
import { BlockList } from "~/features/profile/components/BlockList";

export default function BlockedStudentsPage() {
  return (
    <section className="settings-page blocked-students-page">
      <div className="screen-heading">
        <p className="eyebrow">Safety</p>
        <h1>Blocked Students</h1>
        <p>Blocking keeps you from sharing study groups with that student.</p>
      </div>
      <ConfirmProvider><BlockList /></ConfirmProvider>
    </section>
  );
}
