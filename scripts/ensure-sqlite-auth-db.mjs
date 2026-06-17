import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env" });
config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl?.startsWith("file:")) {
  console.error(
    [
      "Invalid DATABASE_URL for the current Prisma SQLite schema.",
      `Received: ${databaseUrl ?? "(missing)"}`,
      'Set Railway DATABASE_URL to a SQLite file URL, for example "file:./db.sqlite".',
    ].join("\n"),
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "Post_name_idx" ON "Post"("name")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token")`,
  `CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Account_providerId_accountId_key" ON "Account"("providerId", "accountId")`,
  `CREATE INDEX IF NOT EXISTS "Verification_identifier_idx" ON "Verification"("identifier")`,
];

try {
  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
  console.log("SQLite auth database is ready.");
} finally {
  await prisma.$disconnect();
}
