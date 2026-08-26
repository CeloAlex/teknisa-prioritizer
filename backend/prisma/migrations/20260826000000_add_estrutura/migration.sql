-- AlterTable
ALTER TABLE "Issue" ADD COLUMN "estrutura" TEXT;

-- CreateTable
CREATE TABLE "Estrutura" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "segmentoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estrutura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estrutura_nome_segmentoId_key" ON "Estrutura"("nome", "segmentoId");

-- AddForeignKey
ALTER TABLE "Estrutura" ADD CONSTRAINT "Estrutura_segmentoId_fkey" FOREIGN KEY ("segmentoId") REFERENCES "Segmento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
