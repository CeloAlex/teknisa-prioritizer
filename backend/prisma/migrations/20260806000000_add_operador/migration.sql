-- CreateEnum
CREATE TYPE "PapelOperador" AS ENUM ('ADMIN', 'EDITOR', 'READONLY');

-- CreateTable
CREATE TABLE "Operador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "PapelOperador" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "deveTrocarSenha" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OperadorSegmentos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OperadorSegmentos_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operador_email_key" ON "Operador"("email");

-- CreateIndex
CREATE INDEX "_OperadorSegmentos_B_index" ON "_OperadorSegmentos"("B");

-- AddForeignKey
ALTER TABLE "_OperadorSegmentos" ADD CONSTRAINT "_OperadorSegmentos_A_fkey" FOREIGN KEY ("A") REFERENCES "Operador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperadorSegmentos" ADD CONSTRAINT "_OperadorSegmentos_B_fkey" FOREIGN KEY ("B") REFERENCES "Segmento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
