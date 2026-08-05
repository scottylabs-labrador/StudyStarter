import { api } from "~/server/api/app";

export const dynamic = "force-dynamic";

function handler(request: Request) {
  return api.fetch(request);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
