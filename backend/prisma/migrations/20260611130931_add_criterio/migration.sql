-- CreateTable
CREATE TABLE "Criterio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "peso" INTEGER NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL,
    "atributo" TEXT NOT NULL,
    "direcao" TEXT NOT NULL DEFAULT 'desc',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "padrao" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id")
);
