ALTER TABLE "Block" DROP CONSTRAINT "Block_blockedId_fkey";

ALTER TABLE "Block" ADD COLUMN "blockedEmail" CITEXT;

UPDATE "Block" AS block
SET "blockedEmail" = blocked.email
FROM "User" AS blocked
WHERE blocked.id = block."blockedId";

ALTER TABLE "Block" DROP CONSTRAINT "Block_pkey";
ALTER TABLE "Block" ALTER COLUMN "blockedEmail" SET NOT NULL;
ALTER TABLE "Block" ALTER COLUMN "blockedId" DROP NOT NULL;

ALTER TABLE "Block" ADD CONSTRAINT "Block_pkey" PRIMARY KEY ("blockerId", "blockedEmail");
ALTER TABLE "Block" ADD CONSTRAINT "Block_blockedId_fkey"
  FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Block_blockedEmail_idx" ON "Block"("blockedEmail");
