"use client";
import GroupDetails from "~/features/groups/components/GroupDetails";
import type { StudyGroup } from "~/types";
import React, { useState } from "react";
import { useUser } from "~/lib/auth-client";
import { formatDateTime } from "~/helpers/date_helper";
import type { MultiValue } from "react-select";
import TopFilterBar from "~/features/groups/components/FilterBar";
import { useDispatch } from "react-redux";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import { usePostHog } from "posthog-js/react";

import Card from "~/features/groups/components/Card";
import { groupCardColors } from "~/features/groups/constants";
import { useStudyGroups } from "~/features/groups/hooks/useStudyGroups";
import { useUserGroupState } from "~/features/groups/hooks/useUserGroupState";
import { shouldHideFeedGroup } from "~/features/groups/utils/groupFilters";
import { useUserCourses } from "~/features/profile/hooks/useUserCourses";

export default function FeedPage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const groups = useStudyGroups(Boolean(user));
  const { classes: userClasses } = useUserCourses(userId);
  const classOptions = userClasses.map((course) => ({
    value: course.courseID,
    label: course.courseID,
  }));
  const { joinedGroups, setJoinedGroups, blockedUsers } =
    useUserGroupState(userId);
  const [selectedCourses, setSelectedCourses] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<StudyGroup | null>(null);
  const showFullFilter = false;
  const dispatch = useDispatch();
  const posthog = usePostHog();

  const handleCardClick = (group: StudyGroup) => {
    setSelectedGroup(group.id);
    setShowDetails(group);
    posthog.capture("group_clicked", { group: group });
  };

  const closeDetailsPopUp = () => {
    setShowDetails(null);
    setSelectedGroup(null);
  };

  const handleCreateGroup = () => {
    dispatch(setIsCreateGroupModalOpen(true));
  };

  const displayScheduled = groups.map((group) => {
    const [formattedDate, formattedTime] = formatDateTime(group.startTime);
    const isInGroup = joinedGroups ? joinedGroups.includes(group.id) : false;
    const cardColors =
      group.id === selectedGroup
        ? groupCardColors.selected
        : groupCardColors.default;
    if (
      shouldHideFeedGroup({
        group,
        joinedGroups,
        blockedUsers,
        showFullFilter,
        selectedDate,
        selectedCourseValues: selectedCourses.map((course) => course.value),
      })
    )
      return;
    return (
      <Card
        key={group.id}
        onClick={() => handleCardClick(group)}
        group={group}
        time={formattedTime}
        date={formattedDate}
        isInGroup={isInGroup}
        lightColor={cardColors.light}
        darkColor={cardColors.dark}
      />
    );
  });
  displayScheduled.unshift(
    <div key="create-group" className="create-card" onClick={handleCreateGroup}>
      <p className="text-6xl leading-none">+</p>
    </div>,
  );

  const showNone = displayScheduled.every((group) => group === undefined);

  return (
    <main className="container relative h-screen">
      <TopFilterBar
        courseOptions={classOptions}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="pt-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
          {/* Display Scheduled Section */}
          <div className={`${showDetails ? "md:col-span-2" : "md:col-span-3"}`}>
            <div
              className={`grid gap-5 ${
                showNone ? "justify-center" : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {showNone ? (
                <p className="text-black dark:text-white">No groups found</p>
              ) : (
                displayScheduled
              )}
            </div>
          </div>

          {/* GroupDetails Section: on mobile */}
          {showDetails && (
            <div
              className="details-overlay"
              onClick={(e) =>
                e.target === e.currentTarget && closeDetailsPopUp()
              }
            >
              <div
                className="details-overlay-inner"
                onClick={(e) => e.stopPropagation()}
              >
                <GroupDetails
                  details={showDetails}
                  onClick={() => closeDetailsPopUp()}
                  updateJoinedGroups={setJoinedGroups}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
