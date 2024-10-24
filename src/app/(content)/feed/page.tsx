"use client";
import { useState } from "react";
import Details from "~/components/Details";
import groupDetails from "~/types";

export default function FeedPage() {
  const opens = [
    {
      title: "18100 HW 5",
      course: "18100",
      time: "12/1 10:00",
      location: "Hunt",
    },
    {
      title: "21127 test 2 prep",
      course: "21127",
      time: "12/24 10:00",
      location: "Stever",
    },
  ];
  const scheduled = [
    {
      title: "18100 study group",
      course: "18100",
      time: "TBD",
      location: "Hunt",
    },
    {
      title: "21127 HELP ME PLEASE",
      course: "21127",
      time: "Wednesday 10:00",
      location: "Wean",
    },
  ];

  const [showDetails, setShowDetails] = useState(true);
  // Create sampel groupDetails
  const sampleGroup: groupDetails = {
    groupName: "Concepts Preparation",
    numParticipants: 3,
    totalSeats: 4,
    location: "Giant Eagle",
    time: "Sun, Oct 6: 4:00 - 5:00pm",
    course: "21-127",
    participantDetails: [
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
    ],
    details: "This is for Greggo's Class, not Newstead's!",
  };

  const displayOpens = opens.map((studyGroupCard) => (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg">
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{studyGroupCard.title}</div>
        <ul>
          <li>{studyGroupCard.course}</li>
          <li>{studyGroupCard.time}</li>
          <li>{studyGroupCard.location}</li>
        </ul>
      </div>
    </div>
  ));

  const displayScheduled = scheduled.map((studyGroupCard) => (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg">
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{studyGroupCard.title}</div>
        <ul>
          <li>{studyGroupCard.course}</li>
          <li>{studyGroupCard.time}</li>
          <li>{studyGroupCard.location}</li>
        </ul>
      </div>
    </div>
  ));

  return (
    <main className="container relative h-screen overflow-scroll">
      <div className="flex w-full">
        <div className="m-[2.5vw] w-[60vw]">
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="-mb-px flex flex-wrap"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
            >
              <li className="mr-2" role="presentation">
                <button
                  className="inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  id="open-tab"
                  data-tabs-target="#open"
                  type="button"
                  role="tab"
                  aria-controls="open"
                  aria-selected="false"
                >
                  Open
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className="active inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  id="scheduled-tab"
                  data-tabs-target="#scheduled"
                  type="button"
                  role="tab"
                  aria-controls="scheduled"
                  aria-selected="true"
                >
                  Scheduled
                </button>
              </li>
            </ul>
          </div>
          <div id="myTabContent">
            <div
              className="hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              id="open"
              role="tabpanel"
              aria-labelledby="open-tab"
            >
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-4">{displayOpens}</div>
              </div>
            </div>
            <div
              className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              id="scheduled"
              role="tabpanel"
              aria-labelledby="scheduled-tab"
            >
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-4">{displayScheduled}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-[25vw]">
          {showDetails && (
            <Details
              details={sampleGroup}
              onClick={() => setShowDetails(false)}
            ></Details>
          )}
        </div>
      </div>
      <script src="https://unpkg.com/@themesberg/flowbite@1.2.0/dist/flowbite.bundle.js"></script>
    </main>
  );
}
