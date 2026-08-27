# API de Integração — Importação de Issues e Clientes

Webservice para sistemas externos inserirem/atualizarem **issues** e **clientes** no Teknisa Prioritizer sem passar pela importação manual de planilha. O comportamento é equivalente ao das duas planilhas do sistema (issues e clientes): você só precisa enviar os campos que possui informação; o que não for enviado permanece como já estava salvo.

Base URL: `https://teknisa-prioritizer-production.up.railway.app/api`

---

## Autenticação

Envie a chave de integração no header `X-API-Key` em toda requisição:

```
X-API-Key: <chave fornecida pela Teknisa>
```

Não é necessário login/senha de operador. A chave dá acesso equivalente a um operador Administrador. Guarde-a como segredo — qualquer requisição com a chave correta pode criar/atualizar issues e clientes.

Requisições sem `X-API-Key` (ou com header inválido) recebem `401 Unauthorized`.

---

## Contrato de merge (regra mais importante)

Em toda atualização (registro que já existe) ou criação (registro novo), campo a campo:

| O que você envia no JSON | O que acontece |
|---|---|
| Campo **ausente** do JSON, ou enviado como `null` | **Atualização**: mantém o valor já salvo no sistema, sem alterar.<br>**Criação**: aplica o valor padrão do sistema (quando existir; ver tabelas abaixo), senão fica vazio. |
| Campo enviado com **qualquer valor explícito** — inclusive `0`, `false` ou `""` | **Sempre sobrescreve** o valor atual (ou define o valor na criação). |

Ou seja: para não alterar um campo que uma issue/cliente já tem, simplesmente não o inclua no payload. Para realmente zerar/limpar um campo, envie o valor explícito correspondente (`0`, `false`, `""`, conforme o tipo).

Essa é exatamente a mesma regra usada pelas duas planilhas de importação do sistema — célula vazia = "não informado", nunca apaga dado existente.

---

## Issues

### Identificação do registro

O campo `id` identifica a issue de forma exclusiva. Se já existir uma issue com esse `id`, a requisição **atualiza** essa issue (aplicando o contrato de merge acima). Se não existir, **cria** uma issue nova com esse `id`.

### Campos

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | inteiro | sim | Identificador único da issue (o mesmo do sistema de origem/chamados). |
| `nome` | string | sim | Sempre sobrescreve — não tem "modo preservar". |
| `categoria` | string | não | Texto livre (ex.: "Erro - prioridade alta"). |
| `cliente` | string | não | Nome do cliente **como está no chamado**. Não precisa bater exatamente com o cadastro de Clientes — o sistema tenta casar por nome/De-Para; se não achar, a issue fica com curva "Sem classificação" até o cliente ser cadastrado ou o De-Para ajustado. |
| `produto` | string | não | Criação: default `"Teknisa HCM"`. Se enviado junto com `segmentoId` e o produto não existir, ele é criado automaticamente. |
| `estrutura` | string | não | Estrutura do produto (subnível). Se enviado junto com `segmentoId` e não existir, é criada automaticamente. |
| `status` | string | não | Criação: default `"Backlog"`. |
| `dataAbertura` | string (ISO `AAAA-MM-DD` ou datetime ISO) | não | Data de abertura da issue. |
| `roadmap` | boolean | não | Criação: default `false`. |
| `atendeMultiplos` | boolean | não | Atende mais de um cliente. Criação: default `false`. |
| `valor` | número | não | Valor financeiro associado à issue. |
| `curva` | string (`S`\|`A`\|`B`\|`C`\|`D`) | não | Curva manual da própria issue. **Sem default na criação** — se não informado e o cliente não tiver curva conhecida, a issue nasce "Sem classificação" (por desenho: evita que o sistema esconda a falta de dado atrás de um valor forjado). |
| `sprint` | string (até 50 caracteres) | não | Nome da sprint (ex.: `"HCM36"`). Valores maiores que 50 caracteres são truncados automaticamente. Filtrável na tela de Issues Priorizadas, inclusive por "sem sprint informada". |
| `observacao` | string | não | — |
| `descricao` | string | não | — |
| `impeditiva` | boolean | não | Criação: default `false`. |
| `aprovacao` | string (`"Sim"`\|`"Não"`) | não | — |
| `motivoReprovacao` | string | não | — |
| `segmentoId` | inteiro | não | Usado só para criar `produto`/`estrutura` novos automaticamente, se necessário. Não é um campo salvo na issue. |

### `POST /api/issues` — uma issue por vez

```bash
curl -X POST "https://teknisa-prioritizer-production.up.railway.app/api/issues" \
  -H "X-API-Key: <chave>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 700123,
    "nome": "Erro no cálculo de férias",
    "categoria": "Erro - prioridade alta",
    "cliente": "Cliente Exemplo Ltda.",
    "produto": "Teknisa HCM",
    "status": "Backlog",
    "dataAbertura": "2026-03-01",
    "impeditiva": true,
    "sprint": "HCM36",
    "descricao": "Descrição detalhada do problema."
  }'
```

Resposta `200`: o registro salvo (objeto `Issue` completo).
Resposta `400`: `{ "error": "id e nome são obrigatórios" }` (ou outra mensagem de validação).

### `POST /api/issues/bulk` — lote (recomendado para integrações)

Processa uma lista inteira numa única requisição (mais eficiente e evita limites de conexões simultâneas em lotes grandes).

```bash
curl -X POST "https://teknisa-prioritizer-production.up.railway.app/api/issues/bulk" \
  -H "X-API-Key: <chave>" \
  -H "Content-Type: application/json" \
  -d '{
    "segmentoId": 1,
    "issues": [
      { "id": 700123, "nome": "Erro no cálculo de férias", "impeditiva": true },
      { "id": 700124, "nome": "Dúvida sobre rescisão", "categoria": "Dúvida" }
    ]
  }'
```

Resposta `200`:
```json
{ "total": 2, "succeeded": 2, "failed": [] }
```

Se algum item falhar (ex.: `id`/`nome` ausente), os demais continuam sendo processados normalmente:
```json
{ "total": 2, "succeeded": 1, "failed": [ { "id": 700124, "error": "id e nome são obrigatórios" } ] }
```

---

## Clientes

### Identificação do registro

O campo `nome` identifica o cliente de forma exclusiva (deve ser exatamente o mesmo texto usado no cadastro). Se já existir um cliente com esse nome, a requisição **atualiza** o cliente existente; caso contrário, **cria** um cliente novo.

### Campos

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `nome` | string | sim | Chave de identificação do cliente. Sempre sobrescreve — não tem "modo preservar". |
| `codigo` | string | não | Código interno do cliente. |
| `aceite` | string (ISO `AAAA-MM-DD`) | não | Data de aceite/entrada do cliente. |
| `faturamento` | número | não | **Só é aplicado se a chave de API tiver privilégio de Administrador** (a chave de integração tem). Fica preservado normalmente pelo contrato de merge. |
| `tipo` | string (`"REAL"`\|`"PROJETO"`) | não | Criação: default `"REAL"`. |
| `curva` | string (`S`\|`A`\|`B`\|`C`\|`D`) | não | Criação: default `"B"`. |
| `riscoChurn` | boolean | não | Criação: default `false`. |
| `projeto` | boolean | não | Cliente em projeto. Criação: default `false`. |

### `POST /api/clients` — um cliente por vez

```bash
curl -X POST "https://teknisa-prioritizer-production.up.railway.app/api/clients" \
  -H "X-API-Key: <chave>" \
  -H "Content-Type: application/json" \
  -d '{ "nome": "Cliente Exemplo Ltda.", "curva": "A", "riscoChurn": false }'
```

### `POST /api/clients/bulk` — lote (recomendado para integrações)

```bash
curl -X POST "https://teknisa-prioritizer-production.up.railway.app/api/clients/bulk" \
  -H "X-API-Key: <chave>" \
  -H "Content-Type: application/json" \
  -d '{
    "clients": [
      { "nome": "Cliente Exemplo Ltda.", "curva": "A" },
      { "nome": "Outro Cliente S.A.", "codigo": "OC-001" }
    ]
  }'
```

Resposta `200`:
```json
{ "total": 2, "succeeded": 2, "failed": [] }
```
Itens com falha (ex.: `nome` ausente) aparecem em `failed`, sem interromper os demais.

---

## Erros

| Status | Quando acontece |
|---|---|
| `401` | `X-API-Key` ausente ou inválido. |
| `400` | Payload inválido (ex.: `id`/`nome` ausente numa issue, `nome` ausente num cliente, `issues`/`clients` ausente ou vazio no lote). |
| `500` | Erro inesperado no servidor. |

---

## Observações importantes

- **Cliente da issue vs. cadastro de Clientes**: o campo `cliente` da issue é texto livre — não precisa ser cadastrado antes. Se o nome não bater com nenhum cliente cadastrado (nem via De-Para), a issue simplesmente fica sem a classificação de curva do cliente ("Sem classificação") até isso ser resolvido; ela continua sendo salva e priorizada pelos demais critérios normalmente.
- **`produto`/`estrutura` autocriados**: se você enviar `segmentoId` junto com `produto` e/ou `estrutura`, e eles ainda não existirem, o sistema os cria automaticamente vinculados a esse segmento.
- **Sem endpoint de exclusão** via essa API no momento — issues e clientes só podem ser criados/atualizados; exclusão continua sendo feita pela interface do sistema.
- **Faturamento** de cliente só é alterado com privilégio de Administrador — a chave de integração tem esse privilégio, então funciona normalmente ao enviar o campo `faturamento`.
