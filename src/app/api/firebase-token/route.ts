import { NextResponse } from "next/server";

import { getServerSession } from "~/lib/auth";
import { getAdminAuth } from "~/lib/firebase-admin";

export async function POST() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customToken = await getAdminAuth().createCustomToken(
      session.user.id,
      {
        email: session.user.email,
        name: session.user.name,
      },
    );

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Failed to create Firebase custom token:", error);

    return NextResponse.json(
      { error: "Failed to create Firebase custom token" },
      { status: 500 },
    );
  }
}
