-- CreateTable
CREATE TABLE "Issue" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT,
    "cliente" TEXT,
    "produto" TEXT,
    "status" TEXT,
    "dataAbertura" TIMESTAMP(3),
    "roadmap" BOOLEAN NOT NULL DEFAULT false,
    "atendeMultiplos" BOOLEAN NOT NULL DEFAULT false,
    "valor" DOUBLE PRECISION,
    "curva" TEXT,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "aceite" TIMESTAMP(3),
    "faturamento" DOUBLE PRECISION,
    "tipo" TEXT,
    "curva" TEXT,
    "riscoChurn" BOOLEAN NOT NULL DEFAULT false,
    "projeto" BOOLEAN NOT NULL DEFAULT false,
    "qtdImpeditivas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depara" (
    "id" SERIAL NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "nomeClienteIssue" TEXT NOT NULL,

    CONSTRAINT "Depara_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_nome_key" ON "Client"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Depara_nomeCliente_nomeClienteIssue_key" ON "Depara"("nomeCliente", "nomeClienteIssue");
