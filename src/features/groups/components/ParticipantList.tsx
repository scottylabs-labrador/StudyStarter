"use client";

import { AvatarImage } from "~/components/ui/UserAvatar";

type Participant = {
  name: string;
  url: string | null;
  email: string;
};

type ParticipantListProps = {
  participants: Participant[];
  onViewProfile: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function ParticipantList({ participants, onViewProfile }: ParticipantListProps) {
  return (
    <div className="participant-list">
      {participants.map((participant) => (
        <div key={participant.email} className="participant-row">
          <button
            onClick={onViewProfile}
            className="participant-row"
            data-username={participant.name}
            data-email={participant.email}
          >
            <AvatarImage
              src={participant.url}
              alt={participant.name}
              fallbackText={participant.name}
            />
            <p className="participant-name">{participant.name.split(" ")[0]}</p>
          </button>
        </div>
      ))}
    </div>
  );
}
