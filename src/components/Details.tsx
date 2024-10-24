import React, { ReactNode, useState } from "react";
import groupDetails from "~/types/groupDetails";
interface Props {
  details: groupDetails;
}

const Details = ({ details }: Props) => {
  const [participantsState, participantsSetState] = useState(true);
  const [joinedState, joinedSetState] = useState(false);
  return (
    <div
      className="card text-dark mb-3 ms-auto bg-white me-5 mt-3"
      style={{ maxWidth: "30rem", height: "30rem", borderRadius: "10px" }}
    >
      <div
        className="card-header"
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "35px",
          fontFamily: "Verdana",
        }}
      >
        {details.groupName}
      </div>
      <div className="card-body">
        <p
          className="card-text"
          style={{ fontSize: "20px", fontFamily: "Verdana" }}
        >
          {" "}
          <strong>Course</strong>: {details.course}{" "}
        </p>
        <p
          className="card-text"
          style={{ fontSize: "20px", fontFamily: "Verdana" }}
        >
          {" "}
          <strong>Location</strong>: {details.location}{" "}
        </p>
        <p
          className="card-text"
          style={{ fontSize: "20px", fontFamily: "Verdana" }}
        >
          <strong>Participants</strong>: {details.numParticipants}/
          {details.totalSeats}{" "}
          <button
            onClick={() => participantsSetState(!participantsState)}
            className="dropdown-button"
            style={{ color: "black", fontSize: "12px" }}
          >
            {participantsState ? "▼" : "▲"}
          </button>
        </p>
        {participantsState &&
          details.participantDetails.map((participantDetail) => (
            <p
              className="card-text"
              style={{
                fontSize: "20px",
                fontFamily: "Verdana",
                textIndent: "2rem",
              }}
            >
              {" "}
              <strong>Name</strong>: {participantDetail}
            </p>
          ))}
        <p
          className="card-heading"
          style={{ fontSize: "20px", fontFamily: "Verdana" }}
        >
          {" "}
          <strong>Details</strong>:
        </p>
        <div
          className="card mb-3 text-white"
          style={{
            height: "8rem",
            maxWidth: "20rem",
            backgroundColor: "#e0ded7",
            borderRadius: "10px",
            margin: "0 auto",
            marginTop: "10px"
          }}
        >
          <div className="card-body" style={{ color: "black", padding: "5px" }}>
            {details.details}
          </div>
        </div>
        <button
          className={"btn btn-secondary float-end pe-3 mt-3 me-3"}
          onClick={() => joinedSetState(!joinedState)}
          style={{
            borderColor: (joinedState ? "blue" : "black"),
            borderWidth: "4px",
            borderRadius: "26px",
            padding: "10px",
            backgroundColor: (joinedState ? "#226cf5" : "#f5f4f0"),
            width: "100px"
            
          }}
        >
          {joinedState ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default Details;
