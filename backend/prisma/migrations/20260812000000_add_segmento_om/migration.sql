-- DataMigration: insere o segmento "OM"
INSERT INTO "Segmento" ("nome", "updatedAt")
VALUES ('OM', CURRENT_TIMESTAMP)
ON CONFLICT ("nome") DO NOTHING;
