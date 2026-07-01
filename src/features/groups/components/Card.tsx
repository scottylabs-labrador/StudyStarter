"use client";
import type groupDetails from "~/types";

interface Props {
  onClick: (g: groupDetails) => void;
  group: groupDetails;
  time: string | null;
  date: string | null;
  isInGroup: boolean;
  lightColor: string;
  darkColor: string;
}


const Card = ({ onClick, group, time,  date, isInGroup, lightColor, darkColor }: Props) => {
  const colorClassName =
    lightColor === "lightAccent" && darkColor === "darkAccent"
      ? "study-card-accent"
      : "study-card-sidebar";

  return (
    <div
        className={`study-card ${colorClassName}`}
        onClick={() => onClick(group)}
      >
        <div className="study-card-title">{group.title}</div>
        <ul className="study-card-row">
          <li className="study-card-label"> Course: &nbsp; </li>
          <li className="study-card-value">{group.course}</li>
        </ul>
        <ul className="study-card-row">
          <li className="study-card-label"> Purpose: &nbsp; </li>
          <li className="study-card-value">{group.purpose}</li>
        </ul>
        <ul className="study-card-row">
          <li className="study-card-label"> Time: &nbsp; </li> <li>{time}</li>
        </ul>
        <ul className="study-card-row">
          <li className="study-card-label"> Date: &nbsp; </li> <li>{date}</li>
        </ul>
        <ul className="study-card-row">
          <li className="study-card-label"> Location: &nbsp; </li>
          <li className="study-card-value">{group.location}</li>
        </ul>
        {isInGroup && <ul className="joined-row">
          <li className="joined-badge">Joined</li>
        </ul>}
      </div>
  );
};

export default Card;
