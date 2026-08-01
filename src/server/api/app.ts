import { Hono } from "hono";

import { listGroups } from "~/server/api/groups";

export const api = new Hono().basePath("/api/v1");

api.get("/health", (context) =>
  context.json({
    status: "ok",
  }),
);

api.get("/groups", async (context) => {
  const courseCode = context.req.query("courseCode")?.trim();

  if (courseCode === "") {
    return context.json({ error: "courseCode cannot be empty" }, 400);
  }

  const groups = await listGroups(courseCode);
  return context.json({ groups });
});
