import { db } from "~/server/db";

export async function listGroups(courseCode?: string) {
  const groups = await db.studyGroup.findMany({
    where: courseCode ? { courseCode } : undefined,
    orderBy: { startTime: "asc" },
    include: {
      memberships: {
        orderBy: { joinedAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return groups.map(({ memberships, ...group }) => ({
    ...group,
    participants: memberships.map(({ user, calendarEventId }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      url: user.image,
      eventId: calendarEventId,
    })),
  }));
}
