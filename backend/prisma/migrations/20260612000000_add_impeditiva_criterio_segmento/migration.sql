-- AlterTable Issue: add impeditiva flag
ALTER TABLE "Issue" ADD COLUMN "impeditiva" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable Criterio: add segmentoId FK
ALTER TABLE "Criterio" ADD COLUMN "segmentoId" INTEGER;
ALTER TABLE "Criterio" ADD CONSTRAINT "Criterio_segmentoId_fkey" FOREIGN KEY ("segmentoId") REFERENCES "Segmento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable Segmento: drop ordem (removed from schema)
ALTER TABLE "Segmento" DROP COLUMN IF EXISTS "ordem";
