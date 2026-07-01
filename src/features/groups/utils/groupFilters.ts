import { isInThePast } from "~/helpers/date_helper";
import type { StudyGroup } from "~/types";

type GroupFilterInput = {
  group: StudyGroup;
  selectedDate?: Date | null;
  selectedCourseValues?: string[];
};

type FeedGroupFilterInput = GroupFilterInput & {
  joinedGroups?: string[] | null;
  blockedUsers?: string[];
  showFullFilter: boolean;
};

function isSameCalendarDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  );
}

function hasSelectedValue(selectedValues: string[] | undefined, value: string) {
  return !selectedValues?.length || selectedValues.includes(value);
}

function hasBlockedParticipant(group: StudyGroup, blockedUsers: string[] = []) {
  if (!blockedUsers.length) return false;

  return group.participantDetails.some((participant) =>
    blockedUsers.includes(participant.email?.toLowerCase() || ""),
  );
}

export function shouldHideBySharedFilters({
  group,
  selectedDate,
  selectedCourseValues,
}: GroupFilterInput) {
  if (isInThePast(group.startTime)) return true;

  if (
    selectedDate &&
    !isSameCalendarDate(group.startTime.toDate(), selectedDate)
  ) {
    return true;
  }

  if (!hasSelectedValue(selectedCourseValues, group.course)) {
    return true;
  }

  return false;
}

export function shouldHideFeedGroup({
  group,
  joinedGroups,
  blockedUsers,
  showFullFilter,
  selectedDate,
  selectedCourseValues,
}: FeedGroupFilterInput) {
  const isFull = group.participantDetails.length >= group.totalSeats;
  const isParticipant = joinedGroups?.includes(group.id);

  if (hasBlockedParticipant(group, blockedUsers)) {
    return true;
  }

  if (isFull && !showFullFilter && !isParticipant) {
    return true;
  }

  return shouldHideBySharedFilters({
    group,
    selectedDate,
    selectedCourseValues,
  });
}
