ALTER TABLE "Block" DROP CONSTRAINT "Block_blockedId_fkey";

ALTER TABLE "Block" ADD CONSTRAINT "Block_blockedId_fkey"
  FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION prevent_self_block()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "User"
    WHERE "id" = NEW."blockerId"
      AND "email" = NEW."blockedEmail"
  ) THEN
    RAISE EXCEPTION 'Users cannot block themselves';
  END IF;

  IF NEW."blockedId" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "User"
    WHERE "id" = NEW."blockedId"
      AND "email" = NEW."blockedEmail"
  ) THEN
    RAISE EXCEPTION 'Blocked user does not match blocked email';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "Block_validate_identity"
BEFORE INSERT OR UPDATE OF "blockerId", "blockedId", "blockedEmail"
ON "Block"
FOR EACH ROW
EXECUTE FUNCTION prevent_self_block();
