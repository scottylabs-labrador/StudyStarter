import { api } from "~/server/api/app";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return api.fetch(request);
}

export function POST(request: Request) {
  return api.fetch(request);
}

export function PUT(request: Request) {
  return api.fetch(request);
}

export function PATCH(request: Request) {
  return api.fetch(request);
}

export function DELETE(request: Request) {
  return api.fetch(request);
}
