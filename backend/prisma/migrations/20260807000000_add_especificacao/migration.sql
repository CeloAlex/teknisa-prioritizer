-- AlterTable
ALTER TABLE "Issue" ADD COLUMN "descricao" TEXT;

-- CreateTable
CREATE TABLE "Especificacao" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "contexto" TEXT,
    "requisitos" JSONB NOT NULL,
    "horasProgramacao" DOUBLE PRECISION NOT NULL,
    "horasTeste" DOUBLE PRECISION NOT NULL,
    "docx" BYTEA NOT NULL,
    "pdf" BYTEA NOT NULL,
    "geradoPorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Especificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EspecificacaoAnexo" (
    "id" SERIAL NOT NULL,
    "especificacaoId" INTEGER NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "dadosOriginais" BYTEA NOT NULL,
    "dadosEditados" BYTEA,

    CONSTRAINT "EspecificacaoAnexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroLLM" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "apiKey" TEXT NOT NULL,
    "modeloTexto" TEXT NOT NULL DEFAULT 'gpt-4o',
    "modeloImagem" TEXT NOT NULL DEFAULT 'gpt-image-1',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParametroLLM_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especificacao_issueId_key" ON "Especificacao"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroLLM_provider_key" ON "ParametroLLM"("provider");

-- AddForeignKey
ALTER TABLE "Especificacao" ADD CONSTRAINT "Especificacao_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Especificacao" ADD CONSTRAINT "Especificacao_geradoPorId_fkey" FOREIGN KEY ("geradoPorId") REFERENCES "Operador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspecificacaoAnexo" ADD CONSTRAINT "EspecificacaoAnexo_especificacaoId_fkey" FOREIGN KEY ("especificacaoId") REFERENCES "Especificacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
