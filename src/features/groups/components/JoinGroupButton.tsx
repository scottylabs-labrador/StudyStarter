"use client";

type JoinGroupButtonProps = {
  isJoined: boolean;
  onClick: () => void;
};

export function JoinGroupButton({ isJoined, onClick }: JoinGroupButtonProps) {
  return (
    <button
      id="card_info_join_btn"
      className={`join-button ${isJoined ? "join-button-active" : "join-button-inactive"}`}
      onClick={onClick}
    >
      {isJoined ? "Leave" : "Join"}
    </button>
  );
}
