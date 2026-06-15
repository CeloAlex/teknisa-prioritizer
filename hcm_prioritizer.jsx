
import { useState, useMemo } from "react";

const RAW = {"issues": [{"id": 608531, "n": "Divergência no Pré-Fechamento de IRRF - (Estagiários)", "cat": "Erro - prioridade alta", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Erro impeditivo/crítico, Demanda Interna Teknisa (Roadmap)"}, {"id": 608528, "n": "Divergência no Pré-Fechamento de IRRF", "cat": "Erro - prioridade alta", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-04-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Erro impeditivo/crítico, Demanda Interna Teknisa (Roadmap)"}, {"id": 614190, "n": "Relatorios de Folha - Espelho Provisão 13 e Provisão Fèrias", "cat": "Erro - prioridade alta", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2026-05-04", "rm": 0, "mc": 1, "val": 0.0, "curva": "A", "ob": "Erro impeditivo/crítico"}, {"id": 614113, "n": "Divergência na Base de IRRF – Relatório de Pré-Fechamento", "cat": "Erro - prioridade alta", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-04", "rm": 0, "mc": 1, "val": 0.0, "curva": "D", "ob": "Erro impeditivo/crítico"}, {"id": 605242, "n": "ERRO ROTINA PROVISÃO DE FÉRIAS.", "cat": "Erro - prioridade alta", "cl": "Masan", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-03-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Erro impeditivo/crítico"}, {"id": 611697, "n": "ERRO NO CÁLCULO DE RESCISÃO DE JOVEM APRENDIZ.", "cat": "Erro - prioridade alta", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-17", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Erro impeditivo/crítico"}, {"id": 616577, "n": "Erro no lançamento de atestado", "cat": "Erro - prioridade alta", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Erro impeditivo/crítico"}, {"id": 616413, "n": "Operador não encontrado", "cat": "Erro - prioridade alta", "cl": "SOLUCOES", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Erro impeditivo/crítico"}, {"id": 616777, "n": "AJUSTE NO BOTÃO DE EXCLUSÃO DE DOCUMENTOS NO PORTAL DO GESTO", "cat": "Erro - prioridade alta", "cl": "Masan", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-05-15", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Erro impeditivo/crítico"}, {"id": 606781, "n": "ERRO DE RELATORIO TEKNISA - RECIBO DE PAGAMENTO DE PENSAO.", "cat": "Erro - prioridade alta", "cl": "Masan", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Erro impeditivo/crítico"}, {"id": 595511, "n": "Ajuste - Alertas do Sistema - HCMServices", "cat": "Sugestão de melhoria", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 1, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 133 dias"}, {"id": 601448, "n": "Inclusão de uma coluna com o Valor Pago de Férias e 13º na provisão", "cat": "Implementação - Customização", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-02-26", "rm": 1, "mc": 1, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 102 dias, Roadmap/Inovação"}, {"id": 546329, "n": "PIX Folha", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-05-02", "rm": 0, "mc": 0, "val": 21120.0, "curva": "S", "ob": "SLA: Curva S parada há 402 dias, Risco iminente de churn (Curva S)"}, {"id": 548461, "n": "Melhoria do Portal Gestor", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa Portal do Funcionário", "st": "Não iniciada", "dt": "2025-05-14", "rm": 0, "mc": 0, "val": 2420.0, "curva": "S", "ob": "SLA: Curva S parada há 390 dias, Risco iminente de churn (Curva S)"}, {"id": 493732, "n": "Geração automática do cálculo de contabilização", "cat": "Implementação - Customização", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2024-07-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 678 dias"}, {"id": 527664, "n": "Controle de acesso no desligamento do colaborador", "cat": "Implementação - Customização", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-01-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 496 dias"}, {"id": 561353, "n": "Cálculo de Rescisão não considera adicional de periculosidade de 30% nos valores de 13º salário, férias e aviso prévio", "cat": "Erro - prioridade baixa", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-07-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 322 dias"}, {"id": 562507, "n": "Relatório \"Demonstrativo de INSS Sistema x INSS eSocial\" não reconhece corretamente colaboradores com múltiplos vínculos ativos", "cat": "Erro - prioridade baixa", "cl": "SABOR & ART (Mais Sabor)", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-07-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 318 dias"}, {"id": 590377, "n": "Férias Coletivas – Gozo Parcial Indevido e Período Aquisitivo (Unidade Recife)", "cat": "Erro - prioridade baixa", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-12-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 166 dias, Risco iminente de churn (Curva S)"}, {"id": 593329, "n": "Solicitação de Trava Sistêmica - HCM", "cat": "Implementação - Customização", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-01-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 145 dias"}, {"id": 596135, "n": "3861304 - INTEGRAÇÃO - UNICO VS HCM", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-01-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 130 dias, Risco iminente de churn (Curva S)"}, {"id": 598756, "n": "SOLICITAÇÃO DE AUMENTO DE VAGA (DESISTENCIA DA VAGA)", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-02-11", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 117 dias, Risco iminente de churn (Curva S)"}, {"id": 551200, "n": "FGTS  (ISSUE 3103762)", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-05-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 376 dias, Risco iminente de churn (Curva S)"}, {"id": 602845, "n": "Sum base de IRRF e INSS em caso de duas férias dentro do mes", "cat": "Erro - prioridade baixa", "cl": "COMERCIAL MILANO BRASIL LTDA", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-03-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "SLA: Curva S parada há 96 dias, Risco iminente de churn (Curva S), Issue impeditiva em projeto (Curva S)"}, {"id": 579834, "n": "Relatório Fotográfico", "cat": "Implementação - Customização", "cl": "SUNNY ALIMENTACAO E SERVICOS", "prod": "Teknisa HCM", "st": "Testado", "dt": "2025-10-24", "rm": 0, "mc": 1, "val": 10560.0, "curva": "A", "ob": "SLA: Curva A parada há 227 dias"}, {"id": 595355, "n": "Consolidação das informações de esocial", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 1, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 601038, "n": "Incluir coluna QUITAÇÃO de Banco no Relatório Saldo de Banco de Horas", "cat": "Sugestão de melhoria", "cl": "AME GASTRONOMIA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-25", "rm": 0, "mc": 1, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 103 dias"}, {"id": 588093, "n": "01 - RH Cnab BTG Pactual", "cat": "Implementação - Customização", "cl": "NUTRIBEM", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-12-10", "rm": 0, "mc": 0, "val": 5280.0, "curva": "A", "ob": "SLA: Curva A parada há 180 dias"}, {"id": 582378, "n": "Relatórios de Médias - Férias / Férias Rescisão / 13º Rescisão / Aviso Indenizado", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-11-07", "rm": 0, "mc": 0, "val": 3300.0, "curva": "A", "ob": "SLA: Curva A parada há 213 dias"}, {"id": 543431, "n": "Ajuste no relatório demonstrativo inss x esocial, e o pre fechamento da dctfweb !", "cat": "Evolução", "cl": "FUNDACAO AFFEMG DE ASSISTENCIA E SAUDE - FUNDAFFE", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-04-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 418 dias"}, {"id": 546383, "n": "Ausência de inserção de informações e alterações em lote", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-05-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 402 dias"}, {"id": 560260, "n": "Relatórios Folha Mensal - Recibo de Pagamento a Autônomo RPA", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-07-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 327 dias"}, {"id": 569453, "n": "Incidências IRRF eSocial", "cat": "Legislação", "cl": "AME GASTRONOMIA", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-09-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 279 dias"}, {"id": 576158, "n": "Alteração da Ocupação via Template", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-10-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 248 dias"}, {"id": 586453, "n": "Layout para exportação de arquivo contábil para MV SOUL", "cat": "Implementação - Customização", "cl": "HOSPITAL SANTA JULIANA", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-12-01", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 189 dias, Issue impeditiva em projeto (Curva A)"}, {"id": 589494, "n": "E-Social - Envio de informações sobre coparticipação por CPF", "cat": "Legislação", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-12-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 171 dias"}, {"id": 592988, "n": "Criação de tipo de solicitação para aprovação da folha e integração financeira HCM", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2026-01-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 146 dias"}, {"id": 593756, "n": "Bloqueio em inclusão de motivo de afastamento na competência atual", "cat": "Erro - prioridade baixa", "cl": "P.S. - S.A.", "prod": "Teknisa HCM", "st": "Testado", "dt": "2026-01-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 143 dias"}, {"id": 594694, "n": "Rescisão com estabilidade por acidente de trabalho", "cat": "Implementação - Customização", "cl": "P.S. - S.A.", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-01-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 139 dias"}, {"id": 595371, "n": "Aumentar a Flexibilidade e a Parametrização para o Usuário Avançado", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595364, "n": "Validação das incidências dos eventos", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595363, "n": "Mapeamento dos campos para ajuste de erros do e social", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595362, "n": "Processo trabalhista", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595361, "n": "Gravação da e disponibilização da memória de cálculo a qualquer tempo", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595360, "n": "Emissão de guia e consulta de saldo de FGTS via API", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595359, "n": "E-Consignado", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595358, "n": "Contabilização", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 595353, "n": "Automatização da geração de eventos e rotinas", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 133 dias"}, {"id": 596459, "n": "Pedimos, por gentileza, que avaliem a especificação anexa e, caso surjam dúvidas ou pontos adicionais para discussão, ficamos à disposição para novos alinhamentos.", "cat": "Sugestão de melhoria", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 129 dias"}, {"id": 597366, "n": "Provisão de férias", "cat": "Erro - prioridade baixa", "cl": "FUNDACAO AFFEMG DE ASSISTENCIA E SAUDE - FUNDAFFE", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-02-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 125 dias"}, {"id": 601028, "n": "Alterar comportamento do Valor de Referencia", "cat": "Sugestão de melhoria", "cl": "AME GASTRONOMIA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 103 dias"}, {"id": 560308, "n": "Relatórios Folha Mensal - Hora Homem Trabalhada", "cat": "Evolução", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-07-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 327 dias"}, {"id": 586954, "n": "Recibo de férias / Data de retorno", "cat": "Implementação - Customização", "cl": "ELASA", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-12-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "SLA: Curva A parada há 186 dias"}, {"id": 476352, "n": "Integração com sistema SOC de saúde ocupacional", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2024-04-11", "rm": 0, "mc": 1, "val": 21120.0, "curva": "B", "ob": "SLA: Curva B parada há 788 dias"}, {"id": 524163, "n": "Visualização de Foto em Tela", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-01-09", "rm": 0, "mc": 1, "val": 9240.0, "curva": "B", "ob": "SLA: Curva B parada há 515 dias"}, {"id": 557340, "n": "Banco de horas - CBRP - Paramentrização por funcionário", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa Portal do Funcionário", "st": "Aguardando planejamento", "dt": "2025-06-30", "rm": 0, "mc": 1, "val": 8000.0, "curva": "B", "ob": "SLA: Curva B parada há 343 dias, Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 555104, "n": "Assinaturas Digitais - Holerites, Férias, Folha Mensal etc.", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-06-17", "rm": 1, "mc": 1, "val": 6800.0, "curva": "B", "ob": "SLA: Curva B parada há 356 dias, Risco iminente de churn (Curva B), Roadmap/Inovação, Issue impeditiva em projeto (Curva B)"}, {"id": 583403, "n": "Otimizar saída almoço", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa Portal do Funcionário", "st": "Aceite", "dt": "2025-11-11", "rm": 0, "mc": 1, "val": 2200.0, "curva": "B", "ob": "SLA: Curva B parada há 209 dias"}, {"id": 569915, "n": "Incluir opção de seleção no filtro de estrutura no relatório de Provisão de Férias e 13º Salário", "cat": "Implementação - Customização", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-09-03", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 278 dias, Risco iminente de churn (Curva B)"}, {"id": 580418, "n": "Análise preditiva: Ferramentas baseadas em IA para necessidades de treinamento,", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-10-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 224 dias, Roadmap/Inovação"}, {"id": 488756, "n": "Integração com sistema Questor de folha de pagamento", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2024-06-27", "rm": 0, "mc": 0, "val": 21120.0, "curva": "B", "ob": "SLA: Curva B parada há 711 dias"}, {"id": 541749, "n": "Desenvolvimento de Holerite Eletrônico", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-04-09", "rm": 0, "mc": 0, "val": 21120.0, "curva": "B", "ob": "SLA: Curva B parada há 425 dias"}, {"id": 590092, "n": "Assinatura de documento por biometria", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-12-23", "rm": 1, "mc": 0, "val": 21120.0, "curva": "B", "ob": "SLA: Curva B parada há 167 dias, Roadmap/Inovação"}, {"id": 563036, "n": "Espelhamento Tabela cadastro de colaboradores", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-07-29", "rm": 0, "mc": 0, "val": 8800.0, "curva": "B", "ob": "SLA: Curva B parada há 314 dias, Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 546214, "n": "Separação da hora extra noturna de feriado da hora extra", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-05-01", "rm": 0, "mc": 0, "val": 6160.0, "curva": "B", "ob": "SLA: Curva B parada há 403 dias"}, {"id": 573873, "n": "Rateio de Gorjeta", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-09-24", "rm": 0, "mc": 0, "val": 6160.0, "curva": "B", "ob": "SLA: Curva B parada há 257 dias, Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 509978, "n": "RATEIO DE GORJETAS", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2024-10-25", "rm": 0, "mc": 0, "val": 4400.0, "curva": "B", "ob": "SLA: Curva B parada há 591 dias, Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 586452, "n": "Layout para compra de VT com a operadora VALESUL", "cat": "Implementação - Customização", "cl": "MORADA BLINDADA", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2025-12-01", "rm": 0, "mc": 0, "val": 4180.0, "curva": "B", "ob": "SLA: Curva B parada há 189 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 578547, "n": "Dias de contrato - cálculo pela data fim", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-10-15", "rm": 0, "mc": 0, "val": 2200.0, "curva": "B", "ob": "SLA: Curva B parada há 236 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 451894, "n": "Disponibilizar Aplicativo Portal do Funcionário em IOS", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2023-11-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 947 dias"}, {"id": 464503, "n": "[HCM] Esocial - Melhorias no envio de periódicos", "cat": "Evolução", "cl": "TEKNISA", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2024-01-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 866 dias"}, {"id": 488334, "n": "Kit de admissão", "cat": "Evolução", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2024-06-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 712 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 500448, "n": "implementação - Separação do Portal do HCM", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Não iniciada", "dt": "2024-09-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 641 dias"}, {"id": 502341, "n": "Inclusão da emissão da Ordem de Serviços pelo HCM", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2024-09-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 630 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 503994, "n": "Rescisão complementar", "cat": "Evolução", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2024-09-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 622 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 503986, "n": "Correção do relatório de provisão", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2024-09-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 622 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 519428, "n": "Criação de Modelo - LTCAT", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2024-12-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 542 dias"}, {"id": 526991, "n": "MELHORIA TELA PROVISAO MENSAL", "cat": "Evolução", "cl": "Grupo Noz - MAMMA JAMMA - G. NOZ", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-01-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 501 dias"}, {"id": 528115, "n": "Implementação do Relatório de Absenteísmo - Manual", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-01-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 494 dias"}, {"id": 531459, "n": "Disponibilizar \"Acompanhamento - Apurações de Ponto no Período\" no Portal do Gestor", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2025-02-17", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 476 dias"}, {"id": 536381, "n": "[HCM] - Criação de uma rotina de importação de documentos no Portal do Gestor", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-03-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 449 dias"}, {"id": 537466, "n": "Portal do Gestor - Solicitação Envio do Termo da Experiência", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Especificação", "dt": "2025-03-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 446 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 542590, "n": "Relatórios do controle de frequência Demonstrativos.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-04-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 420 dias"}, {"id": 543338, "n": "Portal do funcionário - inclusão de pedido de plano de saúde", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Aceite", "dt": "2025-04-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 418 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 543335, "n": "Portal do funcionário - inclusão de dependente", "cat": "Evolução", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Não iniciada", "dt": "2025-04-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 418 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 543800, "n": "Criar Relatórios para Conferência - Esocial", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2025-04-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 416 dias"}, {"id": 545286, "n": "eSocial BX - Download de Arquivos", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-04-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 406 dias"}, {"id": 547825, "n": "[HCM] - Gestão Orçamentário - HCM", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-05-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 392 dias"}, {"id": 550122, "n": "IMPLEMENTAÇÃO DE EVENTOS DE FERIADO PARA ESCALA DIARISTA.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Testado", "dt": "2025-05-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 381 dias"}, {"id": 550354, "n": "Criação de Período de Apuração por Estrutura Legal .", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-05-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 378 dias"}, {"id": 551408, "n": "Solicitação Fechamento de Período do Ponto Semanal", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa Portal do Funcionário", "st": "Não iniciada", "dt": "2025-05-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 375 dias, Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 553123, "n": "RELATORIO DE IMPORTAÇÃO DE CADASTRO  RIOCARD.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-06-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 367 dias"}, {"id": 554910, "n": "HCM - Desconto integral do benefício em casos de cancelamento posterior a rescisão", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-06-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 357 dias"}, {"id": 554909, "n": "HCM - Campo de fim de carência para beneficios", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-06-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 357 dias"}, {"id": 554908, "n": "HCM - Data de início de desconto do benefício", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-06-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 357 dias"}, {"id": 558879, "n": "IMPORTAÇÃO DE PLANILHA DE ADMISSÃO MESMO COM PRELIMINAR.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-07-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 335 dias"}, {"id": 558827, "n": "Melhoria | Impressão | CAT | Modelo eSocial", "cat": "Implementação - Customização", "cl": "NUTRI HOUSE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-07-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 335 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 560773, "n": "Adequação do modelo de CAT conforme eSocial e solicitação do cliente", "cat": "Legislação", "cl": "NUTRI HOUSE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-07-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 325 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 561569, "n": "Solicitação de advertência - obrigatório observação", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Aguardando planejamento", "dt": "2025-07-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 321 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 562775, "n": "Desconto integral de evento lançado (parcelado) na rescisão", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-07-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 315 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 564283, "n": "Incluir no layout de seleção de estruturas coluna CNPJ CNAB", "cat": "Implementação - Customização", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-08-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 308 dias, Risco iminente de churn (Curva B)"}, {"id": 566888, "n": "ADICIONAL DE FUNÇÃO.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2025-08-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 293 dias"}, {"id": 567952, "n": "Inconsistência no cálculo do adicional noturno quando marcações são iguais ao horário da escala", "cat": "Erro - prioridade baixa", "cl": "NUTRI ART", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-08-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 286 dias"}, {"id": 569723, "n": "Alerta na Emissão de Pedido de Demissão", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-09-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 279 dias"}, {"id": 569713, "n": "MP - Bloqueios na Solicitação de Desligamento em Caso de Reprovação", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa Portal do Gestor", "st": "Em andamento", "dt": "2025-09-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 279 dias"}, {"id": 569709, "n": "Alerta e Bloqueios na Emissão de Avisos Prévios", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-09-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 279 dias"}, {"id": 572997, "n": "[PG] - Log de retrocesso da apuração e da propria apuração.", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Não iniciada", "dt": "2025-09-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 263 dias"}, {"id": 576040, "n": "[HCM] Validação do empréstimo consignado no eSocial", "cat": "Legislação", "cl": "TEKNISA", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-10-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 249 dias"}, {"id": 578840, "n": "Incluir médias das provisões no relatório que não demonstra os vínculos", "cat": "Implementação - Customização", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-10-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 235 dias, Risco iminente de churn (Curva B)"}, {"id": 579036, "n": "ORG. 1095 - Arquivo Unificado - Resumo Contábil", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Em teste", "dt": "2025-10-17", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 234 dias, Risco iminente de churn (Curva B)"}, {"id": 581278, "n": "Adequação | PPP - Perfil Profissiográfico Previdenciário", "cat": "Legislação", "cl": "NUTRI HOUSE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-10-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 221 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 581766, "n": "Tolerância de horários", "cat": "Erro - prioridade baixa", "cl": "FRITAS E CIA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-11-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 217 dias"}, {"id": 581883, "n": "Divergência de modalidade salarial – colaboradora 34971.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-11-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 216 dias"}, {"id": 581850, "n": "Inconsistência na utilização do campo Horário/Jornada Diária (Gerencial) na geração de relatórios de ponto", "cat": "Implementação - Customização", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-11-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 216 dias, Risco iminente de churn (Curva B)"}, {"id": 582777, "n": "01/11/2025", "cat": "Implementação - Customização", "cl": "Essencial", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-11-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 210 dias"}, {"id": 583486, "n": "Portal Gestor/Lançamentos de Folha - Sobreposição de Eventos", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2025-11-11", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 209 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 583404, "n": "Ajuste no campo de estrutura legal", "cat": "Evolução", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2025-11-11", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 209 dias"}, {"id": 583679, "n": "01/11/2025", "cat": "Implementação - Customização", "cl": "Essencial", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-11-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 208 dias"}, {"id": 585647, "n": "Projeção do aviso prévio – cálculo da Dt. Rescisão Projetada - ORG 1522", "cat": "Legislação", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-11-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 194 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 585855, "n": "Criar um Kit de Faturamento Mensal (relatórios) para ser disponibilizado aos tomadores de serviço", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-11-27", "rm": 1, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 193 dias, Roadmap/Inovação"}, {"id": 585854, "n": "Implementar de parametrização automática de Insalubridade/Periculosidade (complementação de salário).", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-11-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 193 dias"}, {"id": 589153, "n": "Rescisão com cálculo indevido de avos e 13º salário", "cat": "Erro - prioridade baixa", "cl": "NUTRISAUDE NSGROUP", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-12-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 172 dias"}, {"id": 589134, "n": "DUPLICIDADE NA IMPORTAÇAO DE SITUAÇAO FUNCIONAL.", "cat": "Erro - prioridade baixa", "cl": "Masan", "prod": "Teknisa HCM", "st": "Testado", "dt": "2025-12-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 172 dias"}, {"id": 589497, "n": "Ajuste de CNO", "cat": "Erro - prioridade baixa", "cl": "LALLEGRO RESTAURANTE", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-12-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 171 dias"}, {"id": 590881, "n": "Portal do Gestor - Lançamento de VT", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Aceite", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590877, "n": "CCT / Benefício - Não associados", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590871, "n": "Processo Férias - Tela Programação", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590857, "n": "Portal do Gestor - Visulização Resumo movimento", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590988, "n": "Layout para compra de VT com a operadora SINETRAN", "cat": "Implementação - Customização", "cl": "CONDE DO PAO", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-12-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 160 dias"}, {"id": 591128, "n": "Geração indevida de eventos de 13º em rescisão por Justa Causa após pagamento do 13º", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-12-31", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 159 dias, Risco iminente de churn (Curva B)"}, {"id": 592020, "n": "Erro na geração de eventos 2200 para vínculos com transferências entre estruturas com o mesmo CNPJ raiz", "cat": "Erro - prioridade baixa", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 153 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 497878, "n": "BENEFÍCIO DIÁRIO - Exportar Lote", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Testado", "dt": "2024-08-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 655 dias"}, {"id": 514808, "n": "OPERADORA SETRANSOL - Layout", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2024-11-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 565 dias"}, {"id": 514807, "n": "OPERADORA JAE - Layout", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2024-11-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 565 dias"}, {"id": 527946, "n": "DIFERENÇA FÉRIAS", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2025-01-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 495 dias"}, {"id": 533510, "n": "RELATÓRIO TOTALIZADOR FOLHA COM ERRO.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-02-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 466 dias"}, {"id": 538717, "n": "Aprimoramento do controle de acesso do PG", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa Portal do Funcionário", "st": "Aceite", "dt": "2025-03-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 439 dias"}, {"id": 541750, "n": "Exportação de Relatórios de Controle de Frequência Assinados", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-04-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 424 dias"}, {"id": 549537, "n": "Criar Relatório de Assinaturas - PG", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2025-05-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 384 dias"}, {"id": 554954, "n": "HCM - Separar valores de INSS e FGTS sobre férias e 13º pagos", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-06-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "SLA: Curva B parada há 357 dias"}, {"id": 561965, "n": "RELATÓRIO ESPELHO PROVISÃO FÉRIAS E 13º.", "cat": "Evolução", "cl": "Masan", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-07-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 320 dias"}, {"id": 564324, "n": "Formulário de Solicitação de Abono de Férias.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2025-08-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 307 dias"}, {"id": 564775, "n": "Esocial - Inclusão e Exclusão do evento S 2206 (Automático)", "cat": "Evolução", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2025-08-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 306 dias"}, {"id": 565507, "n": "ACRESCENTAR SITUAÇÃO FUNCIONAL REL TURNOVER", "cat": "Evolução", "cl": "Masan", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2025-08-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 300 dias"}, {"id": 569801, "n": "Divergência na funcionalidade de inclusão de horas extras como banco de horas no Portal Gestor", "cat": "Erro - prioridade média", "cl": "Masan", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-09-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 278 dias"}, {"id": 572820, "n": "CPF do Operador no Relatórios de Férias e Folha de Pagamento", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2025-09-17", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 264 dias"}, {"id": 590268, "n": "Pagamento de feriado trabalhado gerando apenas horas extras", "cat": "Erro - prioridade baixa", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2025-12-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 167 dias"}, {"id": 590448, "n": "Divergência na visualização do período aquisitivo de férias no Portal do Gestor", "cat": "Erro - prioridade baixa", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2025-12-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 166 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590878, "n": "Portal do Funcionário - Comunicados / Dashboard inicial", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590874, "n": "Processo Vale Transporte - Ajustes", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590872, "n": "Processo Rescisão - Cancelamento de cálculos", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590866, "n": "Processo de Admissão - Consulta automática CPF", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590859, "n": "eConsignado - Relatórios para conferência de folha", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 590858, "n": "Portal do Gestor - Validação Folha de Pagamento", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2025-12-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 161 dias, Issue impeditiva em projeto (Curva B)"}, {"id": 591079, "n": "Situação Funcional de Afastamento - 582887", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2025-12-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "SLA: Curva B parada há 160 dias, Risco iminente de churn (Curva B)"}, {"id": 611728, "n": "Importação de ponto em rescisão (Ticket 618072)", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-17", "rm": 0, "mc": 1, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 605091, "n": "INSERIR OPÇÃO DE SELECIONAR ESTRUTURA LEGAL AO GERAR CNAB", "cat": "Sugestão de melhoria", "cl": "COMERCIAL MILANO BRASIL LTDA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-17", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S), Issue impeditiva em projeto (Curva S)"}, {"id": 606211, "n": "Inclusão de um campo para dias de corte na tela de CCT", "cat": "Legislação", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 606415, "n": "Customização Tela de Aprovação de Admissão", "cat": "Implementação - Customização", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-03-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 607209, "n": "INSERIR OPÇÃO DE SELECIONAR ESTRUTURA LEGAL AO GERAR CNAB", "cat": "Implementação - Customização", "cl": "COMERCIAL MILANO BRASIL LTDA", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-03-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S), Issue impeditiva em projeto (Curva S)"}, {"id": 607484, "n": "Benefícios inativos aparecendo para cálculo -  ticket Nº 606691", "cat": "Evolução", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 607482, "n": "ADMISSÃO COMPLETA", "cat": "Sugestão de melhoria", "cl": "RC NUTRY", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-03-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 616228, "n": "Ticket 622608 – Envio indevido de comunicados de tempo de casa para colaboradores recém-admitidos", "cat": "Erro - prioridade baixa", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-05-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 617306, "n": "INTERRUPÇÃO DE FÉRIAS POR LICENÇA MATERNIDADE", "cat": "Sugestão de melhoria", "cl": "COMERCIAL MILANO BRASIL LTDA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S), Issue impeditiva em projeto (Curva S)"}, {"id": 617542, "n": "Atualização do App Portal Funcionário", "cat": "Sugestão de melhoria", "cl": "RC NUTRY", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-05-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 619443, "n": "Portal do Funcionário/App – Alterações na aba “Meus Dados” não estão sendo salvas corretamente - Ticket  622621", "cat": "Erro - prioridade baixa", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-05-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 620524, "n": "Inserir opção de lote de vínculos dentre as opções de filtro, para o cadastro automático de evento relacionado por vinculo", "cat": "Sugestão de melhoria", "cl": "COMERCIAL MILANO BRASIL LTDA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-06-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S), Issue impeditiva em projeto (Curva S)"}, {"id": 620520, "n": "INSERIR FILTRO MULTIPLO PARA ESTRUTURA LEGAL - TELA ITENS DE MOV DO BENEFÍCIO", "cat": "Sugestão de melhoria", "cl": "COMERCIAL MILANO BRASIL LTDA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-06-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S), Issue impeditiva em projeto (Curva S)"}, {"id": 605994, "n": "Manutenção de Movimentação - Mensagem ORA - 00001", "cat": "Erro - prioridade baixa", "cl": "RC NUTRY", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-03-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Risco iminente de churn (Curva S)"}, {"id": 607146, "n": "Identificação de inserção manual no espelho de ponto", "cat": "Evolução", "cl": "GASTROSERVICE", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-03-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Risco iminente de churn (Curva A), Issue impeditiva em projeto (Curva A)"}, {"id": 608873, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-04-06", "rm": 1, "mc": 1, "val": 21120.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Roadmap/Inovação, Issue impeditiva em projeto (Curva B)"}, {"id": 606543, "n": "Exportação de Vale/Benefício - VT e VC", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-25", "rm": 0, "mc": 0, "val": 10560.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 614481, "n": "Rateio de gorjetas – contratos intermitentes", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-05-06", "rm": 0, "mc": 0, "val": 6160.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 592927, "n": "Diferença no Pré-Fechamento DCTFWeb/FGTS em competência com 13º salário", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 593307, "n": "Divergência na Base de INSS do 13º Salário por aplicação duplicada de regra", "cat": "Erro - prioridade baixa", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 595460, "n": "CRIAÇÃO DE LAYOUT DE IMPORTAÇÃO BENEFICIO SWILE", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 598592, "n": "Retificação automática não processa todos os eventos S-1200 via lote", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-02-11", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 603857, "n": "Análise na rotina do sistema.", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-03-11", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 604373, "n": "Relatórios de INSS e Pré-Fechamento indicam diferença em cenário de rescisão e recontratação na mesma competência", "cat": "Erro - prioridade baixa", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-03-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 606209, "n": "Padronização do uso de certificado digital", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-03-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 606581, "n": "Relatório Provisão - Provissão de Férias", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-03-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 606569, "n": "575964_Relatório de Batidas Originais do Ponto", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 607239, "n": "Inconsistência na apuração de ponto ao alterar situação de frequência com ocorrência de atraso", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-03-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 607767, "n": "Relatório de Batidas Originais do Ponto Eletrônico", "cat": "Implementação - Customização", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-03-31", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 612425, "n": "Tela Cadastro de Consignado", "cat": "Sugestão de melhoria", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 613483, "n": "Mensagem inconsistente e exibição de stack trace na alteração salarial e ocupação – Evento S-2206 -  Ticket 620253", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2026-04-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 616803, "n": "Divergência na demonstração de valores entre Demonstrativo DIRF e Extrator DIRF (campo Rendimentos Tributáveis)", "cat": "Erro - prioridade baixa", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-15", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 617127, "n": "Relatório Customizável de Pensionista Considerando Dependentes de Salário Família", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 618080, "n": "Divergência no evento 1280 - Dedução de Base IRRF Simplificado no envio do S-1210", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-05-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 599344, "n": "Portal do Gestor – Cards de Atestados e Faltas Injustificadas não exibidos no painel - Ticket 595535", "cat": "Erro - prioridade baixa", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-02-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608914, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608913, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608911, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608910, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608894, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608890, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608889, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608888, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608879, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608878, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 608874, "n": "PAINEL DE CUSTO DE MAO DE OBRA DIARIO + SIMULADOR", "cat": "Sugestão de melhoria", "cl": "Pobre Juan - Holding", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B), Issue impeditiva em projeto (Curva B)"}, {"id": 613608, "n": "Sobrescrita indevida da data de cancelamento de benefícios já cancelados ao incluir informações de rescisão.", "cat": "Erro - prioridade baixa", "cl": "BAKED POTATO", "prod": "Teknisa HCM", "st": "Testado", "dt": "2026-04-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Risco iminente de churn (Curva B)"}, {"id": 596924, "n": "HCM Analytics - Conferência da Folha Mensal", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-02-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Roadmap/Inovação"}, {"id": 596840, "n": "Trilha de Conhecimento no Portal do Gestor e Portal do Funcionário", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-02-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Roadmap/Inovação"}, {"id": 597936, "n": "Apuração Automática do Ponto com Reapuração Retroativa ao Alterar Dia Já Apurado", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 607204, "n": "Liberação do registro de ponto por biometria facial no portal do funcionário", "cat": "Implementação - Customização", "cl": "AME GASTRONOMIA", "prod": "Teknisa Portal do Funcionário", "st": "Especificação", "dt": "2026-03-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "A", "ob": "Roadmap/Inovação"}, {"id": 608557, "n": "Divergência no Pré-fechamento de IRRF – Base Sistema x Base eSocial", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 608543, "n": "Divergência no Pré-Fechamento de IRRF, R$ 564,80 a Maior em Relação à Base do eSocial – (Estagiários)", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 609455, "n": "Relatório para conferência Alterações x Envios de eventos", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-08", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 609451, "n": "Não permitir enviar S-1200 sem o S-2200 ser  concluído.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-08", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 609441, "n": "Envio de Eventos após importação de planilha.", "cat": "Legislação", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-08", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 609439, "n": "E-Social - Envio de Eventos após aprovação de MP.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-08", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 611489, "n": "[ANÁLISE REDUÇÃO IRRF] LEI Nº 15.270, DE 26/11/2025", "cat": "Evolução", "cl": "GIGLIO SA", "prod": "Teknisa HCM", "st": "Testado", "dt": "2026-04-16", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 612279, "n": "Mensageria Esocial", "cat": "Implementação - Customização", "cl": "Massima Alimentacao", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-23", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 613114, "n": "Melhoria no formato de envio dos S-1010 para ter historico dentro do e-social.", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 613113, "n": "Tela Demonstrativo DIRF aba de funcionario por plano de saude", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 613104, "n": "Melhoria na forma de incidencia ser preenchida automatico de acordo com a natureza da rubrica", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612912, "n": "Melhoria no botão \"Continuar processamento\" da tela de Monitoramento Esocial", "cat": "Sugestão de melhoria", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612822, "n": "Melhoria na Consulta Automática de Eventos", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612766, "n": "Criar Tela de Auditoria de Parametrizações de Esocial (Eventos)", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612763, "n": "Criar Forma do Esocial Gerar Envio de Aterações cadastrais do mesmo Mês", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612761, "n": "Incluir Botão para Alterar em Massa a Operação do Envio do S-1010", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612673, "n": "Incluir Filtro de Lote de Vínculos na Aba \"Periódico\" da tela Esocial Simplificado", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 612665, "n": "[PF] - Alterar fluxo de Atestado", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-04-27", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 613572, "n": "Dependentes não Informados no Esocial (DIRF) - Agile.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2026-04-29", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 613549, "n": "Implementar a funcionalidade nas MPs- Quadro de Vagas.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2026-04-29", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 614284, "n": "Dashboard Customizável", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Especificação", "dt": "2026-05-05", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação, Issue impeditiva em projeto (Curva B)"}, {"id": 614907, "n": "Conferencia automatizada do e-social", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-05-07", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Roadmap/Inovação"}, {"id": 614821, "n": "semaforo do esocial e de prazos legais (envios pendentes x prazo legal)", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-05-07", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 614820, "n": "Relatorio de conferencia de incidencias do sistema x esocial", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-05-07", "rm": 1, "mc": 1, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 620294, "n": "ASSINATURA DIGITAL.", "cat": "Sugestão de melhoria", "cl": "Masan", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-06-02", "rm": 1, "mc": 1, "val": 0.0, "curva": "B", "ob": "Roadmap/Inovação"}, {"id": 577248, "n": "[HCM - Report] Pesquisa, Estudo e Integração do HCM com JasperReports", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-10-10", "rm": 1, "mc": 0, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 607201, "n": "Apuração de Ponto", "cat": "Implementação - Customização", "cl": "EMPREGO CERTO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-03-27", "rm": 1, "mc": 0, "val": 0.0, "curva": "C", "ob": "Roadmap/Inovação"}, {"id": 607024, "n": "[PG] - Ajustar relatório de Assinatura Digital", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-03-27", "rm": 1, "mc": 0, "val": 0.0, "curva": "D", "ob": "Demanda Interna Teknisa (Roadmap)"}, {"id": 611593, "n": "Atualização da NR-1 (Norma Regulamentadora nº 1), com exigências focadas em saúde mental", "cat": "Legislação", "cl": "HOSPITAL SANTA JULIANA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-17", "rm": 0, "mc": 1, "val": 0.0, "curva": "A", "ob": "Issue impeditiva em projeto (Curva A)"}, {"id": 593055, "n": "ALTERAÇÃO BLOQUEIO ABERTURA DE FÉRIAS", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Aceite", "dt": "2026-01-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 594813, "n": "KIT ADMISSÃO - Ajuste relatórios", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-01-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 595213, "n": "Envio de comunicado via HCM para o portal do gestor", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 595204, "n": "Inclusão dia da semana e escala na Solicitação de férias", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Especificação", "dt": "2026-01-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 595666, "n": "NR-7 | Programação de Exames", "cat": "Legislação", "cl": "NUTRI HOUSE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 595856, "n": "ERRO ENVIO S-1005 - ENCERRAMENTO CNPJ FILIAIS", "cat": "Erro - prioridade baixa", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 609566, "n": "Portal do Gestor - Inclusão de novo Processo - Auxílio Creche", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2026-04-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 609565, "n": "Portal do Gestor - Inclusão novo processo", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2026-04-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 609556, "n": "Portal do Gestor - Solicitação permite apenas 1 reprovação.", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-04-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 612948, "n": "HCM - Emissão de Relatório com observações vindas do portal", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 614642, "n": "Divergência nas Informações de Férias entre diferentes acessos ao Portal do Gestor e HCM", "cat": "Erro - prioridade baixa", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2026-05-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 616388, "n": "Notificação do Portal do Gestor exibindo e-mail pessoal ao invés do corporativo", "cat": "Erro - prioridade baixa", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-05-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 616339, "n": "PORTAL DO GESTOR - Informação Dashboard", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 616337, "n": "HCM - Relatório com informações das anotações do vínculo", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 618213, "n": "Portal do Gestor - Relatórios disponíveis", "cat": "Implementação - Customização", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 618203, "n": "Portal do Gestor - SIGILO DE CONTRATAÇÃO", "cat": "Evolução", "cl": "NUTRISAUDE", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 603474, "n": "Informe de rendimentos no app portal do funcionario", "cat": "Evolução", "cl": "NUTRI HOUSE", "prod": "Teknisa HCM", "st": "Testado", "dt": "2026-03-09", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Issue impeditiva em projeto (Curva B)"}, {"id": 608603, "n": "RELATORIOS PROVISOES", "cat": "Implementação - Customização", "cl": "SABOR & ART (Mais Sabor)", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-02", "rm": 0, "mc": 1, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 611518, "n": "Selecionar todas as unidades portal do gestor", "cat": "Sugestão de melhoria", "cl": "SOLUCOES", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-04-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 611592, "n": "Inserção de filtro", "cat": "Evolução", "cl": "SOLUCOES", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-04-17", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 613858, "n": "Mensagens de erro de cálculos anteriores sendo exibidas indevidamente em novos cálculos", "cat": "Evolução", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 617244, "n": "Solicitação de Desligamento", "cat": "Sugestão de melhoria", "cl": "SOLUCOES", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 617234, "n": "Criar um novo tipo de solicitação (Solicitação de Vagas)", "cat": "Sugestão de melhoria", "cl": "SOLUCOES", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 617217, "n": "Solicitação de Aumento de Quadro", "cat": "Implementação - Customização", "cl": "SOLUCOES", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 617208, "n": "Solicitação de Substituição", "cat": "Sugestão de melhoria", "cl": "SOLUCOES", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 617908, "n": "Filtro na tela do Relatório Custumisável de Movimentação,", "cat": "Implementação - Customização", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 618114, "n": "Erro na Rotina de Integração Contábil via Webservice (API)", "cat": "Evolução", "cl": "SABOR & ART (Mais Sabor)", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 619081, "n": "Lentidão e falha no filtro de vínculo na tela Não Periódico do eSocial Simplificado", "cat": "Erro - prioridade baixa", "cl": "SOLUCOES", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "S", "ob": "Ordenação por Curva"}, {"id": 618464, "n": "Relatorio de provisão de ferias e 13 ter a opção de selecionar mais de uma estrutura legal.", "cat": "Evolução", "cl": "NUTRIBEM", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-25", "rm": 0, "mc": 1, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 605403, "n": "Campo Situação Funcional na Tela VINCULO não atualiza", "cat": "Erro - prioridade baixa", "cl": "AME GASTRONOMIA", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-03-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 609151, "n": "Ponto Eletrônico", "cat": "Sugestão de melhoria", "cl": "NUTRIBEM", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-04-07", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 609677, "n": "Controle de Acesso > Portal Gestor > Perfil de Acesso > Relatórios (selecionar quais deixar visível e não todos)", "cat": "Implementação - Customização", "cl": "AME GASTRONOMIA", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2026-04-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 611527, "n": "Solicitação de verificação de lentidão no lançamento de ocorrências – Portal do Gestor", "cat": "Erro - prioridade baixa", "cl": "POBRE JUAN - MATRIZ", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 615723, "n": "Ajuste Cnab Sunny Food", "cat": "Dúvida", "cl": "SUNNY ALIMENTACAO E SERVICOS", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 620122, "n": "Busca por CPF na admissão de múltiplos vínculos buscando informações de pessoas inativas", "cat": "Erro - prioridade baixa", "cl": "POBRE JUAN - MATRIZ", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-06-01", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 608946, "n": "Ponto", "cat": "Sugestão de melhoria", "cl": "NUTRIBEM", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 608945, "n": "Ponto", "cat": "Sugestão de melhoria", "cl": "NUTRIBEM", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-04-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "A", "ob": "Ordenação por Curva"}, {"id": 595930, "n": "Pré-Fechamento DCTFWeb e FGTS – Divergências de exibição nos relatórios", "cat": "Erro - prioridade baixa", "cl": "Essencial", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-28", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 611226, "n": "[HCM] Correção cadastro automático incidências eSocial", "cat": "Erro - prioridade baixa", "cl": "TEKNISA", "prod": "Teknisa HCM", "st": "Aguardando cliente", "dt": "2026-04-15", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 611828, "n": "Otimizar saída almoço no HCM", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa Portal do Gestor", "st": "Especificação", "dt": "2026-04-18", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 613509, "n": "Relatório de custo de EPI por funcionário", "cat": "Sugestão de melhoria", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-28", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 613505, "n": "Inclusão de tabela de preço no cadastro de EPI", "cat": "Sugestão de melhoria", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-28", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 614154, "n": "Criação de Importação de Relacionamento de Estruturas via Planilha", "cat": "Implementação - Customização", "cl": "EFRAIM", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-05-04", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617998, "n": "Validação envio S-2206 de prorrogação de contrato de experiência", "cat": "Erro - prioridade baixa", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-22", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617989, "n": "Cálculo de Folha por Estrutura Superior", "cat": "Implementação - Customização", "cl": "EFRAIM", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2026-05-22", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617988, "n": "Criar Rotina de Importação de Pessoa", "cat": "Implementação - Customização", "cl": "EFRAIM", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-05-22", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 619850, "n": "CÁLCULO DE RESCISÃO SIMULADA.", "cat": "Sugestão de melhoria", "cl": "Masan", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-29", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 619839, "n": "Anexar  documentos alçada do RH portal Gestor", "cat": "Sugestão de melhoria", "cl": "D&P INVESTIMENTOS E PARTICIPACOES LTDA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-29", "rm": 0, "mc": 1, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 594070, "n": "Alerta de evento não utilizado em mês anterior", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597803, "n": "BANCO HORAS SITUAÇÃO FUNCIONAL X DEMONSTRATIVO EM DUPLIDADE.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 601041, "n": "EPT-003 - Verificar em todos os produtos e campos que podem fazer upload de arquivos", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 605691, "n": "INTEGRAÇÃO SISTEMA TANGERINO X TEKNISA", "cat": "Sugestão de melhoria", "cl": "CAPIM RESTAURANTE E EVENTOS - UNIDADE EVENTOS", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 605558, "n": "Bloquear Visualização de Solicitante no Portal do Gestor.", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa Portal do Gestor", "st": "Aguardando planejamento", "dt": "2026-03-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 606137, "n": "ALTERAR ROTINA COLUNA AJUSTE RELATÓRIO PROVISÃO FÉRIAS.", "cat": "Legislação", "cl": "Masan", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-03-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 606452, "n": "Parametrização do layout 240 Multipag", "cat": "Erro - prioridade baixa", "cl": "LALLEGRO RESTAURANTE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 607652, "n": "Aposentadoria Especial Cadastro Automático no Vínculo.", "cat": "Legislação", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2026-03-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 611088, "n": "[HCM] Dados inválidos admissão Gupy", "cat": "Evolução", "cl": "TEKNISA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-15", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 611351, "n": "Análise - Ocorrências de BD Encaminhada pela infraestrutura no dia 16/04/2026", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 612138, "n": "FÉRIAS EM RESCISÃO - PROGRAMADAS COM ERRO.", "cat": "Erro - prioridade baixa", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-04-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 612287, "n": "Cálculo de Folha por Estrutura Superior", "cat": "Implementação - Customização", "cl": "Massima Alimentacao", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-04-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 612284, "n": "Validações Sistêmicas no Cálculo de Férias", "cat": "Implementação - Customização", "cl": "Massima Alimentacao", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-23", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 613498, "n": "RELATÓRIOS DE ADMISSÃO - CLÁUSULA 6ª CONTRATO DE EXPERIÊNCIA", "cat": "Sugestão de melhoria", "cl": "NUTRISAUDE NSGROUP", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 613278, "n": "Permitir Cadastro de Conta Bancária para Outros Pagamentos.", "cat": "Legislação", "cl": "Masan", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 615147, "n": "Demonstração de INSS na folha quando há ferias", "cat": "Legislação", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 616133, "n": "Relatório Customizável de Movimentação - Coluna NREVENTOM saindo com o NMEVENTOH", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 616645, "n": "Atualização da tabela CID-11 no HCM - Ticket 626809", "cat": "Sugestão de melhoria", "cl": "GOSTINI FOOD SERVICE E VAREJO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 616557, "n": "Omitir salário do funcionário no PG", "cat": "Implementação - Customização", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617391, "n": "O Campo matricula e-Social não pode ser cadast. manualmente.", "cat": "Erro - prioridade média", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617312, "n": "Exportação de Excel com quantidades dos eventos alimentados por vínculo em linha única", "cat": "Implementação - Customização", "cl": "BACO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617612, "n": "ERRO STATUS CONTROLA FERIAS.", "cat": "Erro - prioridade baixa", "cl": "Masan", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617969, "n": "Falha no envio de holerites por Estrutura e Lista de Estrutura", "cat": "Erro - prioridade baixa", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Concluída", "dt": "2026-05-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617696, "n": "Divergência no cálculo de IRRF de férias compondo descontos em folha 07/2024", "cat": "Erro - prioridade baixa", "cl": "GIRAFFAS", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 618040, "n": "Envio indevido de múltiplos vínculos de sócios enviado no evento S- 1200 e inconsistência no S-2206 de Prorrogação de contrato de experiência.", "cat": "Erro - prioridade baixa", "cl": "DONA CONCEIÇÃO ADMINISTRAÇÃO", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 617987, "n": "Criar forma de Importar Pessoa no HCM", "cat": "Implementação - Customização", "cl": "EFRAIM", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 619402, "n": "Evento 450 - Trabalhador Autônomo não é gerado automaticamente no cálculo da folha", "cat": "Erro - prioridade baixa", "cl": "SANTA CASA DE MISERICORDIA DE GUAXUPE", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 619624, "n": "Inclusão flag PontoDigital no Rel. customizavel de admssão.", "cat": "Sugestão de melhoria", "cl": "Masan", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 619979, "n": "Termo de Sigilo e Confidencialidade (Trazendo nome da ORG)", "cat": "Erro - prioridade baixa", "cl": "Grupo Pulse - Spicy Fish", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 594077, "n": "Regra para líquido negativo de estagiário", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 598537, "n": "DATA DO RETORNO - ATESTADO MÉDICO (CAT)", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2026-02-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 603223, "n": "Cadastro  Controle de Acesso Por Estrutura-Segurança da Inf", "cat": "Implementação - Customização", "cl": "Masan", "prod": "Teknisa HCM", "st": "Aguardando planejamento", "dt": "2026-03-09", "rm": 0, "mc": 0, "val": 0.0, "curva": "B", "ob": "Ordenação por Curva"}, {"id": 539581, "n": "Relatório Resumo de IRRF", "cat": "Evolução", "cl": "Cozzi Restaurantes Industriais - Grupo Porto Fino", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-03-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 578856, "n": "Divergência de banco de horas", "cat": "Erro - prioridade baixa", "cl": "AMOR GELADO SORVETES", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-10-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 580485, "n": "MUlta de Transito", "cat": "Implementação - Customização", "cl": "EMPREGO CERTO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2025-10-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 598377, "n": "Solicitação de melhoria — Sistema HCM Pensionista", "cat": "Sugestão de melhoria", "cl": "EMPREGO CERTO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 604863, "n": "Utilização do campo Nome Social em relatórios e telas", "cat": "Implementação - Customização", "cl": "EMPREGO CERTO", "prod": "Teknisa HCM", "st": "Aceite", "dt": "2026-03-16", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 606989, "n": "Integração do HCM com a ferramenta de assinatura ZapSign", "cat": "Sugestão de melhoria", "cl": "EMPREGO CERTO", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-26", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 617295, "n": "Ativar Job de Apuração Automática do Ponto", "cat": "Evolução", "cl": "GRUPO LLINEA", "prod": "Teknisa Portal do Funcionário", "st": "Em andamento", "dt": "2026-05-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 610049, "n": "Inclusão dos dias de folga na aba espelho de ponto", "cat": "Evolução", "cl": "EMPREGO CERTO", "prod": "Teknisa HCM", "st": "Testado", "dt": "2026-04-09", "rm": 0, "mc": 0, "val": 0.0, "curva": "C", "ob": "Ordenação por Curva"}, {"id": 606673, "n": "Adicionar ao HOLERITE (Relatorio) do colaborador informações de ECONSIGNADO ( limite de desconto do econsignado)", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-03-25", "rm": 0, "mc": 1, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 612675, "n": "Demonstração de Incidência 79 nas Informações Complementares do Informe de Rendimentos", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-04-27", "rm": 0, "mc": 1, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 485547, "n": "[HCM] Melhorias Migração XML", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2024-06-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 486392, "n": "[HCM] Evolução: Construir selects necessários para configuração das estruturas HCM no Zmart", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2024-06-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 487286, "n": "[HCM] Log de acesso no Hcmservices", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2024-06-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 495830, "n": "Tela Alteração de Banco de Horas!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2024-08-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 500262, "n": "Parametrização de org 0 para situação funcional Prorrogação Licença Maternidade", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2024-09-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 503102, "n": "[HCM] Atualização automática FAP anual", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2024-09-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 526667, "n": "Inclusão de coletores de marcação!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-01-22", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 529482, "n": "Opção de escolher o tipo de vinculo que vai ter envio para o esocial", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-02-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 530771, "n": "Soluções - VT e Beneficio precisam de melhorar o retorno para o cliente quanto a quantidade de registros impactos nas ações.", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-02-13", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 544425, "n": "Opção de inserir o nr processo trabalhista para que ele seja enviado no S-2299", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-04-24", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 551172, "n": "Validação de Lançamento com Horario base!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-05-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 552757, "n": "Ter uma janela pop-up informando ao gestor colaboradores que vão sair de férias", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2025-06-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 554093, "n": "[HCM - Report] Incidência para Relação INSS e Resumo de Contabilização", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-06-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 559888, "n": "[HCM] Retorno tabela rubricas S-1200", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2025-07-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 565391, "n": "Cronometro tempo trabalhado", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Funcionário", "st": "Não iniciada", "dt": "2025-08-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 569143, "n": "Reconhecimento facial no Portal do Funcionário", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2025-09-01", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 575487, "n": "Rotina de Ocorrência!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2025-09-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 575400, "n": "Marcações de Ponto Originais !", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2025-09-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 576006, "n": "Movimentação de transferencia xApuração de ponto!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-10-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 576428, "n": "Ocorrências criadas automáticas!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-10-06", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 582044, "n": "Sugestão de Melhoria – Importação de Estrutura via Template", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-11-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 585483, "n": "Ajuste no layout \"4_Vinculo Leiaute V2\"", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2025-11-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 586187, "n": "Converter tela de Ocorrencia de frequencia para o portal do gestor", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Aguardando planejamento", "dt": "2025-11-28", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 589173, "n": "Customizavel de Férias - Implementar o filtro de Lote de Vinculos", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2025-12-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 592409, "n": "Rotina de calculo de complemento de 13 Salário!", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-08", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 594693, "n": "HCM - Ajustes identificados nos relatórios", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-01-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 595784, "n": "Jornada Diferenciada Quarta-feira de Cinzas", "cat": "Demanda de Atualização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-01-27", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 596365, "n": "Atualizar login do Portal do Funcionário para permitir MFA", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-01-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 596364, "n": "Atualizar login do Portal do Gestor para permitir MFA", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Não iniciada", "dt": "2026-01-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 596360, "n": "Atualizar login do HCM para permitir MFA", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-01-30", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597673, "n": "Rescisão Complementar – Ajuste de Eventos Recalculados Automaticamente", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-02-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597964, "n": "Tratamento Automático de Estabilidade no Vínculo e na Rescisão", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597951, "n": "Hora Extra Indevida para Jornada Diferenciada Quando  a Jornada Inicia Fora do Horário Base, Mas Cumpre Carga Diária", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597949, "n": "Desconto de Aviso Prévio Não é Aplicado em Caso de Não Cumprimento (Total ou Parcial) na Rescisão", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597941, "n": "Auditoria de Alterações: Log Completo por Usuário com IP e Histórico de Todas as Mudanças", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597937, "n": "13º salário Maternidade Não Considera a Prorrogação de 60 dias da Licença-Maternidade", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597935, "n": "Cálculo de Recesso de Estágio com Divergência de Avos", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597892, "n": "Necessidade de Calendário Parametrizável para Ponto facultativo e Recesso", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597886, "n": "Ausência de Calendário Parametrizável para Dias de Meio Expediente", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 597869, "n": "Centralização de Parametrização de Folha de Pagamento", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-02-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 602399, "n": "Criar Relatório Mensal para Validação e Correção de Bases da DIRF", "cat": "Implementação - Customização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Especificação", "dt": "2026-03-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 602955, "n": "Eventos Duplicados com Mesma Nomenclatura na Organização 0", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-05", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 603660, "n": "CRIAR INCIDENICIA PARA O RELATÓRIO RELAÇÃO DO INSS", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 603623, "n": "Geração de DSR Suplementar indevido em rescisão – Competência 03/2026", "cat": "Erro - prioridade baixa", "cl": "RESTAURANTE TIA NASTACIA", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-10", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 605566, "n": "[PG] - Adicionar Filtro na tela \"Solicitação\"", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-03-19", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 605786, "n": "Ocorrência", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-03-20", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 606732, "n": "Reestruturação da Emissão de Relatórios de Grande Volume (Resumo Movimento)", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-03-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 606731, "n": "[PG] - Criar parametrização para notificações via e-mail", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-03-25", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 608722, "n": "Assinatura Digital para Gestores sem Vínculo Associado", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Gestor", "st": "Não iniciada", "dt": "2026-04-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 613776, "n": "Beneficio - Não deve ser possivel cadastrar dois beneficios com mesmos eventos", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 613738, "n": "Melhorias no Relatório Customizável de Pensionista", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-04-29", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 614273, "n": "Ajuste de alinhamento – Total de Líquido Parcial no relatório Resumo dos Totais da Folha de Pagamento", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Em andamento", "dt": "2026-05-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 614272, "n": "Divergência na base de INSS Sócio no relatório Resumo dos Totais da Folha de Pagamento", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-04", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 615189, "n": "Falha de validação: Espaços em branco no campo de e-mail", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa Portal do Funcionário", "st": "Backlog", "dt": "2026-05-11", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 615886, "n": "Integração Gupy - HCM", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Em teste", "dt": "2026-05-12", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 616660, "n": "Adequação da mensagem de alerta para agendamento de férias fora do prazo legal", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 616659, "n": "Adequação da regra de agendamento de férias conforme art. 134 da CLT", "cat": "Legislação", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 616573, "n": "Remover obrigatoriedade do campo \"RG\"  no processo de admissão", "cat": "Demanda de Atualização", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-14", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 617141, "n": "[HCM] -  Cnpj alfanumerico", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 617037, "n": "INSERIR FILTRO DE CARGO NO REL CUSTOMIZAVEL DE ADMISS", "cat": "Evolução", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-05-18", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 617949, "n": "Rescisão ta considerando duas vezes Incidencia de Reflexo Hora extra somando ao invez do somatorio anular o valor", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Não iniciada", "dt": "2026-05-21", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 620424, "n": "retirar da função calcula adicionais, insalubridade e periculosidade", "cat": "Erro - prioridade baixa", "cl": "Teknisa Software  Ltda.", "prod": "Teknisa HCM", "st": "Backlog", "dt": "2026-06-02", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}, {"id": 620686, "n": "Ícone de pendência no ponto do vínculo", "cat": "Erro - prioridade baixa", "cl": "RESTAURANTE TIA NASTACIA", "prod": "Teknisa Portal do Gestor", "st": "Backlog", "dt": "2026-06-03", "rm": 0, "mc": 0, "val": 0.0, "curva": "D", "ob": "Ordenação por Curva"}], "clients": [{"n": "Emprego Certo - APPA", "ac": "2022-08-24", "fat": 21890.0, "tp": "PROJETO", "cv": "S", "ch": 0, "pr": 1, "im": 4}, {"n": "GRUPO LLINEA", "ac": "2023-11-30", "fat": 17947.73, "tp": "REAL", "cv": "S", "ch": 0, "pr": 0, "im": 1}, {"n": "SOLUCOES", "ac": "2020-12-23", "fat": 16707.51, "tp": "REAL", "cv": "S", "ch": 1, "pr": 1, "im": 18}, {"n": "AGILE CORP SERVICOS ESPECIALIZADOS", "ac": "2022-01-10", "fat": 15407.97, "tp": "REAL", "cv": "S", "ch": 1, "pr": 0, "im": 0}, {"n": "RC NUTRY ALIMENTACAO LTDA", "ac": "2023-03-10", "fat": 10627.25, "tp": "REAL", "cv": "S", "ch": 1, "pr": 1, "im": 13}, {"n": "Gastroservice", "ac": "2025-07-02", "fat": 9904.62, "tp": "PROJETO", "cv": "A", "ch": 1, "pr": 1, "im": 3}, {"n": "Prime (G.E.F)", "ac": "2025-07-01", "fat": 8715.0, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 0}, {"n": "SABOR & ART (Mais Sabor)", "ac": "2023-12-20", "fat": 8676.3, "tp": "REAL", "cv": "S", "ch": 0, "pr": 1, "im": 2}, {"n": "SUNNY ALIMENTACAO E SERVICOS LTDA", "ac": "2025-05-01", "fat": 8499.95, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 1}, {"n": "Massima Alimentacao", "ac": "2025-09-22", "fat": 8100.0, "tp": "PROJETO", "cv": "A", "ch": 1, "pr": 1, "im": 2}, {"n": "P.S. - S.A.", "ac": "2022-02-17", "fat": 7711.37, "tp": "REAL", "cv": "A", "ch": 0, "pr": 1, "im": 4}, {"n": "MCP REFEICOES LTDA", "ac": "2023-11-08", "fat": 5161.09, "tp": "REAL", "cv": "A", "ch": 0, "pr": 1, "im": 2}, {"n": "Santa Casa de Ubatuba", "ac": "2024-09-05", "fat": 4772.74, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 0}, {"n": "Hospital Santa Juliana", "ac": "2025-10-10", "fat": 4500.0, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 1}, {"n": "Spicy Fish (14zero3 Gitan)", "ac": "2025-07-16", "fat": 4470.0, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 0}, {"n": "SOCIEDADE GRAND VIVANT PARTICIPACOES S.A.", "ac": "2022-09-30", "fat": 3977.55, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "ORGANICO COMERCIAL DE ALIMENTOS LTDA", "ac": "2023-08-28", "fat": 3944.88, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "COMERCIAL MILANO BRASIL LTDA", "ac": "2025-09-05", "fat": 3800.0, "tp": "PROJETO", "cv": "S", "ch": 1, "pr": 1, "im": 1}, {"n": "Satis", "ac": "2025-08-07", "fat": 3700.0, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 0}, {"n": "Nutrimax", "ac": "2025-09-18", "fat": 3700.0, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 0}, {"n": "CONDE DO PAO", "ac": "2025-07-25", "fat": 3640.0, "tp": "PROJETO", "cv": "A", "ch": 1, "pr": 1, "im": 1}, {"n": "M. R. ALIMENTACAO INDUSTRIAL LTDA", "ac": "2023-10-11", "fat": 3614.85, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "ISM Gomes de Mattos", "ac": "2021-04-26", "fat": 3547.59, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "Grupo Noz - MAMMA JAMMA - G. NOZ", "ac": "2020-11-16", "fat": 3445.77, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "ELASA", "ac": "2024-07-03", "fat": 3320.1, "tp": "PROJETO", "cv": "A", "ch": 0, "pr": 1, "im": 21}, {"n": "AME GASTRONOMIA", "ac": "2023-09-06", "fat": 3022.25, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "FABRICA DE BARES PARTICIPACOES LTDA", "ac": "2020-10-30", "fat": 2755.96, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "SPICY FISH RESTAURANTE LTDA", "ac": "2024-10-10", "fat": 2730.0, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "IRMANDADE DE MISERICORDIA DE GUAXUPE", "ac": "2023-12-28", "fat": 2615.59, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "ELASA - ELO ALIMENTACAO S/A.", "ac": "2024-06-28", "fat": 2490.07, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "FUNDACAO AFFEMG DE ASSISTENCIA E SAUDE - FUNDAFFE", "ac": "2023-12-06", "fat": 2482.3, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "TROPFRUIT NORDESTE S/A", "ac": "2025-01-14", "fat": 2464.18, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "NUTRIBEM REFEICOES LTDA.", "ac": "2022-12-14", "fat": 2392.31, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "F&F CO ALIMENTACAO LTDA", "ac": "2020-10-06", "fat": 2336.32, "tp": "REAL", "cv": "A", "ch": 0, "pr": 0, "im": 0}, {"n": "MARFOOD COMERCIO E SERVICOS DE HOTELARIA LTDA", "ac": "2022-04-25", "fat": 2284.25, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "AWM ARAUJO ALIMENTACAO E SERVICOS EIRELI", "ac": "2024-10-25", "fat": 2225.0, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Essencial", "ac": "2020-07-22", "fat": 2153.02, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "CAPIM RESTAURANTE E EVENTOS LTDA.", "ac": "2025-02-28", "fat": 2097.12, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "BAKED POTATO", "ac": "2022-05-17", "fat": 2007.45, "tp": "REAL", "cv": "B", "ch": 1, "pr": 0, "im": 20}, {"n": "Paprica Burguer", "ac": "2025-10-29", "fat": 1920.0, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "NUTRISAUDE NSGROUP", "ac": "2015-11-15", "fat": 1887.04, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Morada Blindada", "ac": "2025-10-02", "fat": 1868.8, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 1}, {"n": "Carvalho e Suassuna Ltda.", "ac": "2018-03-07", "fat": 1750.24, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "O Universitario Rest. Ind. Com. Agropecuaria Ltda", "ac": "2023-04-28", "fat": 1628.79, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "BARROSO ALIMENTOS LTDA - EPP", "ac": "2024-05-08", "fat": 1555.28, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Masan", "ac": "2022-01-10", "fat": 1526.06, "tp": "PROJETO", "cv": "A", "ch": 1, "pr": 1, "im": 46}, {"n": "SILVA E SILVA SERVICOS LTDA", "ac": "2023-06-30", "fat": 1500.0, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "OBA FOOD SERVICE LTDA", "ac": "2022-12-29", "fat": 1435.4, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "SUPRE ALIMENTOS LTDA", "ac": "2023-07-31", "fat": 1391.74, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "MALACARNE REFEICOES COLETIVAS", "ac": "2023-07-10", "fat": 1331.75, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "MISSIATO INDUSTRIA E COMERCIO LTDA", "ac": "2018-03-12", "fat": 1328.21, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Quartzo Soluções", "ac": "2025-05-14", "fat": 1150.0, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "Bar e Restaurante Casa Cheia Ltda.", "ac": "2018-10-11", "fat": 1119.69, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "2G2M GESTAO DE ALIMENTOS E SERVICOS LTDA", "ac": "2020-11-25", "fat": 1080.15, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "E C INDUSTRIAL LTDA", "ac": "2019-04-16", "fat": 1053.26, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Quality Refeições Serviços", "ac": "2023-05-27", "fat": 1050.0, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "Gran Nutriz", "ac": "2023-04-28", "fat": 1050.0, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "GIGLIO S A INDUSTRIA E COMERCIO", "ac": "2019-09-24", "fat": 1002.1, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "ROCAMP SEGURANCA E SERVICOS LTDA", "ac": "2023-02-27", "fat": 960.73, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Primo José Alimentação Coletiva", "ac": "2021-12-30", "fat": 900.0, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "RESTAURANTE INDUSTRIAL E.W. EIRELI", "ac": "2020-08-17", "fat": 888.46, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "MARKET SOLUCOES EM ALIMENTACAO LTDA", "ac": "2024-01-29", "fat": 875.41, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "AMOR GELADO SORVETES", "ac": "2024-01-03", "fat": 846.71, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "Mana Refeições", "ac": "2025-11-22", "fat": 800.34, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "Gostini Food Service E Varejo", "ac": "2023-01-02", "fat": 771.0, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "GIRAFFAS ADMINISTRADORA DE FRANQUIAS SA", "ac": "2020-06-22", "fat": 715.98, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "D'LINO ALIMENTACAO LTDA", "ac": "2022-09-23", "fat": 654.26, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "M.V.G.B. REFEICOES COLETIVAS - LTDA", "ac": "2018-02-20", "fat": 633.1, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "M.NOBRE PRODUTO DE LIMPEZA LTDA", "ac": "2025-01-24", "fat": 540.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "Baco", "ac": "2025-11-05", "fat": 480.0, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "CL RESTAURANTE DE EUGENOPOLIS EIRELI", "ac": "2016-02-16", "fat": 471.56, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "BRASIL GOURMET IND E COMERCIO DE ALIMENTOS S.A.", "ac": "2020-12-23", "fat": 468.52, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "VP CLEAN SERVICOS LTDA", "ac": "2024-08-26", "fat": 464.92, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "Cozivip Alimentação", "ac": "2023-10-17", "fat": 453.83, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "COPAPHARMA DISTRIBUIDORA FARMACEUTICA LTDA", "ac": "2023-02-24", "fat": 427.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "Único Restaurantes Corporativos", "ac": "2025-11-17", "fat": 400.0, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "Bobinex Industria e Comercio de Papeis Ltda.", "ac": "2019-02-20", "fat": 398.98, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "SALGADOS CARVALHO LTDA - EPP", "ac": "2024-10-23", "fat": 348.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "E C INDUSTRIAL LTDA", "ac": "2023-02-22", "fat": 341.58, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "P.S. SERVICOS E ALIMENTACAO EIRELI", "ac": "2024-12-04", "fat": 331.76, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "KORIN- MESSIANICA ALIMENTOS LTDA.", "ac": "2024-11-27", "fat": 311.6, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "DISTRIBUIDORA ATACADISTA DE BEBIDAS SANTA RITA LTDA", "ac": "2021-12-23", "fat": 297.71, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "MARCELO MANOEL VENTURINI - MEGATON - LTDA", "ac": "2025-02-13", "fat": 250.05, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "NOTAGEM IMPLEMENTOS AGRICOLAS E RODOVIARIOS LTDA", "ac": "2025-02-13", "fat": 250.05, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "QUARTZO SOLUCOES EM CONDOMINIOS E GESTAO DE RECUR", "ac": "2025-05-13", "fat": 230.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "ORGANIZACOES CAMPOLAR LTDA", "ac": "2025-05-21", "fat": 199.99, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "JR BRASIL COZINHA INDUSTRIAL LTDA", "ac": "2025-03-31", "fat": 199.98, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "GUILHERME ATHOUGUIA PIMENTEL LEITE", "ac": "2025-02-27", "fat": 199.01, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "ON SIG RASTREAMENTO LTDA", "ac": "2025-04-08", "fat": 199.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "SANTA MARIA SUPERMERCADO LTDA", "ac": "2024-08-23", "fat": 198.99, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "ZANETTI & OLIVEIRA ODONTOLOGIA LTDA", "ac": "2024-10-17", "fat": 198.98, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "HELIOS REFEICOES - EIRELI", "ac": "2024-11-01", "fat": 198.98, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "RODOXISTO TRANSPORTES LTDA", "ac": "2024-09-12", "fat": 196.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "MEO ALIMENTACAO LTDA", "ac": "2025-03-28", "fat": 186.01, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "Meo Alimentação", "ac": "2025-03-28", "fat": 185.99, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "Bobinex Industria e Comercio de Papeis Ltda.", "ac": "2011-10-19", "fat": 115.71, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "APPA SERVICOS TEMPORARIOS E EFETIVOS LTDA", "ac": "2022-08-24", "fat": 110.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "WGU RESTAURANTES LTDA", "ac": "2025-05-26", "fat": 99.5, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "Teknisa Software  Ltda.", "ac": "2015-01-01", "fat": 0.0, "tp": "REAL", "cv": "D", "ch": 0, "pr": 0, "im": 0}, {"n": "AME GASTRONOMIA", "ac": "2022-04-25", "fat": 2284.25, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 3}, {"n": "Cozzi Restaurantes Industriais - Grupo Porto Fino", "ac": "2022-04-25", "fat": 400.0, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "NUTRI HOUSE", "ac": "2022-04-25", "fat": 2284.25, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 5}, {"n": "NUTRISAUDE", "ac": "2022-04-25", "fat": 1887.04, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 35}, {"n": "ODONTOCOMPANY", "ac": "2022-04-25", "fat": 110.0, "tp": "REAL", "cv": "D", "ch": 0, "pr": 0, "im": 0}, {"n": "Pobre Juan - Holding", "ac": "2022-04-25", "fat": 1002.1, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 18}, {"n": "RESTAURANTE TIA NASTACIA", "ac": "2022-04-25", "fat": 110.0, "tp": "REAL", "cv": "D", "ch": 0, "pr": 0, "im": 0}, {"n": "SOLUCOES SERVICOS TERCEIRIZADOS LTDA.", "ac": "", "fat": 21591.540000004, "tp": "REAL", "cv": "S", "ch": 0, "pr": 0, "im": 16}, {"n": "AGILE CORP SERVICOS ESPECIALIZADOS LTDA", "ac": "", "fat": 19310.100000004, "tp": "REAL", "cv": "S", "ch": 0, "pr": 0, "im": 61}, {"n": "PLENA ALIMENTACAO E FACILITIES LTDA", "ac": "", "fat": 18515.610000004, "tp": "PROJETO", "cv": "S", "ch": 1, "pr": 1, "im": 3}, {"n": "ORION SERVICES ASSESSORIA E ADMINISTRACAO LTDA", "ac": "", "fat": 18113.610000004, "tp": "REAL", "cv": "S", "ch": 0, "pr": 0, "im": 0}, {"n": "OBRAS SOCIAIS DA DIOCESE DE RIO BRANCO", "ac": "", "fat": 14903.000000008, "tp": "PROJETO", "cv": "S", "ch": 1, "pr": 1, "im": 0}, {"n": "RC NUTRY ALIMENTACAO LTDA", "ac": "", "fat": 14147.250000005, "tp": "REAL", "cv": "S", "ch": 0, "pr": 0, "im": 0}, {"n": "SUNNY ALIMENTACAO E SERVICOS LTDA", "ac": "", "fat": 9458.880000004, "tp": "PROJETO", "cv": "S", "ch": 1, "pr": 1, "im": 0}, {"n": "ELASA - ELO ALIMENTACAO S/A.", "ac": "", "fat": 6089.400000004, "tp": "REAL", "cv": "S", "ch": 0, "pr": 0, "im": 0}, {"n": "SATIS BRASIL ALIMENTACAO & SERVICOS LTDA", "ac": "", "fat": 6017.390000007, "tp": "PROJETO", "cv": "S", "ch": 1, "pr": 1, "im": 0}, {"n": "P.S. SERVICOS E ALIMENTACAO EIRELI", "ac": "", "fat": 5445.410000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "F&F CO ALIMENTACAO LTDA", "ac": "", "fat": 5184.400000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "MCP REFEICOES LTDA", "ac": "", "fat": 5146.190000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "SOCIEDADE GRAND VIVANT PARTICIPACOES S.A.", "ac": "", "fat": 4098.200000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "AME GASTRONOMIA LTDA", "ac": "", "fat": 3836.440000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "COMERCIAL MILANO BRASIL LTDA", "ac": "", "fat": 3799.92, "tp": "PROJETO", "cv": "S", "ch": 1, "pr": 1, "im": 0}, {"n": "M. R. ALIMENTACAO INDUSTRIAL LTDA", "ac": "", "fat": 3660.900000004, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "ISM Gomes de Mattos", "ac": "", "fat": 3596.590000004, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "G NOZ EMPREENDIMENTOS LTDA", "ac": "", "fat": 3494.750000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "TROPFRUIT NORDESTE S/A", "ac": "", "fat": 2820.180000004, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "IRMANDADE DE MISERICORDIA DE GUAXUPE", "ac": "", "fat": 2615.590000004, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "HOSPITAL E MATERNIDADE SAUDE DA CRIANCA LTDA", "ac": "", "fat": 2500.000000008, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "FUNDACAO AFFEMG DE ASSISTENCIA E SAUDE - FUNDAFFE", "ac": "", "fat": 2482.300000005, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "BCEM COMERCIO DE PRODUTOS ALIMENTICIOS LTDA", "ac": "", "fat": 2456.770000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "NUTRIBEM REFEICOES LTDA.", "ac": "", "fat": 2392.310000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "AWM ARAUJO ALIMENTACAO E SERVICOS EIRELI", "ac": "", "fat": 2288.570000004, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "ESSENCIAL NUTRICAO LTDA", "ac": "", "fat": 2153.040000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "CAPIM RESTAURANTE E EVENTOS LTDA.", "ac": "", "fat": 2097.120000004, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "MRB COMERCIO DE ALIMENTOS LTDA", "ac": "", "fat": 1980.140000008, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "PAPRICA BURGER COMERCIO DE ALIMENTOS LTDA", "ac": "", "fat": 1920.000000001, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "NSGROUP PARTICIPACOES SOCIETARIAS LTDA", "ac": "", "fat": 1887.040000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "MORADA BLINDADA SERVICOS LTDA", "ac": "", "fat": 1868.800000004, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "Carvalho e Suassuna Ltda.", "ac": "", "fat": 1750.240000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "O Universitario Rest. Ind. Com. Agropecuaria Ltda", "ac": "", "fat": 1628.790000004, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "SILVA E SILVA SERVICOS LTDA", "ac": "", "fat": 1605.390000004, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "BARROSO ALIMENTOS LTDA - EPP", "ac": "", "fat": 1555.280000001, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "E C INDUSTRIAL LTDA", "ac": "", "fat": 1394.840000004, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "MALACARNE ALIMENTACAO EMPRESARIAL LTDA", "ac": "", "fat": 1390.260000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "MISSIATO INDUSTRIA E COMERCIO LTDA", "ac": "", "fat": 1328.210000005, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "Bar e Restaurante Casa Cheia Ltda.", "ac": "", "fat": 1151.360000004, "tp": "REAL", "cv": "B", "ch": 0, "pr": 0, "im": 0}, {"n": "VP CLEAN SERVICOS LTDA", "ac": "", "fat": 1123.680000004, "tp": "PROJETO", "cv": "B", "ch": 0, "pr": 1, "im": 0}, {"n": "GIGLIO S A INDUSTRIA E COMERCIO", "ac": "", "fat": 1032.500000004, "tp": "PROJETO", "cv": "B", "ch": 1, "pr": 1, "im": 0}, {"n": "ROCAMP SEGURANCA E SERVICOS LTDA", "ac": "", "fat": 960.730000004, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "RESTAURANTE INDUSTRIAL E.W. EIRELI", "ac": "", "fat": 914.760000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "2G2M GESTAO DE ALIMENTOS E SERVICOS LTDA", "ac": "", "fat": 905.820000004, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "AMOR GELADO FABRICA DE PICOLE E SORVETES LTDA", "ac": "", "fat": 846.710000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "INTRAFRUT INDUSTRIA TRANSFORMADORA DE FRUTOS S/A", "ac": "", "fat": 828.000000004, "tp": "PROJETO", "cv": "C", "ch": 1, "pr": 1, "im": 0}, {"n": "M.V.G.B. REFEICOES COLETIVAS - LTDA", "ac": "", "fat": 772.070000004, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "GIRAFFAS ADMINISTRADORA DE FRANQUIAS SA", "ac": "", "fat": 754.070000004, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "ARACRUZ GESTAO E SERVICOS LTDA", "ac": "", "fat": 678.540000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "D'LINO ALIMENTACAO LTDA", "ac": "", "fat": 662.510000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "KORIN-MESSIANICA ALIMENTOS LTDA.", "ac": "", "fat": 589.120000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "OBA FOOD SERVICE LTDA", "ac": "", "fat": 579.000000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "M.NOBRE PRODUTO DE LIMPEZA LTDA", "ac": "", "fat": 540.000000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "Bobinex Industria e Comercio de Papeis Ltda.", "ac": "", "fat": 517.960000004, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "RUSSI SERVICOS LTDA", "ac": "", "fat": 480.000000003, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "CL RESTAURANTE DE EUGENOPOLIS EIRELI", "ac": "", "fat": 471.560000004, "tp": "REAL", "cv": "C", "ch": 0, "pr": 0, "im": 0}, {"n": "BRASIL GOURMET IND E COMERCIO DE ALIMENTOS S.A.", "ac": "", "fat": 468.520000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "MEO ALIMENTACAO LTDA", "ac": "", "fat": 372.030000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "POIA ESPETO GOURMET", "ac": "", "fat": 357.000000003, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "TIAGO S PORTAL E CIA LTDA", "ac": "", "fat": 320.010000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "MALTA ALIMENTACOES E SERVICOS LTDA", "ac": "", "fat": 299.000000002, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "CAVALCANTI & FERRAZ EMPREENDIMENTOS E SERVICOS LT", "ac": "", "fat": 298.000000003, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "DISTRIBUIDORA ATACADISTA DE BEBIDAS SANTA RITA LT", "ac": "", "fat": 297.710000001, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "ZANETTI & OLIVEIRA ODONTOLOGIA LTDA", "ac": "", "fat": 204.450000002, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "RODOXISTO TRANSPORTES LTDA", "ac": "", "fat": 202.400000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "HELIOS REFEICOES - EIRELI", "ac": "", "fat": 200.470000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "MINIMENU PRODUTOS ALIMENTICIOS LTDA ME", "ac": "", "fat": 199.240000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "GUILHERME ATHOUGUIA PIMENTEL LEITE", "ac": "", "fat": 199.010000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "ON SIG RASTREAMENTO LTDA", "ac": "", "fat": 199.000000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "WGU RESTAURANTES LTDA", "ac": "", "fat": 199.000000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "MICHEL TOMAZ SUSHI RESTAURANTE LTDA", "ac": "", "fat": 199.000000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "OUD&OLIVE COMERCIO ALIMENTOS E BEBIDAS LTDA", "ac": "", "fat": 199.000000002, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}, {"n": "WOO RESTAURANTE LTDA", "ac": "", "fat": 150.000000004, "tp": "PROJETO", "cv": "C", "ch": 0, "pr": 1, "im": 0}], "depara": [{"c": "Emprego Certo - APPA", "i": "EMPREGO CERTO"}, {"c": "ORION SERVICES ASSESSORIA E ADMINISTRACAO LTDA", "i": "GRUPO LLINEA"}, {"c": "SOLUCOES SERVICOS TERCEIRIZADOS LTDA.", "i": "SOLUCOES"}, {"c": "AGILE CORP SERVICOS ESPECIALIZADOS", "i": "Masan"}, {"c": "RC NUTRY ALIMENTACAO LTDA", "i": "RC NUTRY"}, {"c": "Gastroservice", "i": "GASTROSERVICE"}, {"c": "Prime (G.E.F)", "i": ""}, {"c": "SABOR & ART COZINHA INDUSTRIAL LTDA", "i": ""}, {"c": "SUNNY ALIMENTACAO E SERVICOS LTDA", "i": "SUNNY ALIMENTACAO E SERVICOS"}, {"c": "Massima", "i": "Massima Alimentacao"}, {"c": "P.S. SERVICOS E ALIMENTACAO EIRELI", "i": "GRUPO LLINEA"}, {"c": "MCP REFEICOES LTDA", "i": ""}, {"c": "Santa Casa de Ubatuba", "i": ""}, {"c": "Hospital Santa Juliana", "i": "HOSPITAL SANTA JULIANA"}, {"c": "Spicy Fish (14zero3 Gitan)", "i": ""}, {"c": "SOCIEDADE GRAND VIVANT PARTICIPACOES S.A.", "i": "POBRE JUAN - MATRIZ"}, {"c": "ORGANICO COMERCIAL DE ALIMENTOS LTDA", "i": ""}, {"c": "COMERCIAL MILANO BRASIL LTDA", "i": "COMERCIAL MILANO BRASIL LTDA"}, {"c": "Satis", "i": ""}, {"c": "Nutrimax", "i": ""}, {"c": "Conde do Pão", "i": "CONDE DO PAO"}, {"c": "M. R. ALIMENTACAO INDUSTRIAL LTDA", "i": ""}, {"c": "ISM Gomes de Mattos", "i": ""}, {"c": "G NOZ EMPREENDIMENTOS LTDA", "i": "Grupo Noz - MAMMA JAMMA - G. NOZ"}, {"c": "Elasa", "i": "ELASA"}, {"c": "AME GASTRONOMIA", "i": "AME GASTRONOMIA"}, {"c": "FABRICA DE BARES PARTICIPACOES LTDA", "i": ""}, {"c": "SPICY FISH RESTAURANTE LTDA", "i": ""}, {"c": "IRMANDADE DE MISERICORDIA DE GUAXUPE", "i": ""}, {"c": "ELASA - ELO ALIMENTACAO S/A.", "i": "ELASA"}, {"c": "FUNDACAO AFFEMG DE ASSISTENCIA E SAUDE - FUNDAFFE", "i": "FUNDACAO AFFEMG DE ASSISTENCIA E SAUDE - FUNDAFFE"}, {"c": "TROPFRUIT NORDESTE S/A", "i": ""}, {"c": "NUTRIBEM REFEICOES LTDA.", "i": "NUTRIBEM"}, {"c": "F&F CO ALIMENTACAO LTDA", "i": ""}, {"c": "MARFOOD COMERCIO E SERVICOS DE HOTELARIA LTDA", "i": ""}, {"c": "AWM ARAUJO ALIMENTACAO E SERVICOS EIRELI", "i": ""}, {"c": "Essencial Comércio e Serviços em Nutrição Ltda.", "i": "Essencial"}, {"c": "CAPIM RESTAURANTE E EVENTOS LTDA.", "i": ""}, {"c": "BAKED POTATO", "i": "BAKED POTATO"}, {"c": "Paprica Burguer", "i": ""}, {"c": "NSGROUP PARTICIPACOES SOCIETARIAS LTDA", "i": "NUTRISAUDE NSGROUP"}, {"c": "Morada Blindada", "i": "MORADA BLINDADA"}, {"c": "Carvalho e Suassuna Ltda.", "i": ""}, {"c": "O Universitario Rest. Ind. Com. Agropecuaria Ltda", "i": ""}, {"c": "BARROSO ALIMENTOS LTDA - EPP", "i": ""}, {"c": "Masan/Agile", "i": "Masan"}, {"c": "SILVA E SILVA SERVICOS LTDA", "i": ""}, {"c": "OBA FOOD SERVICE LTDA", "i": ""}, {"c": "SUPRE ALIMENTOS LTDA", "i": ""}, {"c": "MALACARNE ALIMENTACAO EMPRESARIAL LTDA", "i": ""}, {"c": "MISSIATO INDUSTRIA E COMERCIO LTDA", "i": ""}, {"c": "Quartzo Soluções", "i": ""}, {"c": "Bar e Restaurante Casa Cheia Ltda.", "i": ""}, {"c": "2G2M GESTAO DE ALIMENTOS E SERVICOS LTDA", "i": ""}, {"c": "E C INDUSTRIAL LTDA", "i": ""}, {"c": "Quality Refeições Serviços", "i": ""}, {"c": "Gran Nutriz", "i": ""}, {"c": "GIGLIO S A INDUSTRIA E COMERCIO", "i": ""}, {"c": "ROCAMP SEGURANCA E SERVICOS LTDA", "i": ""}, {"c": "Primo José Alimentação Coletiva", "i": ""}, {"c": "RESTAURANTE INDUSTRIAL E.W. EIRELI", "i": ""}, {"c": "MARKET SOLUCOES EM ALIMENTACAO LTDA", "i": ""}, {"c": "AMOR GELADO SORVETES", "i": "AMOR GELADO SORVETES"}, {"c": "Mana Refeições", "i": ""}, {"c": "Gostini Food Service E Varejo", "i": ""}, {"c": "GIRAFFAS ADMINISTRADORA DE FRANQUIAS SA", "i": ""}, {"c": "D'LINO ALIMENTACAO LTDA", "i": ""}, {"c": "M.V.G.B. REFEICOES COLETIVAS - LTDA", "i": ""}, {"c": "M.NOBRE PRODUTO DE LIMPEZA LTDA", "i": ""}, {"c": "Baco", "i": ""}, {"c": "CL RESTAURANTE DE EUGENOPOLIS EIRELI", "i": ""}, {"c": "BRASIL GOURMET IND E COMERCIO DE ALIMENTOS S.A.", "i": ""}, {"c": "VP CLEAN SERVICOS LTDA", "i": ""}, {"c": "Cozivip Alimentação", "i": ""}, {"c": "COPAPHARMA DISTRIBUIDORA FARMACEUTICA LTDA", "i": ""}, {"c": "Único Restaurantes Corporativos", "i": ""}, {"c": "Bobinex Industria e Comercio de Papeis Ltda.", "i": ""}, {"c": "SALGADOS CARVALHO LTDA - EPP", "i": ""}, {"c": "E C INDUSTRIAL LTDA", "i": ""}, {"c": "P.S. SERVICOS E ALIMENTACAO EIRELI", "i": ""}, {"c": "KORIN- MESSIANICA ALIMENTOS LTDA.", "i": ""}, {"c": "DISTRIBUIDORA ATACADISTA DE BEBIDAS SANTA RITA LTDA", "i": ""}, {"c": "MARCELO MANOEL VENTURINI - MEGATON - LTDA", "i": ""}, {"c": "NOTAGEM IMPLEMENTOS AGRICOLAS E RODOVIARIOS LTDA", "i": ""}, {"c": "QUARTZO SOLUCOES EM CONDOMINIOS E GESTAO DE RECUR", "i": ""}, {"c": "ORGANIZACOES CAMPOLAR LTDA", "i": ""}, {"c": "JR BRASIL COZINHA INDUSTRIAL LTDA", "i": ""}, {"c": "GUILHERME ATHOUGUIA PIMENTEL LEITE", "i": ""}, {"c": "ON SIG RASTREAMENTO LTDA", "i": ""}, {"c": "SANTA MARIA SUPERMERCADO LTDA", "i": ""}, {"c": "ZANETTI & OLIVEIRA ODONTOLOGIA LTDA", "i": ""}, {"c": "HELIOS REFEICOES - EIRELI", "i": ""}, {"c": "RODOXISTO TRANSPORTES LTDA", "i": ""}, {"c": "MEO ALIMENTACAO LTDA", "i": ""}, {"c": "Meo Alimentação", "i": ""}, {"c": "Bobinex Industria e Comercio de Papeis Ltda.", "i": ""}, {"c": "APPA SERVICOS TEMPORARIOS E EFETIVOS LTDA", "i": "EMPREGO CERTO"}, {"c": "WGU RESTAURANTES LTDA", "i": ""}, {"c": "EFRAIM", "i": "PLENA ALIMENTACAO E FACILITIES LTDA"}]}
;

// ── helpers ──────────────────────────────────────────────────────────────────
const DONE_STATUSES = new Set(["Done","Feito","Em teste","Testada","Concluída","Homologada","Concluida","Aceite"]);
const CURVE_ORDER = { S:0, A:1, B:2, C:3, D:4 };
const SLA_DIAS = { S:90, A:90, B:150 };

function normName(s) {
  return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}
function findClient(issueClientName, clientsArr, deparaArr) {
  const norm = normName(issueClientName);
  let found = clientsArr.find(c => normName(c.n) === norm);
  if (found) return found;
  const dp = deparaArr.find(d => d.i && (normName(d.i) === norm || norm.includes(normName(d.i)) || normName(d.i).includes(norm)));
  if (dp) { found = clientsArr.find(c => normName(c.n) === normName(dp.c)); if (found) return found; }
  const words = norm.split(/\s+/).filter(w => w.length > 3);
  for (const w of words) { found = clientsArr.find(c => normName(c.n).includes(w)); if (found) return found; }
  return null;
}
function daysSince(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d)) return 0;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

// ── MOTOR DE SCORE ────────────────────────────────────────────────────────────
function computeScore(issue, client) {
  const curva = client ? client.cv : (issue.curva || "B");
  const cvOrd = CURVE_ORDER[curva] ?? 4;
  const isTeknisa = normName(issue.cl).includes("teknisa");
  const isRoadmap = issue.rm === 1;
  const isErro = issue.cat && issue.cat.startsWith("Erro");
  const days = daysSince(issue.dt);
  const churn = client ? (client.ch || 0) : 0;
  const isProjeto = client ? (client.pr || 0) : 0;
  const impeditivas = client ? (client.im || 0) : 0;
  const valor = issue.val || 0;
  const multi = (issue.mc === 1) ? 1 : 0;
  const reasons = [];

  if (isErro) {
    reasons.push("Erro impeditivo/crítico");
    if (isTeknisa && isRoadmap) reasons.push("Demanda Interna Teknisa (Roadmap)");
    return { group:0, subScore:[(isTeknisa && isRoadmap) ? 0 : 1, cvOrd], reasons };
  }
  const slaLimit = SLA_DIAS[curva];
  const slaViolado = slaLimit && days >= slaLimit;
  if (slaViolado) {
    reasons.push(`SLA: Curva ${curva} parada há ${days} dias`);
    if (churn) reasons.push(`Risco iminente de churn (Curva ${curva})`);
    if (isProjeto && impeditivas > 0) reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    if (isRoadmap && !isTeknisa) reasons.push("Roadmap/Inovação");
    return { group:1, subScore:[cvOrd, -days], reasons };
  }
  if (churn && ["S","A","B"].includes(curva)) {
    reasons.push(`Risco iminente de churn (Curva ${curva})`);
    if (isProjeto && impeditivas > 0) reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    if (isRoadmap && !isTeknisa) reasons.push("Roadmap/Inovação");
    return { group:2, subScore:[cvOrd, (isProjeto && impeditivas > 0) ? 0 : 1], reasons };
  }
  if (isTeknisa && isRoadmap) {
    reasons.push("Demanda Interna Teknisa (Roadmap)");
    return { group:3, subScore:[1 - multi], reasons };
  }
  if (isRoadmap && !isTeknisa) {
    reasons.push("Roadmap/Inovação");
    if (isProjeto && impeditivas > 0) reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    return { group:4, subScore:[cvOrd, 1 - multi], reasons };
  }
  if (isProjeto && impeditivas > 0 && ["S","A","B"].includes(curva)) {
    reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    return { group:5, subScore:[cvOrd, 1 - multi], reasons };
  }
  reasons.push("Ordenação por Curva");
  return { group:6, subScore:[cvOrd, 1 - multi, -valor], reasons };
}
function compareScores(a, b) {
  if (a.group !== b.group) return a.group - b.group;
  for (let i = 0; i < Math.max(a.subScore.length, b.subScore.length); i++) {
    const av = a.subScore[i] ?? 0, bv = b.subScore[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

// ── ESTILOS ───────────────────────────────────────────────────────────────────
const GROUP_STYLE = [
  { label:"Erro Crítico",       bg:"#FCEBEB", color:"#A32D2D", border:"#E24B4A" },
  { label:"SLA",                bg:"#FAEEDA", color:"#854F0B", border:"#EF9F27" },
  { label:"Risco Churn",        bg:"#FAECE7", color:"#993C1D", border:"#D85A30" },
  { label:"Teknisa Roadmap",    bg:"#E6F1FB", color:"#0C447C", border:"#185FA5" },
  { label:"Roadmap",            bg:"#E1F5EE", color:"#085041", border:"#1D9E75" },
  { label:"Impeditiva Projeto", bg:"#EEEDFE", color:"#3C3489", border:"#534AB7" },
  { label:"Curva",              bg:"#F1EFE8", color:"#444441", border:"#888780" },
];
function curveBadge(curva) {
  const map = {
    S:{ bg:"#EEEDFE", color:"#3C3489", border:"#534AB7" },
    A:{ bg:"#E6F1FB", color:"#0C447C", border:"#185FA5" },
    B:{ bg:"#EAF3DE", color:"#27500A", border:"#3B6D11" },
    C:{ bg:"#FAEEDA", color:"#854F0B", border:"#BA7517" },
    D:{ bg:"#F1EFE8", color:"#444441", border:"#888780" },
  };
  return map[curva] || map.D;
}

// ── MULTISELECT COMPONENT ─────────────────────────────────────────────────────
function MultiSelect({ label, options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(val) {
    if (selected.includes(val)) onChange(selected.filter(x => x !== val));
    else onChange([...selected, val]);
  }

  const displayLabel = selected.length === 0
    ? placeholder
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selecionados`;

  return (
    <div ref={ref} style={{ position:"relative", flex:"1 1 150px", minWidth:0 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background:"var(--color-background-secondary)",
          border:"0.5px solid var(--color-border-secondary)",
          borderRadius:8, padding:"8px 10px", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:4,
          fontSize:13, color: selected.length ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
          userSelect:"none", whiteSpace:"nowrap", overflow:"hidden",
        }}
      >
        <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{displayLabel}</span>
        <i className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize:12, flexShrink:0 }} />
      </div>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:200,
          background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-secondary)",
          borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.15)",
          minWidth:"100%", maxHeight:260, overflowY:"auto",
        }}>
          {selected.length > 0 && (
            <div
              onClick={() => onChange([])}
              style={{ padding:"8px 12px", fontSize:12, color:"#E24B4A", cursor:"pointer", borderBottom:"0.5px solid var(--color-border-tertiary)" }}
            >
              <i className="ti ti-x" style={{ marginRight:4 }} />Limpar seleção
            </div>
          )}
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding:"8px 12px", fontSize:13, cursor:"pointer",
                display:"flex", alignItems:"center", gap:8,
                background: selected.includes(opt) ? "var(--color-background-info)" : "transparent",
                color: selected.includes(opt) ? "var(--color-text-info)" : "var(--color-text-primary)",
              }}
            >
              <span style={{
                width:14, height:14, borderRadius:3, flexShrink:0,
                border:`1.5px solid ${selected.includes(opt) ? "var(--color-text-info)" : "var(--color-border-secondary)"}`,
                background: selected.includes(opt) ? "var(--color-text-info)" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {selected.includes(opt) && <i className="ti ti-check" style={{ fontSize:9, color:"#fff" }} />}
              </span>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── IMPORTAÇÃO XLSX ───────────────────────────────────────────────────────────
// Parse planilha de issues: colunas A-J conforme layout definido
function parseIssueSheet(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  // Simple CSV/XLSX parser using SheetJS-like approach via raw parsing
  // We'll use a base64 approach with the browser's built-in APIs
  // Returns array of issue objects
  return new Promise((resolve, reject) => {
    try {
      // Use FileReader approach - we get the data via the File object in the caller
      // Here we receive arrayBuffer directly, convert to workbook via XLSX if available
      if (typeof XLSX !== "undefined") {
        const wb = XLSX.read(bytes, { type:"array", cellDates:true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"" });
        const issues = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0] && !r[1]) continue; // skip empty rows
          const dtRaw = r[6];
          let dt = "";
          if (dtRaw instanceof Date) {
            dt = dtRaw.toISOString().slice(0,10);
          } else if (typeof dtRaw === "string" && dtRaw.includes("/")) {
            const [d,m,y] = dtRaw.split("/");
            dt = `${y}-${m?.padStart(2,"0")}-${d?.padStart(2,"0")}`;
          } else if (typeof dtRaw === "string") {
            dt = dtRaw.slice(0,10);
          }
          issues.push({
            id:   Number(r[0]) || 0,
            n:    String(r[1] || "").trim(),
            cat:  String(r[2] || "").trim(),
            cl:   String(r[3] || "").trim(),
            prod: String(r[4] || "Teknisa HCM").trim(),
            st:   String(r[5] || "Backlog").trim(),
            dt,
            rm:   Number(r[7]) || 0,
            mc:   Number(r[8]) || 0,
            val:  Number(r[9]) || 0,
            curva: "B",
          });
        }
        resolve(issues.filter(x => x.id > 0 && x.n));
      } else {
        reject(new Error("Biblioteca XLSX não carregada. Tente novamente em instantes."));
      }
    } catch(e) { reject(e); }
  });
}

// Parse planilha de clientes: colunas A-H
function parseClientSheet(arrayBuffer) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof XLSX !== "undefined") {
        const bytes = new Uint8Array(arrayBuffer);
        const wb = XLSX.read(bytes, { type:"array", cellDates:true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"" });
        const clients = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0]) continue;
          const acRaw = r[1];
          let ac = "";
          if (acRaw instanceof Date) {
            ac = acRaw.toISOString().slice(0,10);
          } else if (typeof acRaw === "string" && acRaw.includes("/")) {
            const [d,m,y] = acRaw.split("/");
            ac = `${y}-${m?.padStart(2,"0")}-${d?.padStart(2,"0")}`;
          } else if (typeof acRaw === "string") {
            ac = acRaw.slice(0,10);
          }
          clients.push({
            n:   String(r[0] || "").trim(),
            ac,
            fat: Number(r[2]) || 0,
            tp:  String(r[3] || "REAL").trim().toUpperCase(),
            cv:  String(r[4] || "B").trim().toUpperCase(),
            ch:  Number(r[5]) || 0,
            pr:  Number(r[6]) || 0,
            im:  Number(r[7]) || 0,
          });
        }
        resolve(clients.filter(x => x.n));
      } else {
        reject(new Error("Biblioteca XLSX não carregada."));
      }
    } catch(e) { reject(e); }
  });
}

// ── APP ───────────────────────────────────────────────────────────────────────
const TABS = ["dashboard","issues","especificacao","clientes","criterios"];
const TAB_LABELS = { dashboard:"Painel", issues:"Issues Priorizadas", especificacao:"Especificação", clientes:"Clientes", criterios:"Critérios" };
const TAB_ICONS  = { dashboard:"ti-layout-dashboard", issues:"ti-list-check", especificacao:"ti-file-description", clientes:"ti-building-community", criterios:"ti-settings" };

export default function App() {
  const [tab, setTab]               = useState("issues");
  const [issuesData, setIssuesData] = useState(RAW.issues);
  const [clientsData, setClientsData] = useState(RAW.clients);
  const [deparaData]                = useState(RAW.depara);
  const [filters, setFilters]       = useState({ status:[], curva:[], categoria:[], produto:[], search:"" });
  const [showDone, setShowDone]     = useState(false);
  const [importModal, setImportModal] = useState(null); // "issue" | "client" | null
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const enriched = useMemo(() => issuesData.map(issue => {
    const client = findClient(issue.cl, clientsData, deparaData);
    const curva  = client ? client.cv : (issue.curva || "B");
    const sc     = computeScore(issue, client);
    return { ...issue, _client:client, _curva:curva, _sc:sc };
  }), [issuesData, clientsData, deparaData]);

  const sorted = useMemo(() => [...enriched].sort((a,b) => compareScores(a._sc, b._sc)), [enriched]);

  function applyFilters(list, especOnly = false) {
    return list.filter(issue => {
      if (especOnly && issue.st !== "Especificação") return false;
      if (!showDone && DONE_STATUSES.has(issue.st)) return false;
      if (filters.status.length    && !filters.status.includes(issue.st))     return false;
      if (filters.curva.length     && !filters.curva.includes(issue._curva))  return false;
      if (filters.categoria.length && !filters.categoria.includes(issue.cat)) return false;
      if (filters.produto.length   && !filters.produto.includes(issue.prod))  return false;
      if (filters.search) {
        const q = normName(filters.search);
        if (!normName(issue.n).includes(q) && !normName(issue.cl).includes(q) && !String(issue.id).includes(q)) return false;
      }
      return true;
    });
  }

  const filteredIssues = useMemo(() => applyFilters(sorted),          [sorted, filters, showDone]);
  const filteredEspec  = useMemo(() => applyFilters(sorted, true),    [sorted, filters, showDone]);

  const stats = useMemo(() => {
    const active = sorted.filter(x => !DONE_STATUSES.has(x.st));
    return {
      total:    active.length,
      critical: active.filter(x => x._sc.group === 0).length,
      sla:      active.filter(x => x._sc.group === 1).length,
      churn:    active.filter(x => x._sc.group <= 2 && x._sc.reasons.some(r => r.includes("churn"))).length,
      espec:    active.filter(x => x.st === "Especificação").length,
    };
  }, [sorted]);

  function handleAddIssues(issues) {
    setIssuesData(prev => {
      let next = [...prev];
      for (const issue of issues) {
        const idx = next.findIndex(x => x.id === issue.id);
        if (idx >= 0) next[idx] = { ...next[idx], ...issue };
        else next = [issue, ...next];
      }
      return next;
    });
  }
  function handleAddClients(clients) {
    setClientsData(prev => {
      let next = [...prev];
      for (const client of clients) {
        const idx = next.findIndex(x => normName(x.n) === normName(client.n));
        if (idx >= 0) next[idx] = { ...next[idx], ...client };
        else next = [client, ...next];
      }
      return next;
    });
  }

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function toggleSelectAll(ids) {
    setSelectedIds(prev => {
      const allSelected = ids.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  }
  function handleDeleteSelected() {
    setIssuesData(prev => prev.filter(x => !selectedIds.has(x.id)));
    setSelectedIds(new Set());
    setConfirmDelete(false);
  }

  const hasFilters = filters.status.length || filters.curva.length || filters.categoria.length || filters.produto.length || filters.search;

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", minHeight:"100vh", background:"var(--color-background-tertiary)" }}>
      <div style={{ background:"var(--color-background-primary)", borderBottom:"0.5px solid var(--color-border-tertiary)", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ti ti-rocket" style={{ fontSize:16, color:"#fff" }} aria-hidden />
            </div>
            <div>
              <div style={{ fontWeight:500, fontSize:15, lineHeight:1.2 }}>HCM Issue Prioritizer</div>
              <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>Teknisa · Segmento HCM</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {selectedIds.size > 0 && (
              <button onClick={() => setConfirmDelete(true)} style={{ fontSize:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, background:"#FCEBEB", color:"#A32D2D", borderColor:"#E24B4A66" }}>
                <i className="ti ti-trash" style={{ fontSize:14 }} aria-hidden /> Excluir {selectedIds.size} issue{selectedIds.size > 1 ? "s" : ""}
              </button>
            )}
            <button onClick={() => setImportModal("issue")} style={{ fontSize:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-table-import" style={{ fontSize:14 }} aria-hidden /> + Issues
            </button>
            <button onClick={() => setImportModal("client")} style={{ fontSize:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6 }}>
              <i className="ti ti-users-plus" style={{ fontSize:14 }} aria-hidden /> + Clientes
            </button>
          </div>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"10px 16px", fontSize:13, background:"none", border:"none",
              borderBottom: tab===t ? "2px solid var(--color-text-primary)" : "2px solid transparent",
              color: tab===t ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              fontWeight: tab===t ? 500 : 400, cursor:"pointer",
              display:"flex", alignItems:"center", gap:6
            }}>
              <i className={`ti ${TAB_ICONS[t]}`} style={{ fontSize:14 }} aria-hidden />
              {TAB_LABELS[t]}
              {t==="issues"        && <span style={{ background:"var(--color-background-secondary)", borderRadius:10, padding:"1px 7px", fontSize:11 }}>{filteredIssues.length}</span>}
              {t==="especificacao" && <span style={{ background:"var(--color-background-secondary)", borderRadius:10, padding:"1px 7px", fontSize:11 }}>{filteredEspec.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"24px", maxWidth:1280, margin:"0 auto" }}>
        {tab==="dashboard"    && <DashboardTab stats={stats} issues={sorted} />}
        {tab==="issues"       && <IssuesTab issues={filteredIssues} allIssues={sorted} filters={filters} setFilters={setFilters} showDone={showDone} setShowDone={setShowDone} issuesData={issuesData} hasFilters={!!hasFilters} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} />}
        {tab==="especificacao"&& <IssuesTab issues={filteredEspec}  allIssues={sorted.filter(x=>x.st==="Especificação")} filters={filters} setFilters={setFilters} showDone={showDone} setShowDone={setShowDone} issuesData={issuesData} hasFilters={!!hasFilters} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} especMode />}
        {tab==="clientes"     && <ClientsTab clients={clientsData} onAddSingle={c => handleAddClients([c])} />}
        {tab==="criterios"    && <CriteriosTab />}
      </div>

      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
          <div style={{ background:"var(--color-background-primary)", borderRadius:16, border:"0.5px solid var(--color-border-tertiary)", padding:28, width:380, textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:"#FCEBEB", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <i className="ti ti-trash" style={{ fontSize:24, color:"#A32D2D" }} />
            </div>
            <div style={{ fontWeight:500, fontSize:16, marginBottom:8 }}>Confirmar exclusão</div>
            <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginBottom:24 }}>
              Tem certeza que deseja remover <strong>{selectedIds.size} issue{selectedIds.size > 1 ? "s" : ""}</strong> do painel? Esta ação não pode ser desfeita.
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={() => setConfirmDelete(false)} style={{ padding:"8px 20px" }}>Cancelar</button>
              <button onClick={handleDeleteSelected} style={{ padding:"8px 20px", background:"#A32D2D", color:"#fff", border:"none" }}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {importModal==="issue"  && <ImportIssueModal  onClose={() => setImportModal(null)} onSave={handleAddIssues}  existingIssues={issuesData} />}
      {importModal==="client" && <ImportClientModal onClose={() => setImportModal(null)} onSave={handleAddClients} existingClients={clientsData} />}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardTab({ stats, issues }) {
  const top = issues.filter(x => !DONE_STATUSES.has(x.st)).slice(0,10);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
        {[
          { label:"Issues Ativas",  value:stats.total,    icon:"ti-list-check",      color:"#185FA5" },
          { label:"Erros Críticos", value:stats.critical, icon:"ti-alert-circle",    color:"#A32D2D" },
          { label:"SLA Vencido",    value:stats.sla,      icon:"ti-clock-x",         color:"#854F0B" },
          { label:"Risco Churn",    value:stats.churn,    icon:"ti-user-x",          color:"#993C1D" },
          { label:"Especificação",  value:stats.espec,    icon:"ti-file-description",color:"#3B6D11" },
        ].map(s => (
          <div key={s.label} style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:"1rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize:16, color:s.color }} aria-hidden />
              <div style={{ fontSize:13, color:"var(--color-text-secondary)" }}>{s.label}</div>
            </div>
            <div style={{ fontSize:28, fontWeight:500 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:20 }}>
        <div style={{ fontWeight:500, fontSize:15, marginBottom:16 }}>Top 10 — Maior Prioridade</div>
        {top.map((issue,i) => <IssueRow key={issue.id} issue={issue} rank={i+1} compact />)}
      </div>
    </div>
  );
}

// ── ISSUE ROW ─────────────────────────────────────────────────────────────────
function IssueRow({ issue, rank, compact, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const gs = GROUP_STYLE[issue._sc.group] || GROUP_STYLE[6];
  const cb = curveBadge(issue._curva);
  const days = daysSince(issue.dt);
  return (
    <div style={{
      padding: compact ? "10px 12px" : "12px 14px",
      borderRadius:8, marginBottom:4,
      background: selected ? "#FFF5F5" : expanded ? "var(--color-background-secondary)" : "transparent",
      border:"0.5px solid " + (selected ? "#E24B4A66" : expanded ? "var(--color-border-secondary)" : "transparent"),
      transition:"all 0.12s"
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"nowrap", overflow:"hidden" }}>
        {onToggle && (
          <span onClick={e => { e.stopPropagation(); onToggle(issue.id); }} style={{ flexShrink:0, cursor:"pointer", display:"flex", alignItems:"center" }}>
            <span style={{
              width:15, height:15, borderRadius:4, border:`1.5px solid ${selected ? "#A32D2D" : "var(--color-border-secondary)"}`,
              background: selected ? "#A32D2D" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            }}>
              {selected && <i className="ti ti-check" style={{ fontSize:9, color:"#fff" }} />}
            </span>
          </span>
        )}
        <div onClick={() => setExpanded(!expanded)} style={{ display:"flex", alignItems:"center", gap:8, flex:1, overflow:"hidden", cursor:"pointer" }}>
        {rank && <span style={{ fontSize:11, color:"var(--color-text-tertiary)", minWidth:26, fontWeight:500 }}>#{rank}</span>}
        <span style={{ background:gs.bg, color:gs.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, whiteSpace:"nowrap", border:`0.5px solid ${gs.border}44`, flexShrink:0 }}>{gs.label}</span>
        <span style={{ background:cb.bg, color:cb.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, border:`0.5px solid ${cb.border}44`, flexShrink:0 }}>Curva {issue._curva}</span>
        <span style={{ fontSize:13, fontWeight:500, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{issue.n}</span>
        <span style={{ fontSize:12, color:"var(--color-text-secondary)", whiteSpace:"nowrap", flexShrink:0 }}>{issue.cl}</span>
        <span style={{ fontSize:11, color:"var(--color-text-tertiary)", background:"var(--color-background-secondary)", borderRadius:4, padding:"1px 6px", whiteSpace:"nowrap", flexShrink:0 }}>{issue.st}</span>
        <i className={`ti ${expanded ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize:14, color:"var(--color-text-tertiary)", flexShrink:0 }} aria-hidden />
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"0.5px solid var(--color-border-tertiary)", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          <Field label="ID"                value={issue.id} />
          <Field label="Categoria"         value={issue.cat} />
          <Field label="Produto"           value={issue.prod} />
          <Field label="Data Abertura"     value={issue.dt} />
          <Field label="Dias em aberto"    value={days+" dias"} color={days>180?"#E24B4A":days>90?"#BA7517":undefined} />
          <Field label="Roadmap"           value={issue.rm ? "Sim" : "Não"} />
          <Field label="Atende +1 cliente" value={issue.mc ? "Sim" : "Não"} />
          <Field label="Valor"             value={issue.val>0 ? `R$ ${issue.val.toLocaleString("pt-BR")}` : "—"} />
          <div style={{ gridColumn:"1 / -1" }}>
            <div style={{ fontSize:11, color:"var(--color-text-tertiary)", marginBottom:4 }}>Critérios de Priorização</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {issue._sc.reasons.map(r => (
                <span key={r} style={{ background:"var(--color-background-info)", color:"var(--color-text-info)", borderRadius:6, padding:"2px 8px", fontSize:11 }}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Field({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize:11, color:"var(--color-text-tertiary)", marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:13, color:color||"var(--color-text-primary)" }}>{value||"—"}</div>
    </div>
  );
}

// ── ISSUES TAB ────────────────────────────────────────────────────────────────
function IssuesTab({ issues, allIssues, filters, setFilters, showDone, setShowDone, issuesData, hasFilters, especMode, selectedIds, toggleSelect, toggleSelectAll }) {
  function sf(k, v) { setFilters(f => ({...f,[k]:v})); }
  const allStatuses   = useMemo(() => [...new Set(issuesData.map(x => x.st))].sort(),   [issuesData]);
  const allCategorias = useMemo(() => [...new Set(issuesData.map(x => x.cat))].sort(),  [issuesData]);
  const allProdutos   = useMemo(() => [...new Set(issuesData.map(x => x.prod))].sort(), [issuesData]);

  return (
    <div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:16, marginBottom:16 }}>
        {/* Linha 1: busca + limpar */}
        <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
          <input
            value={filters.search}
            onChange={e => sf("search", e.target.value)}
            placeholder="Buscar por ID, nome ou cliente..."
            style={{ flex:1 }}
          />
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--color-text-secondary)", cursor:"pointer", whiteSpace:"nowrap" }}>
            <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} />
            Concluídas
          </label>
          {hasFilters && (
            <button onClick={() => setFilters({ status:[], curva:[], categoria:[], produto:[], search:"" })} style={{ fontSize:12, whiteSpace:"nowrap" }}>
              <i className="ti ti-x" style={{ fontSize:13 }} aria-hidden /> Limpar
            </button>
          )}
        </div>
        {/* Linha 2: multiselects */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <MultiSelect
            placeholder="Curva (todas)"
            options={["S","A","B","C","D"]}
            selected={filters.curva}
            onChange={v => sf("curva", v)}
          />
          <MultiSelect
            placeholder="Status (todos)"
            options={allStatuses}
            selected={filters.status}
            onChange={v => sf("status", v)}
          />
          <MultiSelect
            placeholder="Categoria (todas)"
            options={allCategorias}
            selected={filters.categoria}
            onChange={v => sf("categoria", v)}
          />
          <MultiSelect
            placeholder="Produto (todos)"
            options={allProdutos}
            selected={filters.produto}
            onChange={v => sf("produto", v)}
          />
        </div>
        {/* Tags de filtros ativos */}
        {hasFilters && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>
            {filters.curva.map(v => <FilterTag key={v} label={`Curva: ${v}`} onRemove={() => sf("curva", filters.curva.filter(x=>x!==v))} />)}
            {filters.status.map(v => <FilterTag key={v} label={`Status: ${v}`} onRemove={() => sf("status", filters.status.filter(x=>x!==v))} />)}
            {filters.categoria.map(v => <FilterTag key={v} label={v} onRemove={() => sf("categoria", filters.categoria.filter(x=>x!==v))} />)}
            {filters.produto.map(v => <FilterTag key={v} label={v} onRemove={() => sf("produto", filters.produto.filter(x=>x!==v))} />)}
            {filters.search && <FilterTag label={`"${filters.search}"`} onRemove={() => sf("search","")} />}
          </div>
        )}
      </div>
      {/* Legenda */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {GROUP_STYLE.map(gs => (
          <span key={gs.label} style={{ background:gs.bg, color:gs.color, border:`0.5px solid ${gs.border}66`, borderRadius:6, padding:"2px 9px", fontSize:11 }}>{gs.label}</span>
        ))}
      </div>
      <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
        <span>{especMode ? "Issues em Especificação" : "Issues priorizadas"}: <strong>{issues.length}</strong> de {allIssues.length}</span>
        {issues.length > 0 && toggleSelectAll && (
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:12, color:"var(--color-text-secondary)" }}
            onClick={() => toggleSelectAll(issues.map(x => x.id))}>
            <span style={{
              width:15, height:15, borderRadius:4, border:`1.5px solid var(--color-border-secondary)`,
              background: issues.every(x => selectedIds.has(x.id)) ? "#A32D2D" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            }}>
              {issues.every(x => selectedIds.has(x.id)) && <i className="ti ti-check" style={{ fontSize:9, color:"#fff" }} />}
              {issues.some(x => selectedIds.has(x.id)) && !issues.every(x => selectedIds.has(x.id)) && <i className="ti ti-minus" style={{ fontSize:9, color:"#A32D2D" }} />}
            </span>
            {issues.some(x => selectedIds.has(x.id))
              ? `${issues.filter(x => selectedIds.has(x.id)).length} selecionada${issues.filter(x => selectedIds.has(x.id)).length > 1 ? "s" : ""}`
              : "Selecionar todas"}
          </label>
        )}
      </div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:16 }}>
        {issues.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:"var(--color-text-tertiary)" }}>
            <i className="ti ti-search" style={{ fontSize:32, display:"block", marginBottom:8 }} aria-hidden />
            Nenhuma issue encontrada
          </div>
        )}
        {issues.map((issue,i) => <IssueRow key={issue.id} issue={issue} rank={i+1} selected={selectedIds && selectedIds.has(issue.id)} onToggle={toggleSelect} />)}
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:"var(--color-background-info)", color:"var(--color-text-info)",
      borderRadius:6, padding:"2px 8px", fontSize:11, cursor:"pointer",
    }}
      onClick={onRemove}
    >
      {label} <i className="ti ti-x" style={{ fontSize:10 }} />
    </span>
  );
}

// ── CLIENTS TAB ───────────────────────────────────────────────────────────────
function ClientsTab({ clients, onAddSingle }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const filtered = clients.filter(c => !search || normName(c.n).includes(normName(search)));
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ flex:1 }} />
        <button onClick={() => setShowForm(true)} style={{ padding:"8px 16px", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
          <i className="ti ti-plus" aria-hidden /> Novo Cliente
        </button>
      </div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", overflow:"hidden" }}>
        <div style={{ padding:"10px 16px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"grid", gridTemplateColumns:"3fr 1fr 1.5fr 1fr 1fr 1fr 1fr", gap:8, fontSize:11, color:"var(--color-text-tertiary)", fontWeight:500 }}>
          <span>Cliente</span><span>Curva</span><span>Faturamento</span><span>Tipo</span><span>Churn</span><span>Projeto</span><span>Impeditivas</span>
        </div>
        {filtered.map(c => {
          const cb = curveBadge(c.cv);
          return (
            <div key={c.n+c.fat} style={{ padding:"10px 16px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"grid", gridTemplateColumns:"3fr 1fr 1.5fr 1fr 1fr 1fr 1fr", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</span>
              <span style={{ background:cb.bg, color:cb.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, textAlign:"center", border:`0.5px solid ${cb.border}44` }}>Curva {c.cv}</span>
              <span style={{ fontSize:12 }}>R$ {(c.fat||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
              <span style={{ fontSize:12, color:"var(--color-text-secondary)" }}>{c.tp}</span>
              <span>{c.ch ? <span style={{ color:"#E24B4A",fontSize:12 }}>Sim</span> : <span style={{ color:"var(--color-text-tertiary)",fontSize:12 }}>Não</span>}</span>
              <span>{c.pr ? <span style={{ color:"#185FA5",fontSize:12 }}>Sim</span> : <span style={{ color:"var(--color-text-tertiary)",fontSize:12 }}>Não</span>}</span>
              <span style={{ fontSize:12, textAlign:"center" }}>{c.im}</span>
            </div>
          );
        })}
      </div>
      {showForm && <SingleClientModal onClose={() => setShowForm(false)} onSave={c => { onAddSingle(c); setShowForm(false); }} />}
    </div>
  );
}

// ── CRITERIOS TAB ─────────────────────────────────────────────────────────────
function CriteriosTab() {
  const criterios = [
    { rank:0, nome:"Erro Crítico",                desc:"Issues de erro (qualquer nível). Teknisa+Roadmap primeiro, depois por curva S→A→B→C→D.", ...GROUP_STYLE[0], icon:"ti-alert-circle" },
    { rank:1, nome:"SLA — Parada há muito tempo", desc:"Curva S/A ≥ 90 dias · Curva B ≥ 150 dias. Ordenado por curva e dias decrescente. Outros critérios são registrados mas não reordenam.", ...GROUP_STYLE[1], icon:"ti-clock-x" },
    { rank:2, nome:"Risco de Churn (sem SLA)",    desc:"Clientes curva S, A ou B com flag de churn. Ordenado por curva.", ...GROUP_STYLE[2], icon:"ti-user-x" },
    { rank:3, nome:"Teknisa Roadmap",             desc:"Issues da Teknisa com flag de roadmap. Atende múltiplos clientes tem prioridade.", ...GROUP_STYLE[3], icon:"ti-building" },
    { rank:4, nome:"Roadmap / Inovação",          desc:"Issues de roadmap de produto (exceto Teknisa interna). Ordenado por curva e multi-cliente.", ...GROUP_STYLE[4], icon:"ti-rocket" },
    { rank:5, nome:"Impeditiva em Projeto",       desc:"Cliente em projeto com issues impeditivas. Sem SLA, churn ou roadmap. Curva A antes de B.", ...GROUP_STYLE[5], icon:"ti-building-factory" },
    { rank:6, nome:"Ordenação por Curva",         desc:"Demais issues. Curva S→A→B→C→D, depois multi-cliente, depois valor.", ...GROUP_STYLE[6], icon:"ti-sort-descending" },
  ];
  return (
    <div>
      <div style={{ marginBottom:16, fontSize:14, color:"var(--color-text-secondary)" }}>
        O score é composto — múltiplos critérios podem se aplicar e ficam listados na observação. A posição é determinada pelo grupo primário e sub-critérios de desempate.
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {criterios.map(c => (
          <div key={c.rank} style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:"16px 20px", display:"flex", alignItems:"flex-start", gap:16 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={`ti ${c.icon}`} style={{ fontSize:20, color:c.color }} aria-hidden />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontWeight:500, fontSize:15 }}>{c.nome}</span>
                <span style={{ background:c.bg, color:c.color, borderRadius:6, padding:"1px 8px", fontSize:11 }}>Grupo {c.rank}</span>
              </div>
              <div style={{ fontSize:13, color:"var(--color-text-secondary)" }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MODAL IMPORTAR ISSUES ────────────────────────────────────────────────────
function ImportIssueModal({ onClose, onSave, existingIssues }) {
  const [tab, setTab]         = useState("file");
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState([]); // [{...issue, _op:"insert"|"update"}]
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({
    id:"", n:"", cat:"Erro - prioridade alta", cl:"", prod:"Teknisa HCM",
    st:"Backlog", dt:new Date().toISOString().slice(0,10), rm:"0", mc:"0", val:"0"
  });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  // Verifica se o ID do formulário manual já existe
  const manualExists = form.id
    ? existingIssues.find(x => x.id === Number(form.id)) || null
    : null;

  function enrichPreview(issues) {
    return issues.map(iss => ({
      ...iss,
      _op: existingIssues.some(x => x.id === iss.id) ? "update" : "insert",
    }));
  }

  async function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); setError(""); setPreview([]);
    setLoading(true);
    try {
      const buf = await f.arrayBuffer();
      const issues = await parseIssueSheet(buf);
      setPreview(enrichPreview(issues));
    } catch(err) { setError(err.message); }
    setLoading(false);
  }

  function handleManualSave() {
    if (!form.id || !form.n || !form.cl) return setError("ID, nome e cliente são obrigatórios.");
    onSave([{ ...form, id:Number(form.id), rm:Number(form.rm), mc:Number(form.mc), val:Number(form.val), curva:"B" }]);
    onClose();
  }

  function handleImport() {
    if (preview.length === 0) return;
    onSave(preview.map(({ _op, ...iss }) => iss));
    onClose();
  }

  const nInsert = preview.filter(x => x._op === "insert").length;
  const nUpdate = preview.filter(x => x._op === "update").length;

  return (
    <Modal title="+ Issues" onClose={onClose} onSave={null} wide>
      <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
        {[["file","ti-file-spreadsheet","Importar planilha"],["manual","ti-pencil","Cadastro manual"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => { setTab(id); setError(""); }} style={{
            padding:"8px 16px", fontSize:13, background:"none", border:"none",
            borderBottom: tab===id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
            color: tab===id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: tab===id ? 500 : 400, cursor:"pointer",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <i className={`ti ${icon}`} style={{ fontSize:14 }} /> {label}
          </button>
        ))}
      </div>

      {tab==="file" && (
        <div>
          <div style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:12, marginBottom:16 }}>
            <div style={{ fontWeight:500, marginBottom:6, fontSize:13 }}>Layout esperado (linha 1 = cabeçalho):</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4 }}>
              {[["A","Id (número)"],["B","Nome / Descrição"],["C","Categoria"],["D","Cliente"],["E","Produto"],
                ["F","Status"],["G","Data Abertura (DD/MM/AAAA)"],["H","Roadmap (0/1)"],["I","Atende +1 (0/1)"],["J","Valor (R$)"]].map(([col,desc]) => (
                <div key={col} style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ background:"var(--color-background-info)", color:"var(--color-text-info)", borderRadius:4, padding:"1px 6px", fontSize:11, fontWeight:500, flexShrink:0 }}>{col}</span>
                  <span style={{ color:"var(--color-text-secondary)", fontSize:11 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <label style={{
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:8, padding:"28px 16px", borderRadius:10, cursor:"pointer",
            border:"1.5px dashed var(--color-border-secondary)",
            background:"var(--color-background-secondary)", marginBottom:16,
          }}>
            <i className="ti ti-file-upload" style={{ fontSize:32, color:"var(--color-text-tertiary)" }} />
            <span style={{ fontSize:13, color:"var(--color-text-secondary)" }}>
              {file ? file.name : "Clique para selecionar ou arraste o arquivo .xlsx / .xls"}
            </span>
            <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display:"none" }} />
          </label>

          {loading && <div style={{ textAlign:"center", padding:16, color:"var(--color-text-secondary)", fontSize:13 }}><i className="ti ti-loader-2 ti-spin" /> Lendo planilha...</div>}
          {error   && <div style={{ color:"#E24B4A", fontSize:13, marginBottom:12, padding:"8px 12px", background:"#FCEBEB", borderRadius:8 }}><i className="ti ti-alert-circle" /> {error}</div>}

          {preview.length > 0 && (
            <div>
              {/* Resumo insert vs update */}
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, color:"var(--color-text-secondary)" }}>
                  <strong>{preview.length}</strong> issues lidas da planilha:
                </span>
                {nInsert > 0 && (
                  <span style={{ background:"#EAF3DE", color:"#27500A", border:"0.5px solid #3B6D1144", borderRadius:6, padding:"1px 10px", fontSize:12 }}>
                    <i className="ti ti-plus" style={{ fontSize:11 }} /> {nInsert} novas
                  </span>
                )}
                {nUpdate > 0 && (
                  <span style={{ background:"#E6F1FB", color:"#0C447C", border:"0.5px solid #185FA544", borderRadius:6, padding:"1px 10px", fontSize:12 }}>
                    <i className="ti ti-refresh" style={{ fontSize:11 }} /> {nUpdate} atualizações
                  </span>
                )}
              </div>

              {/* Prévia tabela */}
              <div style={{ borderRadius:8, border:"0.5px solid var(--color-border-tertiary)", overflow:"hidden", marginBottom:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"24px 60px 1fr 110px 90px", gap:8, padding:"8px 12px", background:"var(--color-background-secondary)", fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)" }}>
                  <span></span><span>ID</span><span>Nome</span><span>Cliente</span><span>Status</span>
                </div>
                {preview.slice(0,8).map(iss => (
                  <div key={iss.id} style={{ display:"grid", gridTemplateColumns:"24px 60px 1fr 110px 90px", gap:8, padding:"8px 12px", borderTop:"0.5px solid var(--color-border-tertiary)", fontSize:12, alignItems:"center" }}>
                    <span title={iss._op === "update" ? "Atualização" : "Nova issue"}>
                      {iss._op === "update"
                        ? <i className="ti ti-refresh" style={{ color:"#185FA5", fontSize:13 }} />
                        : <i className="ti ti-plus" style={{ color:"#27500A", fontSize:13 }} />
                      }
                    </span>
                    <span style={{ color:"var(--color-text-tertiary)" }}>{iss.id}</span>
                    <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{iss.n}</span>
                    <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"var(--color-text-secondary)" }}>{iss.cl}</span>
                    <span style={{ color:"var(--color-text-secondary)" }}>{iss.st}</span>
                  </div>
                ))}
                {preview.length > 8 && (
                  <div style={{ padding:"8px 12px", fontSize:12, color:"var(--color-text-tertiary)", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
                    … e mais {preview.length - 8} issues
                  </div>
                )}
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button onClick={handleImport} style={{ background:"var(--color-text-primary)", color:"var(--color-background-primary)", border:"none", padding:"8px 20px", fontSize:13 }}>
                  <i className="ti ti-check" /> Confirmar ({nInsert > 0 ? `${nInsert} nova${nInsert>1?"s":""}` : ""}{nInsert>0&&nUpdate>0?", ":""}{nUpdate > 0 ? `${nUpdate} atualiz.` : ""})
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="manual" && (
        <div>
          <FRow>
            <FInput label="Número da Issue *" value={form.id} onChange={v=>set("id",v)} type="number" />
            <FInput label="Status" value={form.st} onChange={v=>set("st",v)} select options={["Backlog","Não iniciada","Em andamento","Especificação","Aceite","Aguardando cliente","Aguardando planejamento"]} />
          </FRow>

          {/* Badge de upsert no cadastro manual */}
          {manualExists && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, padding:"8px 12px", background:"#E6F1FB", borderRadius:8, fontSize:13, color:"#0C447C" }}>
              <i className="ti ti-refresh" style={{ fontSize:15 }} />
              Issue <strong>#{manualExists.id}</strong> já existe — os campos preenchidos abaixo irão <strong>atualizar</strong> o registro existente.
            </div>
          )}

          <FInput label="Nome / Descrição *" value={form.n} onChange={v=>set("n",v)} />
          <FRow>
            <FInput label="Cliente *" value={form.cl} onChange={v=>set("cl",v)} />
            <FInput label="Produto" value={form.prod} onChange={v=>set("prod",v)} select options={["Teknisa HCM","Teknisa Portal do Funcionário","Teknisa Portal do Gestor"]} />
          </FRow>
          <FRow>
            <FInput label="Categoria" value={form.cat} onChange={v=>set("cat",v)} select options={["Erro - prioridade alta","Erro - prioridade média","Erro - prioridade baixa","Legislação","Implementação - Customização","Sugestão de melhoria","Evolução","Demanda de Atualização","Dúvida"]} />
            <FInput label="Data Abertura" value={form.dt} onChange={v=>set("dt",v)} type="date" />
          </FRow>
          <FRow>
            <FInput label="Roadmap (0/1)" value={form.rm} onChange={v=>set("rm",v)} select options={["0","1"]} />
            <FInput label="Atende +1 cliente" value={form.mc} onChange={v=>set("mc",v)} select options={["0","1"]} />
            <FInput label="Valor (R$)" value={form.val} onChange={v=>set("val",v)} type="number" />
          </FRow>
          {error && <div style={{ color:"#E24B4A", fontSize:12, marginBottom:8 }}>{error}</div>}
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <button onClick={handleManualSave} style={{ background:"var(--color-text-primary)", color:"var(--color-background-primary)", border:"none", padding:"8px 20px", fontSize:13 }}>
              {manualExists ? <><i className="ti ti-refresh" /> Atualizar Issue</> : <><i className="ti ti-plus" /> Cadastrar Issue</>}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── MODAL IMPORTAR CLIENTES ───────────────────────────────────────────────────
function ImportClientModal({ onClose, onSave, existingClients }) {
  const [tab, setTab]         = useState("file");
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ n:"", ac:"", fat:"0", tp:"REAL", cv:"B", ch:"0", pr:"0", im:"0" });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  // Verifica se o nome do formulário manual já existe
  const manualExists = form.n
    ? existingClients.find(x => normName(x.n) === normName(form.n)) || null
    : null;

  function enrichPreview(clients) {
    return clients.map(c => ({
      ...c,
      _op: existingClients.some(x => normName(x.n) === normName(c.n)) ? "update" : "insert",
    }));
  }

  async function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); setError(""); setPreview([]);
    setLoading(true);
    try {
      const buf = await f.arrayBuffer();
      const clients = await parseClientSheet(buf);
      setPreview(enrichPreview(clients));
    } catch(err) { setError(err.message); }
    setLoading(false);
  }

  function handleManualSave() {
    if (!form.n) return setError("Nome do cliente é obrigatório.");
    onSave([{ ...form, fat:Number(form.fat), ch:Number(form.ch), pr:Number(form.pr), im:Number(form.im) }]);
    onClose();
  }

  function handleImport() {
    if (preview.length === 0) return;
    onSave(preview.map(({ _op, ...c }) => c));
    onClose();
  }

  const nInsert = preview.filter(x => x._op === "insert").length;
  const nUpdate = preview.filter(x => x._op === "update").length;

  return (
    <Modal title="+ Clientes" onClose={onClose} onSave={null} wide>
      <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
        {[["file","ti-file-spreadsheet","Importar planilha"],["manual","ti-pencil","Cadastro manual"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => { setTab(id); setError(""); }} style={{
            padding:"8px 16px", fontSize:13, background:"none", border:"none",
            borderBottom: tab===id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
            color: tab===id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: tab===id ? 500 : 400, cursor:"pointer",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <i className={`ti ${icon}`} style={{ fontSize:14 }} /> {label}
          </button>
        ))}
      </div>

      {tab==="file" && (
        <div>
          <div style={{ background:"var(--color-background-secondary)", borderRadius:8, padding:12, marginBottom:16 }}>
            <div style={{ fontWeight:500, marginBottom:6, fontSize:13 }}>Layout esperado (linha 1 = cabeçalho):</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
              {[["A","Cliente (nome)"],["B","Data Aceite (DD/MM/AAAA)"],["C","Faturamento Atual (R$)"],["D","Tipo (PROJETO/REAL)"],
                ["E","Curva (S/A/B/C/D)"],["F","Risco Churn (0/1)"],["G","Em Projeto (0/1)"],["H","Qtd Issues Impeditivas"]].map(([col,desc]) => (
                <div key={col} style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ background:"var(--color-background-info)", color:"var(--color-text-info)", borderRadius:4, padding:"1px 6px", fontSize:11, fontWeight:500, flexShrink:0 }}>{col}</span>
                  <span style={{ color:"var(--color-text-secondary)", fontSize:11 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <label style={{
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:8, padding:"28px 16px", borderRadius:10, cursor:"pointer",
            border:"1.5px dashed var(--color-border-secondary)",
            background:"var(--color-background-secondary)", marginBottom:16,
          }}>
            <i className="ti ti-file-upload" style={{ fontSize:32, color:"var(--color-text-tertiary)" }} />
            <span style={{ fontSize:13, color:"var(--color-text-secondary)" }}>
              {file ? file.name : "Clique para selecionar ou arraste o arquivo .xlsx / .xls"}
            </span>
            <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display:"none" }} />
          </label>

          {loading && <div style={{ textAlign:"center", padding:16, color:"var(--color-text-secondary)", fontSize:13 }}><i className="ti ti-loader-2 ti-spin" /> Lendo planilha...</div>}
          {error   && <div style={{ color:"#E24B4A", fontSize:13, marginBottom:12, padding:"8px 12px", background:"#FCEBEB", borderRadius:8 }}><i className="ti ti-alert-circle" /> {error}</div>}

          {preview.length > 0 && (
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, color:"var(--color-text-secondary)" }}>
                  <strong>{preview.length}</strong> clientes lidos da planilha:
                </span>
                {nInsert > 0 && (
                  <span style={{ background:"#EAF3DE", color:"#27500A", border:"0.5px solid #3B6D1144", borderRadius:6, padding:"1px 10px", fontSize:12 }}>
                    <i className="ti ti-plus" style={{ fontSize:11 }} /> {nInsert} novos
                  </span>
                )}
                {nUpdate > 0 && (
                  <span style={{ background:"#E6F1FB", color:"#0C447C", border:"0.5px solid #185FA544", borderRadius:6, padding:"1px 10px", fontSize:12 }}>
                    <i className="ti ti-refresh" style={{ fontSize:11 }} /> {nUpdate} atualizações
                  </span>
                )}
              </div>

              <div style={{ borderRadius:8, border:"0.5px solid var(--color-border-tertiary)", overflow:"hidden", marginBottom:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"24px 2fr 60px 90px 80px", gap:8, padding:"8px 12px", background:"var(--color-background-secondary)", fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)" }}>
                  <span></span><span>Nome</span><span>Curva</span><span>Faturamento</span><span>Tipo</span>
                </div>
                {preview.slice(0,8).map(c => (
                  <div key={c.n} style={{ display:"grid", gridTemplateColumns:"24px 2fr 60px 90px 80px", gap:8, padding:"8px 12px", borderTop:"0.5px solid var(--color-border-tertiary)", fontSize:12, alignItems:"center" }}>
                    <span title={c._op === "update" ? "Atualização" : "Novo cliente"}>
                      {c._op === "update"
                        ? <i className="ti ti-refresh" style={{ color:"#185FA5", fontSize:13 }} />
                        : <i className="ti ti-plus" style={{ color:"#27500A", fontSize:13 }} />
                      }
                    </span>
                    <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</span>
                    <span style={{ color:"var(--color-text-secondary)" }}>{c.cv}</span>
                    <span style={{ color:"var(--color-text-secondary)" }}>R$ {(c.fat||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
                    <span style={{ color:"var(--color-text-secondary)" }}>{c.tp}</span>
                  </div>
                ))}
                {preview.length > 8 && (
                  <div style={{ padding:"8px 12px", fontSize:12, color:"var(--color-text-tertiary)", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
                    … e mais {preview.length - 8} clientes
                  </div>
                )}
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button onClick={handleImport} style={{ background:"var(--color-text-primary)", color:"var(--color-background-primary)", border:"none", padding:"8px 20px", fontSize:13 }}>
                  <i className="ti ti-check" /> Confirmar ({nInsert > 0 ? `${nInsert} nov${nInsert>1?"os":"o"}` : ""}{nInsert>0&&nUpdate>0?", ":""}{nUpdate > 0 ? `${nUpdate} atualiz.` : ""})
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="manual" && (
        <div>
          <FInput label="Nome do Cliente *" value={form.n} onChange={v=>set("n",v)} />

          {/* Badge de upsert no cadastro manual */}
          {manualExists && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, marginTop:4, padding:"8px 12px", background:"#E6F1FB", borderRadius:8, fontSize:13, color:"#0C447C" }}>
              <i className="ti ti-refresh" style={{ fontSize:15 }} />
              Cliente <strong>{manualExists.n}</strong> já existe — os campos preenchidos irão <strong>atualizar</strong> o registro existente.
            </div>
          )}

          <FRow>
            <FInput label="Data Aceite" value={form.ac} onChange={v=>set("ac",v)} type="date" />
            <FInput label="Faturamento Mensal (R$)" value={form.fat} onChange={v=>set("fat",v)} type="number" />
          </FRow>
          <FRow>
            <FInput label="Curva" value={form.cv} onChange={v=>set("cv",v)} select options={["S","A","B","C","D"]} />
            <FInput label="Tipo" value={form.tp} onChange={v=>set("tp",v)} select options={["REAL","PROJETO"]} />
          </FRow>
          <FRow>
            <FInput label="Risco Churn (0/1)" value={form.ch} onChange={v=>set("ch",v)} select options={["0","1"]} />
            <FInput label="Em Projeto (0/1)" value={form.pr} onChange={v=>set("pr",v)} select options={["0","1"]} />
            <FInput label="Issues Impeditivas" value={form.im} onChange={v=>set("im",v)} type="number" />
          </FRow>
          {error && <div style={{ color:"#E24B4A", fontSize:12, marginBottom:8 }}>{error}</div>}
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <button onClick={handleManualSave} style={{ background:"var(--color-text-primary)", color:"var(--color-background-primary)", border:"none", padding:"8px 20px", fontSize:13 }}>
              {manualExists ? <><i className="ti ti-refresh" /> Atualizar Cliente</> : <><i className="ti ti-plus" /> Cadastrar Cliente</>}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Cadastro rápido de cliente único (botão na aba Clientes)
function SingleClientModal({ onClose, onSave }) {
  const [form, setForm] = useState({ n:"", ac:"", fat:"0", tp:"REAL", cv:"B", ch:"0", pr:"0", im:"0" });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  function handleSave() {
    if (!form.n) return alert("Nome do cliente é obrigatório.");
    onSave({ ...form, fat:Number(form.fat), ch:Number(form.ch), pr:Number(form.pr), im:Number(form.im) });
    onClose();
  }
  return (
    <Modal title="Cadastrar / Atualizar Cliente" onClose={onClose} onSave={handleSave}>
      <FInput label="Nome do Cliente *" value={form.n} onChange={v=>set("n",v)} />
      <FRow><FInput label="Data Aceite" value={form.ac} onChange={v=>set("ac",v)} type="date" /><FInput label="Faturamento Mensal (R$)" value={form.fat} onChange={v=>set("fat",v)} type="number" /></FRow>
      <FRow><FInput label="Curva" value={form.cv} onChange={v=>set("cv",v)} select options={["S","A","B","C","D"]} /><FInput label="Tipo" value={form.tp} onChange={v=>set("tp",v)} select options={["REAL","PROJETO"]} /></FRow>
      <FRow><FInput label="Risco Churn (0/1)" value={form.ch} onChange={v=>set("ch",v)} select options={["0","1"]} /><FInput label="Em Projeto (0/1)" value={form.pr} onChange={v=>set("pr",v)} select options={["0","1"]} /><FInput label="Issues Impeditivas" value={form.im} onChange={v=>set("im",v)} type="number" /></FRow>
    </Modal>
  );
}

// ── PRIMITIVOS ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, children, wide }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"var(--color-background-primary)", borderRadius:16, border:"0.5px solid var(--color-border-tertiary)", padding:24, width:"92%", maxWidth: wide ? 720 : 560, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontWeight:500, fontSize:16 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}><i className="ti ti-x" style={{ fontSize:18 }} aria-hidden /></button>
        </div>
        {children}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:20 }}>
          <button onClick={onClose}>Fechar</button>
          {onSave && (
            <button onClick={onSave} style={{ background:"var(--color-text-primary)", color:"var(--color-background-primary)", border:"none" }}>Salvar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function FRow({ children }) {
  const count = Array.isArray(children) ? children.length : 1;
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(${count},1fr)`, gap:12, marginBottom:12 }}>{children}</div>;
}

function FInput({ label, value, onChange, type="text", select, options }) {
  return (
    <div style={{ marginBottom:0 }}>
      <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>{label}</div>
      {select
        ? <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%" }}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%", boxSizing:"border-box" }} />
      }
    </div>
  );
}
