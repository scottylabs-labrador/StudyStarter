"use client";
import type { StudyGroup } from "~/types";

interface Props {
  onClick: (g: StudyGroup) => void;
  group: StudyGroup;
  time: string | null;
  date: string | null;
  isInGroup: boolean;
  lightColor: string;
  darkColor: string;
}

const Card = ({
  onClick,
  group,
  time,
  date,
  isInGroup,
  lightColor,
  darkColor,
}: Props) => {
  const month = group.startTime.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = String(group.startTime.getDate());
  const weekday = group.startTime.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  const isFull = group.participantDetails.length >= group.totalSeats;
  const actionLabel = isInGroup ? "Joined" : isFull ? "Full" : "Join";

  return (
    <div
      className="study-card"
      onClick={() => onClick(group)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(group);
        }
      }}
    >
      <div className="study-date-tile"><small>{month}</small><strong>{day}</strong><small>{weekday}</small></div>
      <div className="min-w-0">
        <div className="study-card-title">{group.title}</div>
        <div className="study-card-meta">
          <span>{group.course}</span><span>•</span><span>{group.purpose}</span>
          <span>◷ {time}</span><span>⌖ {group.location}</span>
        </div>
      </div>
      <div className={`study-card-action ${isInGroup ? "study-card-action-joined" : ""} ${isFull && !isInGroup ? "study-card-action-full" : ""}`}>
        <div>{group.participantDetails.length}/{group.totalSeats}</div><div>{actionLabel}</div>
      </div>
    </div>
  );
};

export default Card;
