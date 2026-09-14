-- AlterTable: substitui "sprint" (string unica) por "sprints" (historico cumulativo)
ALTER TABLE "Issue" ADD COLUMN "sprints" TEXT[] NOT NULL DEFAULT '{}';

-- Backfill: preserva o valor atual como primeiro item do historico
UPDATE "Issue" SET "sprints" = ARRAY["sprint"] WHERE "sprint" IS NOT NULL AND "sprint" <> '';

ALTER TABLE "Issue" DROP COLUMN "sprint";
