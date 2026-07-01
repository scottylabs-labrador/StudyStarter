"use client";

import { Pencil } from "lucide-react";

type GroupDetailsHeaderProps = {
  title: string;
  canEdit: boolean;
  onEdit: () => void;
  onClose: () => void;
};

export function GroupDetailsHeader({
  title,
  canEdit,
  onEdit,
  onClose,
}: GroupDetailsHeaderProps) {
  return (
    <div className="group-details-header">
      <p className="group-details-title">{title}</p>
      {canEdit ? (
        <button
          className="group-details-action"
          onClick={onEdit}
          aria-label="Edit group"
        >
          <Pencil size={20} />
        </button>
      ) : (
        <div />
      )}
      <button
        className="group-details-action"
        onClick={onClose}
        aria-label="Close details"
      >
        <big>&times;</big>
      </button>
    </div>
  );
}
