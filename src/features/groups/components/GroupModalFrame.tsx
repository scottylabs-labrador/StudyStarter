"use client";

import type { ReactNode } from "react";

type GroupModalFrameProps = {
  id: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function GroupModalFrame({ id, title, onClose, children }: GroupModalFrameProps) {
  return (
    <div className="modal-overlay" id={id}>
      <div className="modal-panel">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close modal">
            <big>&times;</big>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
