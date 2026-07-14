
import { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

const API = (import.meta.env.VITE_API_URL ?? '') + '/api'

function appIssueToApi(i) {
  return {
    id: i.id, nome: i.n, categoria: i.cat ?? null, cliente: i.cl ?? null,
    produto: i.prod ?? null, status: i.st ?? null, dataAbertura: i.dt ?? null,
    roadmap: i.rm, atendeMultiplos: i.mc, valor: i.val ?? null,
    curva: i.curva ?? null, observacao: i.ob ?? null,
    impeditiva: !!i.imp,
    aprovacao: i.ap ?? null, motivoReprovacao: i.mr ?? null,
  }
}
function apiIssueToApp(i) {
  return {
    id: i.id, n: i.nome, cat: i.categoria, cl: i.cliente, prod: i.produto,
    st: i.status, dt: i.dataAbertura ? i.dataAbertura.slice(0, 10) : null,
    rm: i.roadmap ? 1 : 0, mc: i.atendeMultiplos ? 1 : 0,
    val: i.valor, curva: i.curva, ob: i.observacao,
    seg: i.segmento ?? null, segOrd: i.segmentoOrdem ?? 999,
    imp: i.impeditiva ? 1 : 0,
    ap: i.aprovacao ?? null, mr: i.motivoReprovacao ?? null,
  }
}
function appClientToApi(c) {
  return {
    nome: c.n, aceite: c.ac ?? null, faturamento: c.fat ?? null,
    tipo: c.tp ?? null, curva: c.cv ?? null, riscoChurn: c.ch,
    projeto: c.pr, codigo: c.codigo ?? null,
  }
}
function apiClientToApp(c) {
  return {
    id: c.id, n: c.nome, ac: c.aceite ? c.aceite.slice(0, 10) : null,
    fat: c.faturamento, tp: c.tipo, cv: c.curva,
    ch: c.riscoChurn ? 1 : 0, pr: c.projeto ? 1 : 0, im: c.qtdImpeditivas,
    codigo: c.codigo ?? null,
    fatSegs: (c.faturamentoSegmentos ?? []).map(fs => ({ id: fs.id, segmentoId: fs.segmentoId, valor: fs.valor })),
  }
}


// ── helpers ──────────────────────────────────────────────────────────────────
const DONE_STATUS_KEYS = new Set(["concluída","concluida","em teste","testado","testada","aguardando cliente","homologado","homologada"]);
function isDone(st) { return st ? DONE_STATUS_KEYS.has(st.toLowerCase().trim()) : false; }
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
  const isImpeditiva = issue.imp ? 1 : 0;
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
    if (isProjeto && isImpeditiva) reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    if (isRoadmap && !isTeknisa) reasons.push("Roadmap/Inovação");
    return { group:1, subScore:[cvOrd, -days], reasons };
  }
  if (churn && ["S","A","B"].includes(curva)) {
    reasons.push(`Risco iminente de churn (Curva ${curva})`);
    if (isProjeto && isImpeditiva) reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    if (isRoadmap && !isTeknisa) reasons.push("Roadmap/Inovação");
    return { group:2, subScore:[cvOrd, (isProjeto && isImpeditiva) ? 0 : 1], reasons };
  }
  if (isTeknisa && isRoadmap) {
    reasons.push("Demanda Interna Teknisa (Roadmap)");
    return { group:3, subScore:[1 - multi], reasons };
  }
  if (isRoadmap && !isTeknisa) {
    reasons.push("Roadmap/Inovação");
    if (isProjeto && isImpeditiva) reasons.push(`Issue impeditiva em projeto (Curva ${curva})`);
    return { group:4, subScore:[cvOrd, 1 - multi], reasons };
  }
  if (isProjeto && isImpeditiva && ["S","A","B"].includes(curva)) {
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

// Gera labels legíveis para todos os critérios ATIVOS que têm valor relevante na issue.
// Substitui o antigo _sc.reasons (que usava early-return e mostrava só 1 critério para erros).
function getActiveCriteriaReasons(issue, criteriaData) {
  if (!criteriaData || !criteriaData.length) return issue._sc.reasons;
  const active = criteriaData.filter(c => c.ativo).sort((a, b) => a.peso - b.peso);
  const CURVA_NAMES = { 0:"S", 1:"A", 2:"B", 3:"C", 4:"D" };
  const fmt2 = v => v.toLocaleString("pt-BR", { minimumFractionDigits:2, maximumFractionDigits:2 });
  const reasons = [];

  for (const crit of active) {
    const val = getFieldValue(issue, crit.tipo, crit.atributo);
    if (val == null) continue;
    let label = null;
    switch (crit.atributo) {
      case "isErro":          if (val === 1) label = crit.nome; break;
      case "slaEstourado":    if (val > 0) label = `${crit.nome}: ${val} dias além do limite`; break;
      case "diasAberto":      if (val > 0) label = `${crit.nome}: ${val} dias`; break;
      case "curva":           label = crit.tipo === "issue"
                                ? `${crit.nome}: ${issue._curva ?? "?"}`
                                : `${crit.nome}: ${CURVA_NAMES[val] ?? "?"}`;
                              break;
      case "impeditiva":      if (val === 1) label = crit.nome; break;
      case "roadmap":         if (val === 1) label = crit.nome; break;
      case "atendeMultiplos": if (val === 1) label = crit.nome; break;
      case "valor":           if (val > 0) label = `${crit.nome}: R$ ${fmt2(val)}`; break;
      case "segmento":        if (val < 999) label = `${crit.nome}: ${issue.seg ?? "?"}`; break;
      case "riscoChurn":      if (val === 1) label = crit.nome; break;
      case "projeto":         if (val === 1) label = crit.nome; break;
      case "qtdImpeditivas":  if (val > 0) label = `${crit.nome}: ${val}`; break;
      case "faturamento":     if (val > 0) label = `${crit.nome}: R$ ${fmt2(val)}`; break;
      case "categoria":
      case "status":          if (val && val.trim()) label = `${crit.nome}: ${val}`; break;
    }
    if (label) reasons.push(label);
  }
  return reasons.length > 0 ? reasons : issue._sc.reasons;
}

// ── CRITÉRIOS CONFIGURÁVEIS ───────────────────────────────────────────────────
// Atributos cuja direção tem significado especial (proxy numérico, não alfabético)
const CURVA_ATTRS    = new Set(["curva"]);
const SEGMENTO_ATTRS = new Set(["segmento"]);
const DIAS_ATTRS     = new Set(["slaEstourado","diasAberto"]);

function direcaoLabel(atributo, direcao) {
  if (CURVA_ATTRS.has(atributo)) {
    return direcao === "asc" ? "S → A → B → C → D" : "D → C → B → A → S";
  }
  if (SEGMENTO_ATTRS.has(atributo)) {
    return direcao === "asc" ? "↑ Por ordem de prioridade do segmento" : "↓ Ordem inversa do segmento";
  }
  if (DIAS_ATTRS.has(atributo)) {
    return direcao === "desc" ? "↓ Mais dias primeiro (maior urgência)" : "↑ Menos dias primeiro";
  }
  return direcao === "desc" ? "↓ Decrescente" : "↑ Crescente";
}

function direcaoOptionsFor(atributo) {
  if (CURVA_ATTRS.has(atributo)) {
    return [
      { value:"asc",  label:"S → A → B → C → D  (estratégico primeiro)" },
      { value:"desc", label:"D → C → B → A → S  (menor curva primeiro)" },
    ];
  }
  if (SEGMENTO_ATTRS.has(atributo)) {
    return [
      { value:"asc",  label:"↑ Por ordem de prioridade do segmento" },
      { value:"desc", label:"↓ Ordem inversa do segmento" },
    ];
  }
  if (DIAS_ATTRS.has(atributo)) {
    return [
      { value:"desc", label:"↓ Mais dias primeiro (maior urgência)" },
      { value:"asc",  label:"↑ Menos dias primeiro" },
    ];
  }
  return [
    { value:"desc", label:"↓ Decrescente" },
    { value:"asc",  label:"↑ Crescente" },
  ];
}

const ATRIBUTOS_DISPONIVEIS = [
  { tipo:"issue",   value:"segmento",         label:"Segmento" },
  { tipo:"issue",   value:"isErro",          label:"É Erro" },
  { tipo:"issue",   value:"slaEstourado",     label:"SLA Estourado" },
  { tipo:"issue",   value:"diasAberto",       label:"Dias em Aberto" },
  { tipo:"issue",   value:"curva",            label:"Curva da Issue" },
  { tipo:"issue",   value:"impeditiva",        label:"É Impeditiva" },
  { tipo:"issue",   value:"roadmap",          label:"É Roadmap" },
  { tipo:"issue",   value:"atendeMultiplos",  label:"Atende Múltiplos Clientes" },
  { tipo:"issue",   value:"valor",            label:"Valor (R$)" },
  { tipo:"issue",   value:"categoria",        label:"Categoria (texto)" },
  { tipo:"issue",   value:"status",           label:"Status (texto)" },
  { tipo:"cliente", value:"curva",            label:"Curva do Cliente" },
  { tipo:"cliente", value:"faturamento",      label:"Faturamento" },
  { tipo:"cliente", value:"riscoChurn",       label:"Risco de Churn" },
  { tipo:"cliente", value:"projeto",          label:"Em Projeto" },
  { tipo:"cliente", value:"qtdImpeditivas",   label:"Qtd. Impeditivas" },
];

function getFieldValue(enrichedIssue, tipo, atributo) {
  if (tipo === "issue") {
    switch (atributo) {
      case "segmento":        return enrichedIssue.segOrd ?? 999;
      case "isErro":          return enrichedIssue.cat && enrichedIssue.cat.startsWith("Erro") ? 1 : 0;
      case "slaEstourado":    { const sla = SLA_DIAS[enrichedIssue._curva]; if (!sla) return 0; const d = daysSince(enrichedIssue.dt); return d >= sla ? d - sla : 0; }
      case "diasAberto":      return daysSince(enrichedIssue.dt);
      case "curva":           return CURVE_ORDER[enrichedIssue.curva] ?? 9;
      case "impeditiva":      return enrichedIssue.imp ?? 0;
      case "roadmap":         return enrichedIssue.rm ? 1 : 0;
      case "atendeMultiplos": return enrichedIssue.mc ? 1 : 0;
      case "valor":           return enrichedIssue.val ?? 0;
      case "categoria":       return enrichedIssue.cat ?? "";
      case "status":          return enrichedIssue.st ?? "";
      default: return null;
    }
  } else {
    const c = enrichedIssue._client;
    if (!c) return 0;
    switch (atributo) {
      case "curva":          return CURVE_ORDER[c.cv] ?? 9;
      case "faturamento":    return c.fat ?? 0;
      case "riscoChurn":     return c.ch ? 1 : 0;
      case "projeto":        return c.pr ? 1 : 0;
      case "qtdImpeditivas": return c.im ?? 0;
      default: return null;
    }
  }
}

function sortByCriteria(issues, criteriaData) {
  const active = [...criteriaData].filter(c => c.ativo).sort((a, b) => a.peso - b.peso);
  if (!active.length) return issues;
  return [...issues].sort((a, b) => {
    for (const crit of active) {
      const av = getFieldValue(a, crit.tipo, crit.atributo);
      const bv = getFieldValue(b, crit.tipo, crit.atributo);
      if (av == null && bv == null) continue;
      const mul = crit.direcao === "asc" ? 1 : -1;
      if (av == null) return mul;
      if (bv == null) return -mul;
      const cmp = typeof av === "string" ? av.localeCompare(bv, "pt-BR", {sensitivity:"base"}) : av - bv;
      if (cmp !== 0) return mul * cmp;
    }
    return 0;
  });
}

// ── ESTILOS ───────────────────────────────────────────────────────────────────
const GROUP_STYLE = [
  { label:"Erro",               bg:"#FCEBEB", color:"#A32D2D", border:"#E24B4A" },
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
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
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

// ── PASSWORD MODAL ────────────────────────────────────────────────────────────
const SENHA_OP = "23Nov82**"

function PasswordModal({ title, message, onConfirm, onClose }) {
  const [senha, setSenha] = useState("")
  const [erro, setErro]   = useState(false)

  function tentar() {
    if (senha === SENHA_OP) { onConfirm() }
    else { setErro(true); setSenha("") }
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000 }}>
      <div style={{ background:"var(--color-background-primary)", borderRadius:16, border:"0.5px solid var(--color-border-tertiary)", padding:28, width:380 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#FAEEDA", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className="ti ti-lock" style={{ fontSize:18, color:"#854F0B" }} />
          </div>
          <div style={{ fontWeight:500, fontSize:15 }}>{title}</div>
        </div>
        <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginBottom:16 }}>{message}</div>
        <input
          type="password" value={senha} autoFocus
          onChange={e => { setSenha(e.target.value); setErro(false) }}
          onKeyDown={e => e.key === "Enter" && tentar()}
          placeholder="Senha de operação"
          style={{ width:"100%", padding:"8px 10px", borderRadius:8, fontSize:13, boxSizing:"border-box",
            border:`0.5px solid ${erro ? "#E24B4A" : "var(--color-border-secondary)"}`,
            background:"var(--color-background-secondary)", marginBottom: erro ? 6 : 20 }}
        />
        {erro && <div style={{ fontSize:12, color:"#A32D2D", marginBottom:16 }}>Senha incorreta. Tente novamente.</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:13, fontWeight:500 }}>Cancelar</button>
          <button onClick={tentar} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#854F0B", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:500 }}>Confirmar</button>
        </div>
      </div>
    </div>
  )
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
            n:      String(r[0] || "").trim(),
            ac,
            fat:    Number(r[2]) || 0,
            tp:     String(r[3] || "REAL").trim().toUpperCase(),
            cv:     String(r[4] || "B").trim().toUpperCase(),
            ch:     Number(r[5]) || 0,
            pr:     Number(r[6]) || 0,
            codigo: String(r[7] || "").trim() || null,
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
  const [issuesData, setIssuesData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [deparaData, setDeparaData]   = useState([]);
  const [filters, setFilters]       = useState({ status:[], curva:[], categoria:[], produto:[], segmento:[], aprovacao:[], search:"" });
  const [showDone, setShowDone]     = useState(false);
  const [importModal, setImportModal] = useState(null); // "issue" | "client" | null
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete]         = useState(false);
  const [senhaDeleteIssues, setSenhaDeleteIssues] = useState(false);
  const [impdConfirm, setImpdConfirm]             = useState(false);
  const [loading, setLoading]            = useState(true);
  const [criteriaData, setCriteriaData]    = useState([]);
  const [segmentosData, setSegmentosData]  = useState([]);
  const [selectedSegmento, setSelectedSegmento] = useState(null); // { id, nome }

  useEffect(() => {
    Promise.all([
      fetch(API + '/issues'),
      fetch(API + '/clients'),
      fetch(API + '/depara'),
      fetch(API + '/segmentos'),
    ])
      .then(rs => Promise.all(rs.map(r => r.json())))
      .then(([iss, cl, dp, segs]) => {
        setIssuesData(iss.map(apiIssueToApp))
        setClientsData(cl.map(apiClientToApp))
        setDeparaData(dp.map(d => ({ c: d.nomeCliente, i: d.nomeClienteIssue })))
        setSegmentosData(segs)
        // Seleciona o primeiro segmento que tiver critérios, ou o primeiro da lista
        if (segs.length) setSelectedSegmento(segs[0])
      })
      .catch(e => console.error('Erro ao carregar dados:', e))
      .finally(() => setLoading(false))
  }, [])

  // Carrega critérios do segmento selecionado (ou todos quando nenhum segmento está ativo)
  useEffect(() => {
    const url = selectedSegmento
      ? API + '/criterios?segmentoId=' + selectedSegmento.id
      : API + '/criterios'
    fetch(url)
      .then(r => r.json())
      .then(crit => setCriteriaData(crit))
      .catch(e => console.error('Erro ao carregar critérios:', e))
  }, [selectedSegmento])

  const enriched = useMemo(() => issuesData.map(issue => {
    const client = findClient(issue.cl, clientsData, deparaData);
    const curva  = client ? client.cv : (issue.curva || "B");
    const sc     = computeScore(issue, client);
    return { ...issue, _client:client, _curva:curva, _sc:sc };
  }), [issuesData, clientsData, deparaData]);

  const segmentEnriched = useMemo(() => {
    if (!selectedSegmento) return enriched;
    return enriched.filter(i => i.seg === selectedSegmento.nome);
  }, [enriched, selectedSegmento]);

  const sorted = useMemo(() => sortByCriteria(segmentEnriched, criteriaData), [segmentEnriched, criteriaData]);

  function applyFilters(list, especOnly = false) {
    return list.filter(issue => {
      if (especOnly && issue.st !== "Especificação") return false;
      if (showDone  && !isDone(issue.st)) return false;
      if (!showDone &&  isDone(issue.st)) return false;
      if (filters.status.length    && !filters.status.includes(issue.st))     return false;
      if (filters.curva.length     && !filters.curva.includes(issue._curva))  return false;
      if (filters.categoria.length && !filters.categoria.includes(issue.cat)) return false;
      if (filters.produto.length   && !filters.produto.includes(issue.prod))  return false;
      if (filters.segmento.length  && !filters.segmento.includes(issue.seg))  return false;
      if (filters.aprovacao.length && !filters.aprovacao.includes(issue.ap ?? "(Não analisado)")) return false;
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
    const active = sorted.filter(x => !isDone(x.st));
    return {
      total:    active.length,
      critical: active.filter(x => x._sc.group === 0).length,
      sla:      active.filter(x => x._sc.group === 1).length,
      churn:    active.filter(x => x._sc.group <= 2 && x._sc.reasons.some(r => r.includes("churn"))).length,
      espec:    active.filter(x => x.st === "Especificação").length,
    };
  }, [sorted]);

  async function handleAddIssues(issues) {
    await Promise.allSettled(
      issues.map(i => fetch(API + "/issues", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...appIssueToApi(i), segmentoId: selectedSegmento?.id }),
      }))
    )
    const fresh = await fetch(API + '/issues').then(r => r.json())
    setIssuesData(fresh.map(apiIssueToApp))
  }
  async function handleAddClients(clients) {
    await Promise.allSettled(
      clients.map(c => fetch(API + "/clients", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appClientToApi(c)),
      }))
    )
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

  async function handleSaveFatSeg(clienteId, segmentoId, valor) {
    const res = await fetch(API + "/faturamento-segmentos", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId: Number(clienteId), segmentoId: Number(segmentoId), valor: Number(valor) }),
    });
    const data = await res.json();
    setClientsData(prev => prev.map(c => {
      if (c.id !== clienteId) return c;
      const fatSegs = c.fatSegs ?? [];
      const idx = fatSegs.findIndex(fs => fs.segmentoId === segmentoId);
      if (idx >= 0) return { ...c, fatSegs: fatSegs.map((fs, i) => i === idx ? { ...fs, valor, id: data.id } : fs) };
      return { ...c, fatSegs: [...fatSegs, { id: data.id, segmentoId, valor }] };
    }));
  }

  async function handleDeleteFatSeg(fatSegId, clienteId, segmentoId) {
    await fetch(API + "/faturamento-segmentos/" + fatSegId, { method: "DELETE" });
    setClientsData(prev => prev.map(c => {
      if (c.id !== clienteId) return c;
      return { ...c, fatSegs: (c.fatSegs ?? []).filter(fs => fs.id !== fatSegId) };
    }));
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
  async function handleDeleteSelected() {
    await Promise.allSettled(
      [...selectedIds].map(id => fetch(API + "/issues/" + id, { method: "DELETE" }))
    )
    setIssuesData(prev => prev.filter(x => !selectedIds.has(x.id)));
    setSelectedIds(new Set());
    setConfirmDelete(false);
  }
  async function handleSetImpeditiva(ids, impeditiva) {
    await fetch(API + '/issues/bulk-impeditiva', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...ids], impeditiva }),
    });
    setIssuesData(prev => prev.map(x => ids.has(x.id) ? { ...x, imp: impeditiva ? 1 : 0 } : x));
    setSelectedIds(new Set());
    fetch(API + '/clients').then(r => r.json()).then(cl => setClientsData(cl.map(apiClientToApp))).catch(() => {});
  }

  async function handleToggleCriterio(id) {
    const crit = criteriaData.find(c => c.id === id);
    const updated = { ...crit, ativo: !crit.ativo };
    setCriteriaData(prev => prev.map(c => c.id === id ? updated : c));
    await fetch(API + "/criterios/" + id, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: updated.ativo }),
    });
  }
  async function handleSaveCriterio(form) {
    const maxPeso = criteriaData.length ? Math.max(...criteriaData.map(c => c.peso)) : -1;
    const body = {
      ...form,
      peso: form.peso !== undefined && form.peso !== "" ? Number(form.peso) : maxPeso + 1,
      ativo: true, padrao: false,
      segmentoId: selectedSegmento?.id,
    };
    const res  = await fetch(API + "/criterios", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const saved = await res.json();
    setCriteriaData(prev => [...prev, saved]);
  }
  async function handleDeleteCriterio(id) {
    await fetch(API + "/criterios/" + id, { method: "DELETE" });
    setCriteriaData(prev => prev.filter(c => c.id !== id));
  }
  async function handleReorderCriterio(id, direction) {
    const sortedCrit = [...criteriaData].sort((a, b) => a.peso - b.peso);
    const idx = sortedCrit.findIndex(c => c.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedCrit.length) return;
    const updates = [
      { id: sortedCrit[idx].id,    peso: sortedCrit[swapIdx].peso },
      { id: sortedCrit[swapIdx].id, peso: sortedCrit[idx].peso },
    ];
    setCriteriaData(prev => prev.map(c => {
      const u = updates.find(x => x.id === c.id);
      return u ? { ...c, peso: u.peso } : c;
    }));
    await Promise.all(updates.map(u =>
      fetch(API + "/criterios/" + u.id, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peso: u.peso }),
      })
    ));
  }

  const hasFilters = filters.status.length || filters.curva.length || filters.categoria.length || filters.produto.length || filters.segmento.length || filters.aprovacao.length || filters.search;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'system-ui,sans-serif', gap:12 }}>
      <i className="ti ti-loader-2" style={{ fontSize:28, color:'var(--color-text-secondary)', animation:'spin 1s linear infinite' }} />
      <span style={{ color:'var(--color-text-secondary)' }}>Carregando…</span>
    </div>
  )

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", minHeight:"100vh", background:"var(--color-background-tertiary)" }}>
      <div style={{ background:"var(--color-background-primary)", borderBottom:"0.5px solid var(--color-border-tertiary)", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <i className="ti ti-rocket" style={{ fontSize:16, color:"#fff" }} aria-hidden />
            </div>
            <div>
              <div style={{ fontWeight:500, fontSize:15, lineHeight:1.2 }}>Teknisa Prioritizer</div>
              <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>Teknisa · Priorização de Issues</div>
            </div>
            {segmentosData.length > 0 && (
              <div style={{ marginLeft:12, display:"flex", alignItems:"center", gap:6 }}>
                <i className="ti ti-building-community" style={{ fontSize:13, color:"var(--color-text-tertiary)" }} />
                <select
                  value={selectedSegmento?.id ?? ""}
                  onChange={e => {
                    const seg = e.target.value ? segmentosData.find(s => s.id === Number(e.target.value)) : null;
                    setSelectedSegmento(seg ?? null);
                  }}
                  style={{ fontSize:13, fontWeight:500, border:"0.5px solid var(--color-border-secondary)", borderRadius:6, padding:"4px 8px", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", cursor:"pointer" }}
                >
                  <option value="">Todos os segmentos</option>
                  {segmentosData.map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {selectedIds.size > 0 && (<>
              <button onClick={() => setImpdConfirm(true)} style={{ fontSize:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, background:"#FFF7ED", color:"#92400E", border:"0.5px solid #FCD34D88" }}>
                <i className="ti ti-ban" style={{ fontSize:14 }} aria-hidden /> Impeditiva ({selectedIds.size})
              </button>
              <button onClick={() => setConfirmDelete(true)} style={{ fontSize:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, background:"#FCEBEB", color:"#A32D2D", borderColor:"#E24B4A66" }}>
                <i className="ti ti-trash" style={{ fontSize:14 }} aria-hidden /> Excluir {selectedIds.size} issue{selectedIds.size > 1 ? "s" : ""}
              </button>
            </>)}
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
        {tab==="dashboard"    && <DashboardTab stats={stats} issues={sorted} enriched={segmentEnriched} criteriaData={criteriaData} segmento={selectedSegmento} />}
        {(() => { const rs = selectedSegmento?.nome === "HCM"; return (<>
        {tab==="issues"       && <IssuesTab issues={filteredIssues} allIssues={sorted} filters={filters} setFilters={setFilters} showDone={showDone} setShowDone={setShowDone} issuesData={issuesData} hasFilters={!!hasFilters} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} onEditSave={handleAddIssues} requireSenha={rs} segmentosData={segmentosData} criteriaData={criteriaData} selectedSegmento={selectedSegmento} />}
        {tab==="especificacao"&& <IssuesTab issues={filteredEspec}  allIssues={sorted.filter(x=>x.st==="Especificação")} filters={filters} setFilters={setFilters} showDone={showDone} setShowDone={setShowDone} issuesData={issuesData} hasFilters={!!hasFilters} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} especMode onEditSave={handleAddIssues} requireSenha={rs} segmentosData={segmentosData} criteriaData={criteriaData} selectedSegmento={selectedSegmento} />}
        {tab==="clientes"     && <ClientsTab clients={clientsData} onAddSingle={c => handleAddClients([c])} requireSenha={rs} segmentosData={segmentosData} onSaveFatSeg={handleSaveFatSeg} onDeleteFatSeg={handleDeleteFatSeg} />}
        {tab==="criterios"    && <CriteriosTab criteriaData={criteriaData} issues={filteredIssues} onToggle={handleToggleCriterio} onSave={handleSaveCriterio} onDelete={handleDeleteCriterio} onReorder={handleReorderCriterio} requireSenha={rs} />}
        </>); })()}
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
              <button onClick={() => setConfirmDelete(false)} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:13, fontWeight:500 }}>Cancelar</button>
              <button onClick={() => { setConfirmDelete(false); selectedSegmento?.nome === "HCM" ? setSenhaDeleteIssues(true) : handleDeleteSelected(); }} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#A32D2D", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:500 }}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {senhaDeleteIssues && (
        <PasswordModal
          title="Confirmar exclusão"
          message={`Informe a senha para excluir ${selectedIds.size} issue${selectedIds.size > 1 ? "s" : ""} permanentemente.`}
          onConfirm={() => { setSenhaDeleteIssues(false); handleDeleteSelected(); }}
          onClose={() => setSenhaDeleteIssues(false)}
        />
      )}
      {impdConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
          <div style={{ background:"var(--color-background-primary)", borderRadius:16, border:"0.5px solid var(--color-border-tertiary)", padding:28, width:400, textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:"#FFF7ED", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <i className="ti ti-ban" style={{ fontSize:24, color:"#92400E" }} />
            </div>
            <div style={{ fontWeight:500, fontSize:16, marginBottom:8 }}>Definir Impeditiva</div>
            <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginBottom:24 }}>
              O que deseja fazer com as <strong>{selectedIds.size} issue{selectedIds.size > 1 ? "s" : ""}</strong> selecionadas?
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={() => setImpdConfirm(false)} style={{ padding:"8px 16px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)" }}>Cancelar</button>
              <button onClick={() => { setImpdConfirm(false); handleSetImpeditiva(selectedIds, false); }} style={{ padding:"8px 16px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)" }}>
                <i className="ti ti-x" style={{ fontSize:13, marginRight:4 }} />Não Impeditiva
              </button>
              <button onClick={() => { setImpdConfirm(false); handleSetImpeditiva(selectedIds, true); }} style={{ padding:"8px 16px", borderRadius:8, background:"#92400E", color:"#fff", fontWeight:600 }}>
                <i className="ti ti-ban" style={{ fontSize:13, marginRight:4 }} />Marcar Impeditiva
              </button>
            </div>
          </div>
        </div>
      )}
      {importModal==="issue"  && <ImportIssueModal  onClose={() => setImportModal(null)} onSave={handleAddIssues}  existingIssues={issuesData} selectedSegmento={selectedSegmento} />}
      {importModal==="client" && <ImportClientModal onClose={() => setImportModal(null)} onSave={handleAddClients} existingClients={clientsData} />}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardTab({ stats, issues, enriched, criteriaData, segmento }) {
  const active = issues.filter(x => !isDone(x.st));
  const top    = active.slice(0, 10);

  const criteriaWithoutErro = criteriaData.filter(c => c.atributo !== "isErro");
  const topSemErro = sortByCriteria(
    enriched.filter(x => !isDone(x.st) && !(x.cat && x.cat.startsWith("Erro"))),
    criteriaWithoutErro
  ).slice(0, 10);

  const erroAtivo = criteriaData.some(c => c.atributo === "isErro" && c.ativo);

  function Top10Panel({ title, items, badge, badgeColor }) {
    return (
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:20, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <span style={{ fontWeight:500, fontSize:15 }}>{title}</span>
          {badge && (
            <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background: badgeColor + "22", color: badgeColor, border:`0.5px solid ${badgeColor}44` }}>
              {badge}
            </span>
          )}
        </div>
        {items.map((issue, i) => <IssueRow key={issue.id} issue={issue} rank={i + 1} compact criteriaData={criteriaData} />)}
      </div>
    );
  }

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

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Top10Panel
          title={segmento ? `Top 10 — ${segmento.nome}` : "Top 10 — Prioridade Geral"}
          items={top}
          badge={erroAtivo ? "incl. Erro" : undefined}
          badgeColor="#A32D2D"
        />
        <Top10Panel
          title="Top 10 — Sem Erro"
          items={topSemErro}
          badge="Erro excluído"
          badgeColor="#854F0B"
        />
      </div>
    </div>
  );
}

// ── ISSUE ROW ─────────────────────────────────────────────────────────────────
function IssueRow({ issue, rank, compact, selected, onToggle, onEdit, criteriaData }) {
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
        <span style={{ fontSize:11, color:"var(--color-text-tertiary)", whiteSpace:"nowrap", flexShrink:0 }}>#{issue.id}</span>
        <span style={{ background:gs.bg, color:gs.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, whiteSpace:"nowrap", border:`0.5px solid ${gs.border}44`, flexShrink:0 }}>{gs.label}</span>
        <span style={{ background:cb.bg, color:cb.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, border:`0.5px solid ${cb.border}44`, flexShrink:0 }}>Curva {issue._curva}</span>
        {issue.imp === 1 && <span style={{ background:"#FFF7ED", color:"#92400E", border:"0.5px solid #FCD34D88", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, flexShrink:0 }}>⛔ Impeditiva</span>}
        <span style={{ fontSize:13, fontWeight:500, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{issue.n}</span>
        <span style={{ fontSize:12, color:"var(--color-text-secondary)", whiteSpace:"nowrap", flexShrink:0 }}>{issue.cl}</span>
        <span style={{ fontSize:11, color:"var(--color-text-tertiary)", background:"var(--color-background-secondary)", borderRadius:4, padding:"1px 6px", whiteSpace:"nowrap", flexShrink:0 }}>{issue.st}</span>
        <i className={`ti ${expanded ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize:14, color:"var(--color-text-tertiary)", flexShrink:0 }} aria-hidden />
        </div>
        {onEdit && (
          <button
            onClick={e => { e.stopPropagation(); onEdit(issue); }}
            title="Editar issue"
            style={{ flexShrink:0, padding:"3px 6px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", background:"transparent", cursor:"pointer", color:"var(--color-text-tertiary)", display:"flex", alignItems:"center" }}
          >
            <i className="ti ti-pencil" style={{ fontSize:13 }} />
          </button>
        )}
      </div>
      {expanded && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"0.5px solid var(--color-border-tertiary)", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          <Field label="ID"                value={issue.id} />
          <Field label="Categoria"         value={issue.cat} />
          <Field label="Produto"           value={issue.prod} />
          <Field label="Data Abertura"     value={issue.dt} />
          <Field label="Dias em aberto"    value={days+" dias"} color={days>180?"#E24B4A":days>90?"#BA7517":undefined} />
          <Field label="É Impeditiva"      value={issue.imp ? "Sim" : "Não"} color={issue.imp ? "#92400E" : undefined} />
          <Field label="Roadmap"           value={issue.rm ? "Sim" : "Não"} />
          <Field label="Atende +1 cliente" value={issue.mc ? "Sim" : "Não"} />
          <Field label="Valor"             value={issue.val>0 ? `R$ ${issue.val.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}` : "—"} />
          <Field label="Faturamento do cliente" value={issue._client ? `R$ ${(issue._client.fat||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}` : "—"} />
          <Field label="Aprovação" value={issue.ap ?? "(Não analisado)"} color={issue.ap==="Não"?"#A32D2D":issue.ap==="Sim"?"#27500A":undefined} />
          {issue.ap==="Não" && issue.mr && <Field label="Motivo da reprovação" value={issue.mr} />}
          <div style={{ gridColumn:"1 / -1" }}>
            <div style={{ fontSize:11, color:"var(--color-text-tertiary)", marginBottom:4 }}>Critérios de Priorização</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {getActiveCriteriaReasons(issue, criteriaData).map(r => (
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
function IssuesTab({ issues, allIssues, filters, setFilters, showDone, setShowDone, issuesData, hasFilters, especMode, selectedIds, toggleSelect, toggleSelectAll, onEditSave, requireSenha, segmentosData, criteriaData, selectedSegmento }) {
  function sf(k, v) { setFilters(f => ({...f,[k]:v})); }
  const [issueSort, setIssueSort]         = useState({ field: null, dir: "asc" });
  const [editIssue, setEditIssue]         = useState(null);
  const [senhaEditIssue, setSenhaEditIssue] = useState(null);
  const [newIssueOpen, setNewIssueOpen]   = useState(false);
  function toggleIssueSort(field) {
    setIssueSort(s => s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" });
  }
  const displayedIssues = issueSort.field
    ? [...issues].sort((a, b) => {
        const mul = issueSort.dir === "asc" ? 1 : -1;
        const av = issueSort.field === "_curva" ? CURVE_ORDER[a._curva] ?? 9 : a[issueSort.field];
        const bv = issueSort.field === "_curva" ? CURVE_ORDER[b._curva] ?? 9 : b[issueSort.field];
        if (av == null && bv == null) return 0;
        if (av == null) return mul; if (bv == null) return -mul;
        return typeof av === "string" ? mul * av.localeCompare(bv, "pt-BR", {sensitivity:"base"}) : mul * (av - bv);
      })
    : issues;
  const allStatuses   = useMemo(() => [...new Set([...issuesData.map(x => x.st), "Homologado"])].filter(Boolean).sort(), [issuesData]);
  const allCategorias = useMemo(() => [...new Set(issuesData.map(x => x.cat))].sort(),  [issuesData]);
  const allProdutos   = useMemo(() => [...new Set(issuesData.map(x => x.prod))].sort(), [issuesData]);
  const allSegmentos  = useMemo(() => (segmentosData ?? []).map(s => s.nome).sort(),    [segmentosData]);

  return (
    <div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:16, marginBottom:16 }}>
        {/* Linha 1: busca + controles */}
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
          {!especMode && (
            <button
              onClick={() => setNewIssueOpen(true)}
              style={{ padding:"7px 14px", background:"var(--color-blue-600)", color:"#fff", border:"none", borderRadius:8, fontWeight:600, display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}
            >
              <i className="ti ti-plus" style={{ fontSize:14 }} /> Nova Issue
            </button>
          )}
          {hasFilters && (
            <button onClick={() => setFilters({ status:[], curva:[], categoria:[], produto:[], segmento:[], aprovacao:[], search:"" })} style={{ fontSize:12, whiteSpace:"nowrap" }}>
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
          {allSegmentos.length > 0 && (
            <MultiSelect
              placeholder="Segmento (todos)"
              options={allSegmentos}
              selected={filters.segmento}
              onChange={v => sf("segmento", v)}
            />
          )}
          <MultiSelect
            placeholder="Aprovação (todas)"
            options={["(Não analisado)", "Sim", "Não"]}
            selected={filters.aprovacao}
            onChange={v => sf("aprovacao", v)}
          />
        </div>
        {/* Tags de filtros ativos */}
        {hasFilters && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>
            {filters.curva.map(v => <FilterTag key={v} label={`Curva: ${v}`} onRemove={() => sf("curva", filters.curva.filter(x=>x!==v))} />)}
            {filters.status.map(v => <FilterTag key={v} label={`Status: ${v}`} onRemove={() => sf("status", filters.status.filter(x=>x!==v))} />)}
            {filters.categoria.map(v => <FilterTag key={v} label={v} onRemove={() => sf("categoria", filters.categoria.filter(x=>x!==v))} />)}
            {filters.produto.map(v => <FilterTag key={v} label={v} onRemove={() => sf("produto", filters.produto.filter(x=>x!==v))} />)}
            {filters.segmento.map(v => <FilterTag key={v} label={`Segmento: ${v}`} onRemove={() => sf("segmento", filters.segmento.filter(x=>x!==v))} />)}
            {filters.aprovacao.map(v => <FilterTag key={v} label={`Aprovação: ${v}`} onRemove={() => sf("aprovacao", filters.aprovacao.filter(x=>x!==v))} />)}
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
      <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, color:"var(--color-text-tertiary)", whiteSpace:"nowrap" }}>Ordenar:</span>
        {[["Score",null],["Curva","_curva"],["Nome","n"],["Cliente","cl"],["Status","st"],["Abertura","dt"]].map(([label,field]) => {
          const active = issueSort.field === field;
          const icon = active ? (issueSort.dir === "asc" ? "ti-sort-ascending" : "ti-sort-descending") : null;
          return (
            <button key={label} onClick={() => toggleIssueSort(field)}
              style={{ padding:"3px 10px", borderRadius:20, fontSize:11, cursor:"pointer", fontWeight: active ? 600 : 400,
                border: active ? "0.5px solid #185FA5" : "0.5px solid var(--color-border-secondary)",
                background: active ? "#EFF6FF" : "transparent",
                color: active ? "#185FA5" : "var(--color-text-secondary)",
                display:"flex", alignItems:"center", gap:3 }}>
              {label}{icon && <i className={`ti ${icon}`} style={{ fontSize:10 }} aria-hidden />}
            </button>
          );
        })}
      </div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:16 }}>
        {issues.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:"var(--color-text-tertiary)" }}>
            <i className="ti ti-search" style={{ fontSize:32, display:"block", marginBottom:8 }} aria-hidden />
            Nenhuma issue encontrada
          </div>
        )}
        {displayedIssues.map((issue,i) => <IssueRow key={issue.id} issue={issue} rank={i+1} selected={selectedIds && selectedIds.has(issue.id)} onToggle={toggleSelect} onEdit={onEditSave ? (i => requireSenha ? setSenhaEditIssue(i) : setEditIssue(i)) : undefined} criteriaData={criteriaData} />)}
      </div>
      {senhaEditIssue && (
        <PasswordModal
          title="Editar issue"
          message={`Informe a senha para editar a issue #${senhaEditIssue.id}.`}
          onConfirm={() => { setEditIssue(senhaEditIssue); setSenhaEditIssue(null); }}
          onClose={() => setSenhaEditIssue(null)}
        />
      )}
      {editIssue && (
        <EditIssueModal
          issue={editIssue}
          onClose={() => setEditIssue(null)}
          onSave={data => { onEditSave(data); setEditIssue(null); }}
        />
      )}
      {newIssueOpen && (
        <SingleIssueModal
          existingIssues={issuesData}
          selectedSegmento={selectedSegmento}
          onClose={() => setNewIssueOpen(false)}
          onSave={data => { onEditSave(data); setNewIssueOpen(false); }}
        />
      )}
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
function ClientsTab({ clients, onAddSingle, requireSenha, segmentosData, onSaveFatSeg, onDeleteFatSeg }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient]       = useState(null);
  const [senhaEditClient, setSenhaEditClient] = useState(null);
  const [sort, setSort] = useState({ field:"fat", dir:"desc" });
  const filtered = clients.filter(c => !search || normName(c.n).includes(normName(search)));
  const sorted = [...filtered].sort((a, b) => {
    const mul = sort.dir === "asc" ? 1 : -1;
    const av = a[sort.field], bv = b[sort.field];
    if (av == null && bv == null) return 0;
    if (av == null) return mul; if (bv == null) return -mul;
    return typeof av === "string" ? mul * av.localeCompare(bv, "pt-BR", {sensitivity:"base"}) : mul * (av - bv);
  });
  function th(label, field) {
    const active = sort.field === field;
    const icon = active ? (sort.dir === "asc" ? "ti-sort-ascending" : "ti-sort-descending") : "ti-selector";
    return (
      <span onClick={() => setSort(s => ({ field, dir: s.field === field && s.dir === "desc" ? "asc" : "desc" }))}
        style={{ cursor:"pointer", userSelect:"none", display:"flex", alignItems:"center", gap:3,
          color: active ? "var(--color-text-primary)" : "var(--color-text-tertiary)", whiteSpace:"nowrap" }}>
        {label} <i className={`ti ${icon}`} style={{ fontSize:10 }} aria-hidden />
      </span>
    );
  }
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ flex:1 }} />
        <button onClick={() => setShowForm(true)} style={{ padding:"7px 14px", background:"var(--color-blue-600)", color:"#fff", border:"none", borderRadius:8, fontWeight:600, display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
          <i className="ti ti-plus" style={{ fontSize:14 }} aria-hidden /> Novo Cliente
        </button>
      </div>
      <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", overflow:"hidden" }}>
        <div style={{ padding:"10px 16px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"grid", gridTemplateColumns:"2fr 0.8fr 1fr 1.2fr 1fr 1fr 1fr 1fr 36px", gap:8, fontSize:11, color:"var(--color-text-tertiary)", fontWeight:500 }}>
          {th("Cliente","n")}{th("Código","codigo")}{th("Curva","cv")}{th("Faturamento","fat")}{th("Tipo","tp")}{th("Churn","ch")}{th("Projeto","pr")}{th("Impeditivas","im")}<span />
        </div>
        {sorted.map(c => {
          const cb = curveBadge(c.cv);
          return (
            <div key={c.n+c.fat} style={{ padding:"10px 16px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"grid", gridTemplateColumns:"2fr 0.8fr 1fr 1.2fr 1fr 1fr 1fr 1fr 36px", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.n}</span>
              <span style={{ fontSize:12, color:"var(--color-text-secondary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.codigo || "—"}</span>
              <span style={{ background:cb.bg, color:cb.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:500, textAlign:"center", border:`0.5px solid ${cb.border}44` }}>Curva {c.cv}</span>
              <span style={{ fontSize:12 }}>R$ {(c.fat||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
              <span style={{ fontSize:12, color:"var(--color-text-secondary)" }}>{c.tp}</span>
              <span>{c.ch ? <span style={{ color:"#E24B4A",fontSize:12 }}>Sim</span> : <span style={{ color:"var(--color-text-tertiary)",fontSize:12 }}>Não</span>}</span>
              <span>{c.pr ? <span style={{ color:"#185FA5",fontSize:12 }}>Sim</span> : <span style={{ color:"var(--color-text-tertiary)",fontSize:12 }}>Não</span>}</span>
              <span style={{ fontSize:12, textAlign:"center" }}>{c.im}</span>
              <button
                onClick={() => { const d = { id:c.id, n:c.n, ac:c.ac??"", fat:(c.fat??0).toFixed(2), tp:c.tp??"REAL", cv:c.cv??"B", ch:String(c.ch??0), pr:String(c.pr??0), codigo:c.codigo??"", fatSegs:c.fatSegs??[] }; requireSenha ? setSenhaEditClient(d) : setEditClient(d); }}
                title="Editar cliente"
                style={{ padding:"3px 6px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", background:"transparent", cursor:"pointer", color:"var(--color-text-tertiary)", display:"flex", alignItems:"center", justifyContent:"center" }}
              >
                <i className="ti ti-pencil" style={{ fontSize:13 }} />
              </button>
            </div>
          );
        })}
      </div>
      {showForm   && <SingleClientModal onClose={() => setShowForm(false)}  onSave={c => { onAddSingle(c); setShowForm(false); }} segmentosData={segmentosData} onSaveFatSeg={onSaveFatSeg} onDeleteFatSeg={onDeleteFatSeg} />}
      {senhaEditClient && (
        <PasswordModal
          title="Editar cliente"
          message={`Informe a senha para editar o cliente "${senhaEditClient.n}".`}
          onConfirm={() => { setEditClient(senhaEditClient); setSenhaEditClient(null); }}
          onClose={() => setSenhaEditClient(null)}
        />
      )}
      {editClient && <SingleClientModal onClose={() => setEditClient(null)} onSave={c => { onAddSingle(c); setEditClient(null); }} initialData={editClient} segmentosData={segmentosData} onSaveFatSeg={onSaveFatSeg} onDeleteFatSeg={onDeleteFatSeg} />}
    </div>
  );
}

// ── CRITERIOS TAB ─────────────────────────────────────────────────────────────
function CriteriosTab({ criteriaData, issues, onToggle, onSave, onDelete, onReorder, requireSenha }) {
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState({ nome:"", peso:"", tipo:"issue", atributo:"isErro", direcao:"desc" });
  const [delId, setDelId]                 = useState(null);
  const [senhaInativar, setSenhaInativar] = useState(null); // id do critério a inativar
  const [senhaExcluir, setSenhaExcluir]   = useState(null); // id do critério a excluir

  const ATRS_BY_TIPO = {
    issue:   ATRIBUTOS_DISPONIVEIS.filter(a => a.tipo === "issue"),
    cliente: ATRIBUTOS_DISPONIVEIS.filter(a => a.tipo === "cliente"),
  };

  const sorted = [...criteriaData].sort((a, b) => a.peso - b.peso);

  function handleSave() {
    if (!form.nome.trim()) return;
    onSave({ ...form, peso: form.peso !== "" ? Number(form.peso) : undefined });
    setShowForm(false);
    setForm({ nome:"", peso:"", tipo:"issue", atributo:"isErro", direcao:"desc" });
  }

  function handleTipoChange(e) {
    const t = e.target.value;
    const firstAttr = ATRS_BY_TIPO[t][0]?.value ?? "";
    const defaultDir = direcaoOptionsFor(firstAttr)[0]?.value ?? "desc";
    setForm(f => ({ ...f, tipo: t, atributo: firstAttr, direcao: defaultDir }));
  }

  function handleAtributoChange(e) {
    const a = e.target.value;
    const defaultDir = direcaoOptionsFor(a)[0]?.value ?? "desc";
    setForm(f => ({ ...f, atributo: a, direcao: defaultDir }));
  }

  return (
    <div style={{ maxWidth:960 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontWeight:500, fontSize:16 }}>Critérios de Priorização</div>
          <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginTop:2 }}>
            Ative, desative, reordene ou adicione critérios. O preview abaixo reflete a ordenação em tempo real.
          </div>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"var(--color-blue-600)", color:"#fff", fontWeight:600, display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}
        >
          <i className="ti ti-plus" style={{ fontSize:14 }} /> Novo Critério
        </button>
      </div>

      {showForm && (
        <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-secondary)", padding:20, marginBottom:16 }}>
          <div style={{ fontWeight:500, fontSize:14, marginBottom:16 }}>Novo Critério</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={{ display:"block", fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Nome</label>
              <input
                value={form.nome} onChange={e => setForm(f => ({...f, nome:e.target.value}))}
                placeholder="Ex: Faturamento do Cliente"
                style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-secondary)", boxSizing:"border-box" }}
              />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Peso (menor = maior prioridade)</label>
              <input
                type="number" min={0} value={form.peso}
                onChange={e => setForm(f => ({...f, peso:e.target.value}))}
                placeholder={`Auto (${criteriaData.length ? Math.max(...criteriaData.map(c => c.peso)) + 1 : 0})`}
                style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-secondary)", boxSizing:"border-box" }}
              />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Tipo</label>
              <select
                value={form.tipo} onChange={handleTipoChange}
                style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-secondary)", boxSizing:"border-box" }}
              >
                <option value="issue">Issue</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Atributo</label>
              <select
                value={form.atributo} onChange={handleAtributoChange}
                style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-secondary)", boxSizing:"border-box" }}
              >
                {ATRS_BY_TIPO[form.tipo].map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Ordenação</label>
              <select
                value={form.direcao} onChange={e => setForm(f => ({...f, direcao:e.target.value}))}
                style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-secondary)", boxSizing:"border-box" }}
              >
                {direcaoOptionsFor(form.atributo).map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", paddingTop:12, borderTop:"0.5px solid var(--color-border-tertiary)" }}>
            <button onClick={() => setShowForm(false)} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:13, fontWeight:500 }}>Cancelar</button>
            <button onClick={handleSave} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#185FA5", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:500 }}>Salvar</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {sorted.map((c, idx) => {
          const atr = ATRIBUTOS_DISPONIVEIS.find(a => a.value === c.atributo && a.tipo === c.tipo);
          return (
            <div key={c.id} style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", padding:"14px 18px", display:"flex", alignItems:"center", gap:14, opacity: c.ativo ? 1 : 0.55 }}>
              <span style={{ fontSize:11, color:"var(--color-text-tertiary)", minWidth:20, textAlign:"center", fontWeight:500 }}>{idx + 1}</span>
              <label style={{ display:"flex", alignItems:"center", cursor:"pointer", flexShrink:0 }}>
                <input
                  type="checkbox" checked={c.ativo} onChange={() => c.ativo ? (requireSenha ? setSenhaInativar(c.id) : onToggle(c.id)) : onToggle(c.id)}
                  style={{ width:16, height:16, accentColor:"#185FA5", cursor:"pointer" }}
                />
              </label>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:500, fontSize:14 }}>
                  {c.nome}
                  {c.padrao && <span style={{ marginLeft:8, fontSize:11, color:"var(--color-text-tertiary)", fontWeight:400, fontStyle:"italic" }}>padrão</span>}
                </div>
                <div style={{ fontSize:12, color:"var(--color-text-tertiary)", marginTop:3, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                  <span style={{ background:"var(--color-background-secondary)", borderRadius:4, padding:"1px 6px" }}>peso {c.peso}</span>
                  <span style={{ background:"var(--color-background-secondary)", borderRadius:4, padding:"1px 6px" }}>{c.tipo === "issue" ? "Issue" : "Cliente"}</span>
                  <span>{atr?.label ?? c.atributo}</span>
                  <span style={{ color: c.direcao === "desc" ? "#185FA5" : "#3B6D11" }}>
                    {direcaoLabel(c.atributo, c.direcao)}
                  </span>
                </div>
              </div>
              <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                <button
                  onClick={() => onReorder(c.id, "up")} disabled={idx === 0} title="Mover para cima"
                  style={{ padding:"4px 7px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", background:"transparent", cursor: idx === 0 ? "not-allowed" : "pointer", color:"var(--color-text-secondary)", opacity: idx === 0 ? 0.3 : 1 }}
                >
                  <i className="ti ti-chevron-up" style={{ fontSize:12 }} />
                </button>
                <button
                  onClick={() => onReorder(c.id, "down")} disabled={idx === sorted.length - 1} title="Mover para baixo"
                  style={{ padding:"4px 7px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", background:"transparent", cursor: idx === sorted.length - 1 ? "not-allowed" : "pointer", color:"var(--color-text-secondary)", opacity: idx === sorted.length - 1 ? 0.3 : 1 }}
                >
                  <i className="ti ti-chevron-down" style={{ fontSize:12 }} />
                </button>
                <button
                  onClick={() => setDelId(c.id)} title="Excluir critério"
                  style={{ padding:"4px 7px", borderRadius:6, border:"0.5px solid #E24B4A44", background:"#FCEBEB", cursor:"pointer", color:"#A32D2D" }}
                >
                  <i className="ti ti-trash" style={{ fontSize:12 }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Preview da ordenação ── */}
      {issues && issues.length > 0 && (
        <div style={{ marginTop:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <i className="ti ti-list-numbers" style={{ fontSize:15, color:"var(--color-text-tertiary)" }} />
            <span style={{ fontWeight:500, fontSize:14 }}>Preview da Ordenação</span>
            <span style={{ fontSize:12, color:"var(--color-text-tertiary)" }}>— top {Math.min(issues.length, 10)} issues com os critérios ativos</span>
          </div>
          <div style={{ background:"var(--color-background-primary)", borderRadius:12, border:"0.5px solid var(--color-border-tertiary)", overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"32px 1fr 110px 80px", gap:8, padding:"8px 14px", background:"var(--color-background-secondary)", fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)" }}>
              <span>#</span><span>Issue</span><span>Cliente</span><span>Curva</span>
            </div>
            {issues.filter(x => !isDone(x.st)).slice(0, 10).map((issue, i) => {
              const gs = GROUP_STYLE[issue._sc?.group] || GROUP_STYLE[6];
              const cb = curveBadge(issue._curva);
              return (
                <div key={issue.id} style={{ display:"grid", gridTemplateColumns:"32px 1fr 110px 80px", gap:8, padding:"8px 14px", borderTop:"0.5px solid var(--color-border-tertiary)", fontSize:12, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"var(--color-text-tertiary)", fontWeight:500 }}>#{i+1}</span>
                  <div style={{ overflow:"hidden" }}>
                    <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500 }}>{issue.n}</div>
                    <span style={{ background:gs.bg, color:gs.color, border:`0.5px solid ${gs.border}44`, borderRadius:4, padding:"1px 5px", fontSize:10 }}>{gs.label}</span>
                    {issue.imp === 1 && <span style={{ marginLeft:4, background:"#FFF7ED", color:"#92400E", border:"0.5px solid #FCD34D88", borderRadius:4, padding:"1px 5px", fontSize:10 }}>Impeditiva</span>}
                  </div>
                  <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"var(--color-text-secondary)" }}>{issue.cl}</span>
                  <span style={{ background:cb.bg, color:cb.color, border:`0.5px solid ${cb.border}44`, borderRadius:5, padding:"2px 7px", fontSize:11, fontWeight:500, textAlign:"center" }}>Curva {issue._curva}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {delId !== null && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
          <div style={{ background:"var(--color-background-primary)", borderRadius:16, border:"0.5px solid var(--color-border-tertiary)", padding:28, width:360, textAlign:"center" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"#FCEBEB", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <i className="ti ti-trash" style={{ fontSize:22, color:"#A32D2D" }} />
            </div>
            <div style={{ fontWeight:500, fontSize:16, marginBottom:8 }}>Excluir critério?</div>
            <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginBottom:24 }}>
              Isso removerá o critério permanentemente. As issues serão reordenadas imediatamente.
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={() => setDelId(null)} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:13, fontWeight:500 }}>Cancelar</button>
              <button onClick={() => { if (requireSenha) { setSenhaExcluir(delId); setDelId(null); } else { onDelete(delId); setDelId(null); } }} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#A32D2D", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:500 }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {senhaInativar !== null && (
        <PasswordModal
          title="Inativar critério"
          message="Informe a senha para desativar este critério."
          onConfirm={() => { onToggle(senhaInativar); setSenhaInativar(null); }}
          onClose={() => setSenhaInativar(null)}
        />
      )}

      {senhaExcluir !== null && (
        <PasswordModal
          title="Confirmar exclusão"
          message="Informe a senha para excluir este critério permanentemente."
          onConfirm={() => { onDelete(senhaExcluir); setSenhaExcluir(null); }}
          onClose={() => setSenhaExcluir(null)}
        />
      )}
    </div>
  );
}

// ── COMBOBOX DE PRODUTO COM CRIAÇÃO INLINE ────────────────────────────────────
function CreatableProductSelect({ value, onChange, produtos, segmento, onAdd }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen]   = useState(false);

  const q        = query.toLowerCase().trim();
  const filtered = q ? produtos.filter(p => p.nome.toLowerCase().includes(q)) : produtos;
  const exact    = produtos.some(p => p.nome.toLowerCase() === q);
  const canCreate = q && !exact;

  function pick(nome) { onChange(nome); setQuery(nome); setOpen(false); }

  return (
    <div style={{ position:"relative" }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={{ width:"100%", boxSizing:"border-box" }}
        placeholder="Buscar ou criar produto…"
      />
      {open && (filtered.length > 0 || canCreate) && (
        <div style={{
          position:"absolute", top:"100%", left:0, right:0, zIndex:300,
          background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-secondary)",
          borderRadius:6, maxHeight:200, overflowY:"auto",
          boxShadow:"0 4px 16px rgba(0,0,0,.14)",
        }}>
          {filtered.map(p => (
            <div key={p.id} onMouseDown={() => pick(p.nome)}
              style={{ padding:"7px 10px", cursor:"pointer", fontSize:13 }}>
              {p.nome}
            </div>
          ))}
          {canCreate && (
            <div onMouseDown={() => { onAdd(query.trim()); setOpen(false); }}
              style={{
                padding:"7px 10px", cursor:"pointer", fontSize:13,
                color:"var(--color-blue-600,#185FA5)",
                borderTop: filtered.length ? "0.5px solid var(--color-border-tertiary)" : "none",
              }}>
              <i className="ti ti-plus" style={{ fontSize:11 }} /> Criar "{query.trim()}"
              {segmento && <span style={{ fontSize:11, color:"var(--color-text-tertiary)", marginLeft:4 }}>→ {segmento.nome}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MODAL IMPORTAR ISSUES ────────────────────────────────────────────────────
function ImportIssueModal({ onClose, onSave, existingIssues, selectedSegmento }) {
  const [tab, setTab]         = useState("file");
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState([]); // [{...issue, _op:"insert"|"update"}]
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [produtos, setProdutos] = useState([]);
  const [form, setForm]       = useState({
    id:"", n:"", cat:"Erro - prioridade alta", cl:"", prod:"",
    st:"Backlog", dt:new Date().toISOString().slice(0,10), rm:"0", mc:"0", imp:"0", val:"0"
  });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  useEffect(() => {
    fetch(API + '/produtos').then(r => r.json()).then(setProdutos).catch(() => {})
  }, []);

  async function handleAddProd(nome) {
    if (!selectedSegmento?.id) { setError("Selecione um segmento antes de criar um produto."); return; }
    const res = await fetch(API + '/produtos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, segmentoId: selectedSegmento.id }),
    });
    if (!res.ok) { setError("Erro ao criar produto."); return; }
    const novo = await res.json();
    setProdutos(prev => [...prev, novo]);
    set("prod", nome);
  }

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
    onSave([{ ...form, id:Number(form.id), rm:Number(form.rm), mc:Number(form.mc), imp:Number(form.imp), val:Number(form.val), curva:"B" }]);
    onClose();
  }

  function handleImport() {
    if (preview.length === 0) return;
    const issues = preview.map(({ _op, ...iss }) => {
      if (_op === "update") {
        const existing = existingIssues.find(x => x.id === iss.id);
        if (existing) {
          return {
            ...iss,
            rm:  existing.rm  ? existing.rm  : iss.rm,
            mc:  existing.mc  ? existing.mc  : iss.mc,
            val: (existing.val != null && existing.val > 0) ? existing.val : iss.val,
          };
        }
      }
      return iss;
    });
    onSave(issues);
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
            <FInput label="Status" value={form.st} onChange={v=>set("st",v)} select options={["Backlog","Não iniciada","Em andamento","Especificação","Aceite","Aguardando cliente","Aguardando planejamento","Homologado"]} />
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
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Produto</div>
              <CreatableProductSelect
                value={form.prod}
                onChange={v => set("prod", v)}
                produtos={produtos}
                segmento={selectedSegmento}
                onAdd={handleAddProd}
              />
            </div>
          </FRow>
          <FRow>
            <FInput label="Categoria" value={form.cat} onChange={v=>set("cat",v)} select options={["Erro - prioridade alta","Erro - prioridade média","Erro - prioridade baixa","Legislação","Implementação - Customização","Sugestão de melhoria","Evolução","Demanda de Atualização","Dúvida"]} />
            <FInput label="Data Abertura" value={form.dt} onChange={v=>set("dt",v)} type="date" />
          </FRow>
          <FRow>
            <FInput label="É Impeditiva" value={form.imp} onChange={v=>set("imp",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
            <FInput label="Roadmap" value={form.rm} onChange={v=>set("rm",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
            <FInput label="Atende +1 cliente" value={form.mc} onChange={v=>set("mc",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
          </FRow>
          <FRow>
            <FInput label="Valor (R$)" value={form.val} onChange={v=>set("val",v)} type="number" step="0.01" />
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
  const [form, setForm]       = useState({ n:"", ac:"", fat:"0", tp:"REAL", cv:"B", ch:"0", pr:"0", codigo:"" });
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
    onSave([{ ...form, fat:Number(form.fat), ch:Number(form.ch), pr:Number(form.pr), codigo:form.codigo||null }]);
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
                ["E","Curva (S/A/B/C/D)"],["F","Risco Churn (0/1)"],["G","Em Projeto (0/1)"],["H","Código do Cliente"]].map(([col,desc]) => (
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
            <FInput label="Código do Cliente" value={form.codigo} onChange={v=>set("codigo",v)} />
            <FInput label="Data Aceite" value={form.ac} onChange={v=>set("ac",v)} type="date" />
          </FRow>
          <FRow>
            <FInput label="Faturamento Mensal (R$)" value={form.fat} onChange={v=>set("fat",v)} type="number" step="0.01" />
          </FRow>
          <FRow>
            <FInput label="Curva" value={form.cv} onChange={v=>set("cv",v)} select options={["S","A","B","C","D"]} />
            <FInput label="Tipo" value={form.tp} onChange={v=>set("tp",v)} select options={["REAL","PROJETO"]} />
          </FRow>
          <FRow>
            <FInput label="Risco de Churn" value={form.ch} onChange={v=>set("ch",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
            <FInput label="Em Projeto" value={form.pr} onChange={v=>set("pr",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
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

// ── MODAL NOVA ISSUE (cadastro individual) ────────────────────────────────────
const BOOLOPS = [{value:"0",label:"Não"},{value:"1",label:"Sim"}];
const CAT_OPTS = ["Erro - prioridade alta","Erro - prioridade média","Erro - prioridade baixa","Legislação","Implementação - Customização","Sugestão de melhoria","Evolução","Demanda de Atualização","Dúvida"];

function SingleIssueModal({ onClose, onSave, existingIssues, selectedSegmento }) {
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({ id:"", n:"", cat:"Erro - prioridade alta", cl:"", prod:"", st:"Backlog", dt:today, rm:"0", mc:"0", imp:"0", val:"0.00", curva:"", ob:"", ap:"", mr:"" });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const [produtos, setProdutos] = useState([]);
  const exists = form.id ? existingIssues.find(x => x.id === Number(form.id)) : null;

  useEffect(() => {
    fetch(API + '/produtos').then(r => r.json()).then(setProdutos).catch(() => {})
  }, []);

  async function handleAddProd(nome) {
    if (!selectedSegmento?.id) { alert("Selecione um segmento antes de criar um produto."); return; }
    const res = await fetch(API + '/produtos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, segmentoId: selectedSegmento.id }),
    });
    if (!res.ok) { alert("Erro ao criar produto."); return; }
    const novo = await res.json();
    setProdutos(prev => [...prev, novo]);
    set("prod", nome);
  }

  function handleSave() {
    if (!form.id || !form.n || !form.cl) return alert("ID, nome e cliente são obrigatórios.");
    if (form.ap === "Não" && !form.mr.trim()) return alert("Motivo da não aprovação é obrigatório.");
    onSave([{
      id: Number(form.id), n: form.n, cat: form.cat||null, cl: form.cl,
      prod: form.prod||null, st: form.st||null, dt: form.dt||null,
      rm: Number(form.rm), mc: Number(form.mc), imp: Number(form.imp),
      val: form.val !== "" ? Number(form.val) : null,
      curva: form.curva||null, ob: form.ob||null,
      ap: form.ap||null, mr: form.ap==="Não" ? form.mr||null : null,
    }]);
    onClose();
  }
  return (
    <Modal title={exists ? `Atualizar Issue #${form.id}` : "Nova Issue"} onClose={onClose} onSave={handleSave} saveLabel={exists ? "Atualizar" : "Cadastrar"}>
      {exists && (
        <div style={{ marginBottom:12, padding:"8px 12px", background:"#EFF6FF", borderRadius:8, fontSize:12, color:"#1451913", border:"1px solid #BFDBFE", display:"flex", gap:8, alignItems:"center" }}>
          <i className="ti ti-refresh" style={{ fontSize:14, color:"var(--color-blue-600)" }} />
          Issue <strong>#{form.id}</strong> já existe — será atualizada.
        </div>
      )}
      <FRow>
        <FInput label="ID (Jira) *" value={form.id} onChange={v=>set("id",v)} type="number" />
        <FInput label="Status" value={form.st} onChange={v=>set("st",v)} />
      </FRow>
      <FRow mb={12}>
        <FInput label="Nome / Descrição *" value={form.n} onChange={v=>set("n",v)} />
      </FRow>
      <FRow>
        <FInput label="Cliente *" value={form.cl} onChange={v=>set("cl",v)} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>Produto</div>
          <CreatableProductSelect
            value={form.prod}
            onChange={v => set("prod", v)}
            produtos={produtos}
            segmento={selectedSegmento}
            onAdd={handleAddProd}
          />
        </div>
      </FRow>
      <FRow>
        <FInput label="Categoria" value={form.cat} onChange={v=>set("cat",v)} select options={CAT_OPTS} />
        <FInput label="Data Abertura" value={form.dt} onChange={v=>set("dt",v)} type="date" />
      </FRow>
      <FRow>
        <FInput label="Curva" value={form.curva} onChange={v=>set("curva",v)} select options={["","S","A","B","C","D"]} />
        <FInput label="Valor (R$)" value={form.val} onChange={v=>set("val",v)} type="number" step="0.01" />
      </FRow>
      <FRow mb={12}>
        <FInput label="É Impeditiva" value={form.imp} onChange={v=>set("imp",v)} select options={BOOLOPS} />
        <FInput label="Roadmap" value={form.rm} onChange={v=>set("rm",v)} select options={BOOLOPS} />
        <FInput label="Atende +1 cliente" value={form.mc} onChange={v=>set("mc",v)} select options={BOOLOPS} />
      </FRow>
      <FRow>
        <FInput label="Aprovação" value={form.ap} onChange={v=>set("ap",v)} select options={[{value:"",label:"(Não analisado)"},{value:"Sim",label:"Sim"},{value:"Não",label:"Não"}]} />
      </FRow>
      {form.ap==="Não" && (
        <FRow mb={0}>
          <FInput label="Motivo da não aprovação *" value={form.mr} onChange={v=>set("mr",v)} type="textarea" />
        </FRow>
      )}
      {form.ap!=="Não" && (
        <FRow mb={0}>
          <FInput label="Observação" value={form.ob} onChange={v=>set("ob",v)} type="textarea" />
        </FRow>
      )}
    </Modal>
  );
}

// Componente para editar faturamento de um segmento específico de um cliente
function FatSegRow({ segNome, initialValue, fatSegId, clienteId, segmentoId, onSaveFatSeg, onDeleteFatSeg }) {
  const [val, setVal] = useState(initialValue != null ? String(initialValue) : "");
  const [saving, setSaving] = useState(false);
  async function handleSave() {
    const num = Number(val);
    if (!val || num === 0) {
      if (fatSegId) { setSaving(true); await onDeleteFatSeg(fatSegId, clienteId, segmentoId); setSaving(false); }
      return;
    }
    setSaving(true);
    await onSaveFatSeg(clienteId, segmentoId, num);
    setSaving(false);
  }
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
      <span style={{ flex:1, fontSize:13, color:"var(--color-text-secondary)" }}>{segNome}</span>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <input
          type="number" step="0.01" value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={handleSave}
          placeholder="R$ 0,00"
          style={{ width:130, padding:"6px 8px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-secondary)" }}
        />
        {saving && <i className="ti ti-loader-2 ti-spin" style={{ fontSize:12, color:"var(--color-text-tertiary)" }} />}
      </div>
    </div>
  );
}

// Cadastro rápido de cliente único (botão na aba Clientes)
function SingleClientModal({ onClose, onSave, initialData, segmentosData, onSaveFatSeg, onDeleteFatSeg }) {
  const [form, setForm] = useState(initialData ?? { n:"", ac:"", fat:"0.00", tp:"REAL", cv:"B", ch:"0", pr:"0", codigo:"", fatSegs:[] });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  function handleSave() {
    if (!form.n) return alert("Nome do cliente é obrigatório.");
    onSave({ ...form, fat:Number(form.fat), ch:Number(form.ch), pr:Number(form.pr) });
    onClose();
  }
  const boolOpts = [{value:"0",label:"Não"},{value:"1",label:"Sim"}];
  const isEdit = !!initialData?.id;
  return (
    <Modal title={initialData ? `Editar Cliente — ${initialData.n}` : "Cadastrar / Atualizar Cliente"} onClose={onClose} onSave={handleSave}>
      <FInput label="Nome do Cliente *" value={form.n} onChange={v=>set("n",v)} />
      <FRow><FInput label="Código do Cliente" value={form.codigo} onChange={v=>set("codigo",v)} /><FInput label="Data Aceite" value={form.ac} onChange={v=>set("ac",v)} type="date" /></FRow>
      <FRow><FInput label="Faturamento Mensal Total (R$)" value={form.fat} onChange={v=>set("fat",v)} type="number" step="0.01" /></FRow>
      <FRow><FInput label="Curva" value={form.cv} onChange={v=>set("cv",v)} select options={["S","A","B","C","D"]} /><FInput label="Tipo" value={form.tp} onChange={v=>set("tp",v)} select options={["REAL","PROJETO"]} /></FRow>
      <FRow><FInput label="Risco de Churn" value={form.ch} onChange={v=>set("ch",v)} select options={boolOpts} /><FInput label="Em Projeto" value={form.pr} onChange={v=>set("pr",v)} select options={boolOpts} /></FRow>
      {isEdit && segmentosData?.length > 0 && (
        <div style={{ marginTop:16, borderTop:"0.5px solid var(--color-border-tertiary)", paddingTop:16 }}>
          <div style={{ fontWeight:500, fontSize:13, marginBottom:10 }}>Faturamento por Segmento</div>
          <div style={{ fontSize:12, color:"var(--color-text-tertiary)", marginBottom:10 }}>Salvo automaticamente ao sair do campo. Deixe em branco para remover.</div>
          {segmentosData.map(seg => {
            const existing = (form.fatSegs ?? []).find(fs => fs.segmentoId === seg.id);
            return (
              <FatSegRow
                key={seg.id}
                segNome={seg.nome}
                initialValue={existing?.valor ?? null}
                fatSegId={existing?.id ?? null}
                clienteId={initialData.id}
                segmentoId={seg.id}
                onSaveFatSeg={onSaveFatSeg}
                onDeleteFatSeg={onDeleteFatSeg}
              />
            );
          })}
        </div>
      )}
      {!isEdit && segmentosData?.length > 0 && (
        <div style={{ marginTop:12, fontSize:12, color:"var(--color-text-tertiary)", padding:"8px 12px", background:"var(--color-background-secondary)", borderRadius:8 }}>
          <i className="ti ti-info-circle" style={{ fontSize:12 }} /> Após salvar o cliente, edite-o novamente para configurar o faturamento por segmento.
        </div>
      )}
    </Modal>
  );
}

// ── MODAL EDITAR ISSUE ────────────────────────────────────────────────────────
function EditIssueModal({ issue, onClose, onSave }) {
  const [form, setForm] = useState({
    n:    issue.n    ?? "",
    cat:  issue.cat  ?? "Erro - prioridade alta",
    cl:   issue.cl   ?? "",
    prod: issue.prod ?? "Teknisa HCM",
    st:   issue.st   ?? "",
    dt:   issue.dt   ?? "",
    rm:   String(issue.rm  ?? 0),
    mc:   String(issue.mc  ?? 0),
    imp:  String(issue.imp ?? 0),
    val:  (issue.val ?? 0).toFixed(2),
    curva: issue.curva ?? "",
    ob:   issue.ob   ?? "",
    ap:   issue.ap   ?? "",
    mr:   issue.mr   ?? "",
  });
  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  function handleSave() {
    if (!form.n || !form.cl) return alert("Nome e cliente são obrigatórios.");
    if (form.ap === "Não" && !form.mr.trim()) return alert("Motivo da não aprovação é obrigatório.");
    onSave([{
      id: issue.id, n: form.n, cat: form.cat || null, cl: form.cl,
      prod: form.prod || null, st: form.st || null, dt: form.dt || null,
      rm: Number(form.rm), mc: Number(form.mc), imp: Number(form.imp),
      val: form.val !== "" ? Number(form.val) : null,
      curva: form.curva || null, ob: form.ob || null,
      seg: issue.seg, segOrd: issue.segOrd,
      ap: form.ap || null, mr: form.ap === "Não" ? form.mr || null : null,
    }]);
    onClose();
  }
  return (
    <Modal title={`Editar Issue #${issue.id}`} onClose={onClose} onSave={handleSave}>
      <div style={{ marginBottom:12, padding:"6px 10px", background:"var(--color-background-secondary)", borderRadius:6, fontSize:12, color:"var(--color-text-tertiary)" }}>
        ID: <strong style={{ color:"var(--color-text-primary)" }}>{issue.id}</strong>
      </div>
      <FInput label="Nome / Descrição *" value={form.n} onChange={v=>set("n",v)} />
      <FRow>
        <FInput label="Cliente *" value={form.cl} onChange={v=>set("cl",v)} />
        <FInput label="Produto" value={form.prod} onChange={v=>set("prod",v)} select options={["Teknisa HCM","Teknisa Portal do Funcionário","Teknisa Portal do Gestor"]} />
      </FRow>
      <FRow>
        <FInput label="Categoria" value={form.cat} onChange={v=>set("cat",v)} select options={["Erro - prioridade alta","Erro - prioridade média","Erro - prioridade baixa","Legislação","Implementação - Customização","Sugestão de melhoria","Evolução","Demanda de Atualização","Dúvida"]} />
        <FInput label="Status" value={form.st} onChange={v=>set("st",v)} />
      </FRow>
      <FRow>
        <FInput label="Data Abertura" value={form.dt} onChange={v=>set("dt",v)} type="date" />
        <FInput label="Curva" value={form.curva} onChange={v=>set("curva",v)} select options={["","S","A","B","C","D"]} />
      </FRow>
      <FRow>
        <FInput label="É Impeditiva" value={form.imp} onChange={v=>set("imp",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
        <FInput label="Roadmap" value={form.rm} onChange={v=>set("rm",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
        <FInput label="Atende +1 cliente" value={form.mc} onChange={v=>set("mc",v)} select options={[{value:"0",label:"Não"},{value:"1",label:"Sim"}]} />
      </FRow>
      <FRow>
        <FInput label="Valor (R$)" value={form.val} onChange={v=>set("val",v)} type="number" step="0.01" />
        <FInput label="Aprovação" value={form.ap} onChange={v=>set("ap",v)} select options={[{value:"",label:"(Não analisado)"},{value:"Sim",label:"Sim"},{value:"Não",label:"Não"}]} />
      </FRow>
      {form.ap === "Não" && (
        <FInput label="Motivo da não aprovação *" value={form.mr} onChange={v=>set("mr",v)} type="textarea" />
      )}
      <FInput label="Observação" value={form.ob} onChange={v=>set("ob",v)} type="textarea" />
    </Modal>
  );
}

// ── PRIMITIVOS ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, children, wide, saveLabel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{
        background:"var(--color-background-primary)",
        borderRadius:16,
        width:"92%", maxWidth: wide ? 720 : 560, maxHeight:"92vh",
        display:"flex", flexDirection:"column",
        boxShadow:"var(--shadow-modal)",
        animation:"slideUp .18s ease",
        overflow:"hidden",
      }}>
        {/* Cabeçalho azul */}
        <div style={{ padding:"18px 24px", background:"var(--color-blue-50)", borderBottom:"1px solid var(--color-blue-100)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ fontWeight:600, fontSize:15, color:"var(--color-blue-600)" }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:6, color:"var(--color-text-tertiary)", display:"flex", alignItems:"center" }}>
            <i className="ti ti-x" style={{ fontSize:17 }} aria-hidden />
          </button>
        </div>
        {/* Conteúdo */}
        <div style={{ padding:"20px 24px", overflowY:"auto", flex:1 }}>
          {children}
        </div>
        {/* Rodapé */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:8, padding:"14px 24px", borderTop:"1px solid var(--color-border-tertiary)", flexShrink:0, background:"var(--color-background-secondary)" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", borderRadius:8, border:"1px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)" }}>Fechar</button>
          {onSave && (
            <button onClick={onSave} style={{ padding:"8px 22px", borderRadius:8, background:"var(--color-blue-600)", color:"#fff", fontWeight:600, letterSpacing:".01em" }}>{saveLabel ?? "Salvar"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function FRow({ children, mb=12 }) {
  const count = Array.isArray(children) ? children.length : 1;
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(${count},1fr)`, gap:12, marginBottom:mb }}>{children}</div>;
}
function FSep() {
  return <div style={{ height:1, background:"var(--color-border-tertiary)", margin:"16px 0" }} />;
}

function FInput({ label, value, onChange, type="text", select, options, step }) {
  return (
    <div style={{ marginBottom:0 }}>
      <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>{label}</div>
      {select
        ? <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%" }}>
            {options.map(o => {
              const v = typeof o === "object" ? o.value : o;
              const l = typeof o === "object" ? o.label : o;
              return <option key={v} value={v}>{l}</option>;
            })}
          </select>
        : type === "textarea"
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={3} style={{ width:"100%", boxSizing:"border-box", resize:"vertical", padding:"6px 8px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-secondary)", fontSize:13 }} />
        : <input type={type} value={value} step={step} onChange={e=>onChange(e.target.value)} style={{ width:"100%", boxSizing:"border-box" }} />
      }
    </div>
  );
}