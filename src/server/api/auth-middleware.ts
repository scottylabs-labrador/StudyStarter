import { createMiddleware } from "hono/factory";

import { auth } from "~/lib/auth";

type ApiEnvironment = {
  Variables: {
    userId: string;
  };
};

export const requireSession = createMiddleware<ApiEnvironment>(
  async (context, next) => {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    if (!session) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    context.set("userId", session.user.id);
    await next();
  },
);
