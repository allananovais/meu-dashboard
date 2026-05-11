import { useState, useEffect } from "react";

const STORAGE_KEY = "allana_v5";
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const defaultData = () => ({
  ultimaReset: "",
  habitos: [
    { id: "h1", emoji: "⏰", label: "Acordei às 5h", feito: false },
    { id: "h2", emoji: "🙏", label: "Devocional", feito: false },
    { id: "h3", emoji: "🏋️", label: "Exercício", feito: false },
    { id: "h4", emoji: "📖", label: "Leitura 30min", feito: false },
    { id: "h5", emoji: "🍽️", label: "Cozinha zerada à noite", feito: false },
    { id: "h6", emoji: "🌙", label: "Rotina da noite", feito: false, detalhe: "📵 Celular às 21h · 🍵 Chá calmante · 🚿 Banho quente · 📖 Leitura leve · 💊 Melatonina" },
  ],
  emagrecimento: {
    pesoInicial: 0, pesoAtual: 0, pesoMeta: 15, registros: [], backlog: [],
    tarefas: [
      { id: "e1", label: "Beber 2L de água", feito: false },
      { id: "e2", label: "Academia / exercício", feito: false },
      { id: "e3", label: "Refeições planejadas", feito: false },
    ],
  },
  financeiro: {
    entradas: [], backlog: [],
    contasFixas: [
      { id: "cf1", label: "Aluguel", valor: 1700, pago: false, emoji: "🏠" },
      { id: "cf2", label: "Energia", valor: 550, pago: false, emoji: "⚡" },
      { id: "cf3", label: "Água", valor: 140, pago: false, emoji: "💧" },
      { id: "cf4", label: "Escola Miguel", valor: 800, pago: false, emoji: "🎒" },
      { id: "cf5", label: "Plano de saúde Miguel", valor: 525, pago: false, emoji: "🏥" },
      { id: "cf6", label: "Cartão Emerson", valor: 3000, pago: false, emoji: "💳" },
      { id: "cf7", label: "Parcelamento Receita", valor: 307, pago: false, emoji: "📋" },
    ],
    dividas: [
      { id: "d1", label: "Escola Miguel", valorInicial: 4000, valorAtual: 4000, cor: "#f97316", emoji: "🎒" },
      { id: "d2", label: "Cartão Emerson", valorInicial: 6000, valorAtual: 6000, cor: "#ef4444", emoji: "💳" },
      { id: "d3", label: "Nubank", valorInicial: 5000, valorAtual: 5000, cor: "#8b5cf6", emoji: "💜" },
    ],
    tarefas: [
      { id: "ft1", label: "Atualizar planilha financeira", feito: false },
      { id: "ft2", label: "Verificar entradas do dia", feito: false },
    ],
  },
  metas: [
    { id: "m1", emoji: "📚", label: "Assinantes Biblioteca", atual: 30, meta: 1000, cor: "#8b5cf6" },
    { id: "m2", emoji: "💰", label: "Renda Biblioteca/mês", atual: 1005, meta: 33500, cor: "#10b981", prefix: "R$" },
    { id: "m3", emoji: "🍲", label: "Pedidos iFood/mês", atual: 0, meta: 100, cor: "#f97316" },
    { id: "m4", emoji: "📸", label: "Seguidores Instagram", atual: 12000, meta: 20000, cor: "#ec4899" },
    { id: "m5", emoji: "🏠", label: "Entrada casa própria", atual: 0, meta: 50000, cor: "#3b82f6", prefix: "R$" },
  ],
  biblioteca: {
    assinantes: 30, metaAssinantes: 1000, backlog: [], notas: "",
    tarefas: [
      { id: "b1", label: "Criar cena/bloco novo", feito: false },
      { id: "b2", label: "Post no Instagram", feito: false },
      { id: "b3", label: "Responder DMs/comentários", feito: false },
      { id: "b4", label: "Atualizar página de vendas", feito: false },
    ],
    semanal: [
      { dia: "Seg", tarefa: "Criar cena/bloco (5h–7h)" },
      { dia: "Ter", tarefa: "Conteúdo Instagram (5h–6h)" },
      { dia: "Qua", tarefa: "Criar cena/bloco (5h–7h)" },
      { dia: "Qui", tarefa: "Conteúdo Instagram (5h–6h)" },
      { dia: "Sex", tarefa: "Engajamento + DMs (5h–6h)" },
    ],
  },
  studio: {
    backlog: [], notas: "",
    projetos: [
      { id: "p1", nome: "Pet shop", etapa: "Em andamento" },
      { id: "p2", nome: "Oficina", etapa: "Em andamento" },
    ],
    tarefas: [
      { id: "s1", label: "Verificar demandas de clientes", feito: false },
      { id: "s2", label: "Entregar/avançar projeto ativo", feito: false },
      { id: "s3", label: "Responder orçamentos pendentes", feito: false },
    ],
  },
  casa: {
    backlog: [],
    rodizio: [
      { id: "ca1", dia: "Seg", comodo: "Quarto + banheiro casal", emoji: "🛏️", feito: false },
      { id: "ca2", dia: "Ter", comodo: "Sala de estar", emoji: "🛋️", feito: false },
      { id: "ca3", dia: "Qua", comodo: "Sala de jantar", emoji: "🪑", feito: false },
      { id: "ca4", dia: "Qui", comodo: "Banheiro filho + quarto", emoji: "🧸", feito: false },
      { id: "ca5", dia: "Sex", comodo: "Escritório", emoji: "💻", feito: false },
      { id: "ca6", dia: "Sáb", comodo: "Faxina geral", emoji: "🧹", feito: false },
    ],
    tarefas: [
      { id: "ct1", label: "Manutenção rápida (cômodo do dia)", feito: false },
      { id: "ct2", label: "Cozinha zerada à noite", feito: false },
      { id: "ct3", label: "Almoço do filho preparado", feito: false },
    ],
  },
  buffet: {
    backlog: [], eventos: [],
    matutaTarefas: [
      { id: "mt1", label: "Verificar pedidos iFood", feito: false },
      { id: "mt2", label: "Atualizar planilha financeira", feito: false },
      { id: "mt3", label: "Acompanhar operação dos pais", feito: false },
    ],
    tarefasPadrao: {
      antes: ["Bloquear datas na agenda","Imprimir etiquetas e tags","Confirmar logística de transporte","Organizar logística do Miguel","Deixar refeições de casa prontas","Deixar casa arrumada","Confirmar cardápio com os pais","Comprar insumos necessários"],
      depois: ["Fechar caixa e registrar lucro","Balanço de insumos utilizados","Registrar aprendizados","Buscar Miguel","Reorganizar a casa","Atualizar planilha financeira"],
    },
  },
  diario: [],
});

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const hoje = new Date().toDateString();
      if (p.ultimaReset !== hoje) {
        p.habitos = p.habitos.map(h => ({ ...h, feito: false }));
        if (p.emagrecimento.tarefas) p.emagrecimento.tarefas = p.emagrecimento.tarefas.map(t => ({ ...t, feito: false }));
        if (p.financeiro.tarefas) p.financeiro.tarefas = p.financeiro.tarefas.map(t => ({ ...t, feito: false }));
        p.biblioteca.tarefas = p.biblioteca.tarefas.map(t => ({ ...t, feito: false }));
        p.studio.tarefas = p.studio.tarefas.map(t => ({ ...t, feito: false }));
        p.casa.rodizio = p.casa.rodizio.map(c => ({ ...c, feito: false }));
        p.casa.tarefas = p.casa.tarefas.map(t => ({ ...t, feito: false }));
        p.buffet.matutaTarefas = p.buffet.matutaTarefas.map(t => ({ ...t, feito: false }));
        if (p.financeiro.contasFixas) p.financeiro.contasFixas = p.financeiro.contasFixas.map(c => ({ ...c, pago: false }));
        p.ultimaReset = hoje;
      }
      const def = defaultData();
      if (!p.emagrecimento.backlog) p.emagrecimento.backlog = [];
      if (!p.financeiro.backlog) p.financeiro.backlog = [];
      if (!p.biblioteca.backlog) p.biblioteca.backlog = [];
      if (!p.studio.backlog) p.studio.backlog = [];
      if (!p.casa.backlog) p.casa.backlog = [];
      if (!p.buffet.backlog) p.buffet.backlog = [];
      if (!p.metas) p.metas = def.metas;
      if (!p.financeiro.dividas) p.financeiro.dividas = def.financeiro.dividas;
      if (!p.financeiro.contasFixas) p.financeiro.contasFixas = def.financeiro.contasFixas;
      if (!p.financeiro.entradas) p.financeiro.entradas = [];
      if (!p.buffet.tarefasPadrao) p.buffet.tarefasPadrao = def.buffet.tarefasPadrao;
      return p;
    }
  } catch (e) {}
  return { ...defaultData(), ultimaReset: new Date().toDateString() };
}

// ── HELPERS ──
function gerarLinkCalendar(titulo, dataStr, horario, dias) {
  try {
    const partes = dataStr.split("/");
    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");
    const ano = partes[2] || new Date().getFullYear();
    const horaLimpa = horario ? horario.replace("h", ":") : "09:00";
    const [h, m] = horaLimpa.includes(":") ? horaLimpa.split(":") : [horaLimpa, "00"];
    const hh = String(h).padStart(2, "0");
    const mm = String(m || "0").padStart(2, "0");
    const numDias = parseInt(dias) || 1;
    const inicio = `${ano}${mes}${dia}T${hh}${mm}00`;
    const dataFim = new Date(`${ano}-${mes}-${dia}T${hh}:${mm}:00`);
    dataFim.setDate(dataFim.getDate() + numDias);
    const fim = `${dataFim.getFullYear()}${String(dataFim.getMonth()+1).padStart(2,"0")}${String(dataFim.getDate()).padStart(2,"0")}T${hh}${mm}00`;
    const params = new URLSearchParams({ action: "TEMPLATE", text: titulo, dates: `${inicio}/${fim}`, details: `Evento Buffet Matuta - ${numDias} dia(s)` });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (e) { return null; }
}

// ── COMPONENTS ──
function Ring({ pct, size = 64, stroke = 6, color = "#8b5cf6", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(1, pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
        {children}
      </div>
    </div>
  );
}

function Check({ checked, onChange, label, color = "#8b5cf6", small, detalhe }) {
  return (
    <div onClick={onChange} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: small ? "7px 0" : "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ width: small ? 18 : 20, height: small ? 18 : 20, borderRadius: 5, flexShrink: 0, marginTop: detalhe ? 2 : 0, background: checked ? color : "transparent", border: `2px solid ${checked ? color : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: small ? 12 : 13, color: checked ? "#475569" : "#e2e8f0", textDecoration: checked ? "line-through" : "none", transition: "all 0.2s" }}>{label}</div>
        {detalhe && <div style={{ fontSize: 11, color: checked ? "#374151" : "#64748b", marginTop: 3, lineHeight: 1.5 }}>{detalhe}</div>}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, ...style }}>{children}</div>;
}

function Label({ children, color = "#64748b" }) {
  return <div style={{ fontSize: 10, letterSpacing: 2, color, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}

function SectionHeader({ emoji, title, color, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <div>
          <div style={{ fontSize: 18, color: "#f1f5f9", fontWeight: "500" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color, letterSpacing: 1, marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ height: 1, background: `linear-gradient(to right, ${color}40, transparent)`, marginTop: 12 }} />
    </div>
  );
}

function BottomModal({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "#12121f", borderRadius: "20px 20px 0 0", padding: "24px 20px 48px", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}>
        {children}
      </div>
    </div>
  );
}

function Backlog({ backlog, tarefasDia, onAddBacklog, onMoverParaHoje, onRemoverBacklog, onAddHoje, onToggleHoje, onRemoverHoje, color = "#8b5cf6" }) {
  const [texto, setTexto] = useState("");
  const [novaHoje, setNovaHoje] = useState("");
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label color="#64748b">📝 Anotações / Backlog</Label>
          <span style={{ fontSize: 10, color: "#475569" }}>{backlog.length} item(s)</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "8px 14px", marginBottom: 8 }}>
          {backlog.length === 0 && <div style={{ fontSize: 12, color: "#475569", padding: "6px 0" }}>Anote aqui tudo que precisa fazer.</div>}
          {backlog.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ flex: 1, fontSize: 13, color: "#94a3b8" }}>{item.texto}</div>
              <button onClick={() => onMoverParaHoje(item)} style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 6, padding: "3px 8px", color, fontSize: 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>→ hoje</button>
              <button onClick={() => onRemoverBacklog(item.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 15, padding: 0 }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Anotar tarefa..." value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && texto.trim()) { onAddBacklog(texto.trim()); setTexto(""); } }} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => { if (texto.trim()) { onAddBacklog(texto.trim()); setTexto(""); } }} style={{ background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 10, padding: "9px 14px", color, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+</button>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label color={color}>📋 Tarefas de hoje</Label>
          <span style={{ fontSize: 10, color: "#475569" }}>{tarefasDia.filter(t => t.feito).length}/{tarefasDia.length}</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${color}20`, borderRadius: 14, padding: "4px 14px", marginBottom: 8 }}>
          {tarefasDia.length === 0 && <div style={{ fontSize: 12, color: "#475569", padding: "10px 0" }}>Nenhuma tarefa para hoje.</div>}
          {tarefasDia.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div onClick={() => onToggleHoje(t.id)} style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, background: t.feito ? color : "transparent", border: `2px solid ${t.feito ? color : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
                {t.feito && <span style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 13, color: t.feito ? "#475569" : "#e2e8f0", textDecoration: t.feito ? "line-through" : "none", cursor: "pointer" }} onClick={() => onToggleHoje(t.id)}>{t.label}</span>
              <button onClick={() => onRemoverHoje(t.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 15, padding: 0 }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Adicionar tarefa para hoje..." value={novaHoje} onChange={e => setNovaHoje(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && novaHoje.trim()) { onAddHoje(novaHoje.trim()); setNovaHoje(""); } }} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => { if (novaHoje.trim()) { onAddHoje(novaHoje.trim()); setNovaHoje(""); } }} style={{ background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 10, padding: "9px 14px", color, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+</button>
        </div>
      </div>
    </div>
  );
}

const inp = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box", marginBottom: 10 };

const TABS = [
  { id: "geral", label: "Geral", emoji: "🏠" },
  { id: "emagrecimento", label: "Corpo", emoji: "💪" },
  { id: "financeiro", label: "Finanças", emoji: "💰" },
  { id: "metas", label: "Metas", emoji: "🎯" },
  { id: "biblioteca", label: "Biblioteca", emoji: "📚" },
  { id: "studio", label: "Studio", emoji: "🖥️" },
  { id: "casa", label: "Casa", emoji: "🏡" },
  { id: "buffet", label: "Buffet", emoji: "🍽️" },
  { id: "diario", label: "Diário", emoji: "📓" },
  { id: "config", label: "Config", emoji: "⚙️" },
];

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("geral");
  const [diarioTexto, setDiarioTexto] = useState("");
  const [modalEvento, setModalEvento] = useState(false);
  const [eventoForm, setEventoForm] = useState({ titulo: "", data: "", horario: "", dias: "", tarefas: [] });
  const [novaTarefa, setNovaTarefa] = useState("");
  const [modalPeso, setModalPeso] = useState(false);
  const [pesoInput, setPesoInput] = useState("");
  const [modalEntrada, setModalEntrada] = useState(false);
  const [entradaForm, setEntradaForm] = useState({ descricao: "", valor: "" });
  const [modalDivida, setModalDivida] = useState(null);
  const [dividaInput, setDividaInput] = useState("");
  const [editMetaVal, setEditMetaVal] = useState({});

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {} }, [data]);

  const upd = fn => setData(prev => fn(JSON.parse(JSON.stringify(prev))));

  const toggle = (path, id) => upd(d => {
    const arr = path.split(".").reduce((o, k) => o[k], d);
    const item = arr.find(x => x.id === id);
    if (item) item.feito = !item.feito;
    return d;
  });

  const addBacklog = (secao, texto) => upd(d => {
    const sec = secao.split(".").reduce((o, k) => o[k], d);
    if (!sec.backlog) sec.backlog = [];
    sec.backlog.push({ id: `bl${Date.now()}`, texto });
    return d;
  });
  const removerBacklog = (secao, id) => upd(d => {
    const sec = secao.split(".").reduce((o, k) => o[k], d);
    sec.backlog = sec.backlog.filter(x => x.id !== id);
    return d;
  });
  const moverParaHoje = (secao, tarefasPath, item) => upd(d => {
    const sec = secao.split(".").reduce((o, k) => o[k], d);
    sec.backlog = sec.backlog.filter(x => x.id !== item.id);
    const tarefas = tarefasPath.split(".").reduce((o, k) => o[k], d);
    tarefas.push({ id: `th${Date.now()}`, label: item.texto, feito: false });
    return d;
  });
  const addHoje = (tarefasPath, texto) => upd(d => {
    const tarefas = tarefasPath.split(".").reduce((o, k) => o[k], d);
    tarefas.push({ id: `th${Date.now()}`, label: texto, feito: false });
    return d;
  });
  const removerHoje = (tarefasPath, id) => upd(d => {
    const arr = tarefasPath.split(".").reduce((o, k) => o[k], d);
    const idx = arr.findIndex(x => x.id === id);
    if (idx !== -1) arr.splice(idx, 1);
    return d;
  });

  const hoje = DIAS[new Date().getDay()];
  const diaAtual = data.casa.rodizio.find(c => c.dia === hoje);
  const tarefasBibliotecaHoje = data.biblioteca.semanal.find(s => s.dia === hoje);
  const habitosFeitos = data.habitos.filter(h => h.feito).length;
  const todasTarefas = [...data.emagrecimento.tarefas, ...data.financeiro.tarefas, ...data.biblioteca.tarefas, ...data.studio.tarefas, ...data.casa.tarefas, ...data.buffet.matutaTarefas];
  const tarefasFeitas = todasTarefas.filter(t => t.feito).length;
  const kgPerdidos = data.emagrecimento.pesoInicial ? Math.max(0, data.emagrecimento.pesoInicial - data.emagrecimento.pesoAtual) : 0;
  const pctEmagrecimento = data.emagrecimento.pesoMeta ? Math.min(100, Math.round((kgPerdidos / data.emagrecimento.pesoMeta) * 100)) : 0;

  const salvarDiario = () => {
    if (!diarioTexto.trim()) return;
    upd(d => { d.diario = [{ id: `d${Date.now()}`, data: new Date().toLocaleDateString("pt-BR"), hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), texto: diarioTexto.trim() }, ...d.diario].slice(0, 60); return d; });
    setDiarioTexto("");
  };

  const addEvento = () => {
    if (!eventoForm.titulo.trim()) return;
    upd(d => { d.buffet.eventos.unshift({ id: `ev${Date.now()}`, titulo: eventoForm.titulo, data: eventoForm.data, horario: eventoForm.horario, dias: eventoForm.dias, tarefas: eventoForm.tarefas.map((t, i) => ({ id: `t${Date.now()}${i}`, texto: t, feito: false })) }); return d; });
    setModalEvento(false);
    setEventoForm({ titulo: "", data: "", horario: "", dias: "", tarefas: [] });
  };

  const toggleEventoTarefa = (evId, tId) => upd(d => {
    const ev = d.buffet.eventos.find(e => e.id === evId);
    if (ev) { const t = ev.tarefas.find(x => x.id === tId); if (t) t.feito = !t.feito; }
    return d;
  });

  const registrarPeso = () => {
    const p = parseFloat(pesoInput.replace(",", "."));
    if (!p) return;
    upd(d => {
      if (!d.emagrecimento.pesoInicial) d.emagrecimento.pesoInicial = p;
      d.emagrecimento.pesoAtual = p;
      d.emagrecimento.registros = [{ data: new Date().toLocaleDateString("pt-BR"), peso: p }, ...d.emagrecimento.registros].slice(0, 30);
      return d;
    });
    setModalPeso(false);
    setPesoInput("");
  };

  const BL = (secao, path) => ({
    backlog: secao.split(".").reduce((o, k) => o[k], data).backlog || [],
    tarefasDia: path.split(".").reduce((o, k) => o[k], data),
    onAddBacklog: t => addBacklog(secao, t),
    onRemoverBacklog: id => removerBacklog(secao, id),
    onMoverParaHoje: item => moverParaHoje(secao, path, item),
    onAddHoje: t => addHoje(path, t),
    onRemoverHoje: id => removerHoje(path, id),
    onToggleHoje: id => toggle(path, id),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#07070e", color: "#e2e8f0", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(160deg, #0c0c1a, #12122a)", padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#8b5cf6", textTransform: "uppercase", marginBottom: 2 }}>Painel de Vida</div>
        <div style={{ fontSize: 20, color: "#f8fafc", marginBottom: 12 }}>Allana Novais ✨</div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { val: `${habitosFeitos}/${data.habitos.length}`, label: "hábitos", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.15)", color: "#c4b5fd" },
            { val: `${tarefasFeitas}/${todasTarefas.length}`, label: "tarefas", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.15)", color: "#6ee7b7" },
            { val: data.biblioteca.assinantes, label: "assinantes", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.15)", color: "#f9a8d4" },
            { val: `R$${(data.biblioteca.assinantes * 33.5).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`, label: "renda/mês", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.15)", color: "#fde68a" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#64748b", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", overflowX: "auto", background: "#0c0c1a", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, padding: "8px 10px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #8b5cf6" : "2px solid transparent", color: tab === t.id ? "#c4b5fd" : "#475569", fontSize: 10, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 50 }}>
            <span style={{ fontSize: 15 }}>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px", maxWidth: 640, margin: "0 auto" }}>

        {/* GERAL */}
        {tab === "geral" && (
          <div>
            <SectionHeader emoji="🏠" title="Painel Geral" color="#8b5cf6" subtitle={`${hoje.toUpperCase()} · ${new Date().toLocaleDateString("pt-BR")}`} />
            <Label>Hábitos do dia</Label>
            <Card>
              {data.habitos.map(h => <Check key={h.id} checked={h.feito} onChange={() => toggle("habitos", h.id)} label={`${h.emoji} ${h.label}`} color="#8b5cf6" detalhe={h.detalhe} />)}
            </Card>
            {tarefasBibliotecaHoje && (
              <Card style={{ borderColor: "rgba(139,92,246,0.2)", marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#8b5cf6", marginBottom: 4 }}>📚 BIBLIOTECA — HOJE</div>
                <div style={{ fontSize: 13, color: "#c4b5fd" }}>🎯 {tarefasBibliotecaHoje.tarefa}</div>
              </Card>
            )}
            {diaAtual && (
              <Card style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>🏡 CASA — HOJE</div>
                    <div style={{ fontSize: 13, color: "#e2e8f0" }}>{diaAtual.emoji} {diaAtual.comodo}</div>
                  </div>
                  <button onClick={() => toggle("casa.rodizio", diaAtual.id)} style={{ background: diaAtual.feito ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${diaAtual.feito ? "#10b981" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "5px 12px", color: diaAtual.feito ? "#6ee7b7" : "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                    {diaAtual.feito ? "✓ Feito" : "Marcar"}
                  </button>
                </div>
              </Card>
            )}
            <Label>Tarefas do dia — todas as áreas</Label>
            {[
              { titulo: "💪 Corpo", tarefas: data.emagrecimento.tarefas, path: "emagrecimento.tarefas", cor: "#ec4899" },
              { titulo: "📚 Biblioteca", tarefas: data.biblioteca.tarefas, path: "biblioteca.tarefas", cor: "#8b5cf6" },
              { titulo: "🖥️ Studio", tarefas: data.studio.tarefas, path: "studio.tarefas", cor: "#10b981" },
              { titulo: "🏡 Casa", tarefas: data.casa.tarefas, path: "casa.tarefas", cor: "#64748b" },
              { titulo: "🍽️ Matuta", tarefas: data.buffet.matutaTarefas, path: "buffet.matutaTarefas", cor: "#f97316" },
            ].map(sec => {
              const f = sec.tarefas.filter(t => t.feito).length;
              return (
                <div key={sec.titulo} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: sec.cor }}>{sec.titulo}</span>
                    <span style={{ fontSize: 11, color: "#475569" }}>{f}/{sec.tarefas.length}</span>
                  </div>
                  <Card style={{ padding: "4px 14px" }}>
                    {sec.tarefas.map(t => <Check key={t.id} checked={t.feito} onChange={() => toggle(sec.path, t.id)} label={t.label} color={sec.cor} small />)}
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* EMAGRECIMENTO */}
        {tab === "emagrecimento" && (
          <div>
            <SectionHeader emoji="💪" title="Emagrecimento" color="#ec4899" subtitle="META: −15KG" />
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <Card style={{ flex: 1, textAlign: "center", padding: "16px 10px" }}>
                <Ring pct={pctEmagrecimento} color="#ec4899" size={72}>
                  <span style={{ fontSize: 11, color: "#ec4899", fontWeight: "bold" }}>{pctEmagrecimento}%</span>
                </Ring>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 10 }}>progresso</div>
              </Card>
              <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Peso inicial", val: data.emagrecimento.pesoInicial ? `${data.emagrecimento.pesoInicial}kg` : "—" },
                  { label: "Peso atual", val: data.emagrecimento.pesoAtual ? `${data.emagrecimento.pesoAtual}kg` : "—" },
                  { label: "Já perdi", val: kgPerdidos > 0 ? `${kgPerdidos.toFixed(1)}kg` : "—" },
                  { label: "Meta", val: `−${data.emagrecimento.pesoMeta || 15}kg` },
                ].map((r, i) => (
                  <div key={i} style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.12)", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: "#f9a8d4", fontWeight: "500" }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setModalPeso(true)} style={{ width: "100%", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 10, padding: "11px", color: "#f9a8d4", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 16 }}>
              ⚖️ Registrar peso de hoje
            </button>
            {data.emagrecimento.registros.length > 0 && (
              <>
                <Label>Histórico de peso</Label>
                <Card>
                  {data.emagrecimento.registros.slice(0, 7).map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                      <span style={{ color: "#64748b" }}>{r.data}</span>
                      <span style={{ color: "#f9a8d4" }}>{r.peso}kg</span>
                    </div>
                  ))}
                </Card>
              </>
            )}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" }} />
            <Backlog color="#ec4899" {...BL("emagrecimento", "emagrecimento.tarefas")} />
          </div>
        )}

        {/* FINANCEIRO */}
        {tab === "financeiro" && (
          <div>
            <SectionHeader emoji="💰" title="Finanças Pessoais" color="#10b981" subtitle={new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()} />
            {(() => {
              const totalFixo = data.financeiro.contasFixas.reduce((s, c) => s + c.valor, 0);
              const totalEntradas = data.financeiro.entradas.reduce((s, e) => s + e.valor, 0);
              const saldo = totalEntradas - totalFixo;
              return (
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <div style={{ flex: 1, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: "bold", color: "#6ee7b7" }}>R${totalEntradas.toLocaleString("pt-BR")}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>entradas</div>
                  </div>
                  <div style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: "bold", color: "#fca5a5" }}>R${totalFixo.toLocaleString("pt-BR")}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>contas fixas</div>
                  </div>
                  <div style={{ flex: 1, background: saldo >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${saldo >= 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: "bold", color: saldo >= 0 ? "#6ee7b7" : "#fca5a5" }}>{saldo >= 0 ? "+" : ""}R${saldo.toLocaleString("pt-BR")}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>saldo</div>
                  </div>
                </div>
              );
            })()}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Label color="#10b981">Entradas do mês</Label>
              <button onClick={() => setModalEntrada(true)} style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "4px 12px", color: "#6ee7b7", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Adicionar</button>
            </div>
            <Card style={{ padding: "4px 16px" }}>
              {data.financeiro.entradas.length === 0 && <div style={{ fontSize: 12, color: "#475569", padding: "10px 0" }}>Nenhuma entrada registrada.</div>}
              {data.financeiro.entradas.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#e2e8f0" }}>{e.descricao}</div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{e.data}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, color: "#6ee7b7", fontWeight: "500" }}>+R${e.valor.toLocaleString("pt-BR")}</span>
                    <button onClick={() => upd(d => { d.financeiro.entradas.splice(i, 1); return d; })} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 15, padding: 0 }}>×</button>
                  </div>
                </div>
              ))}
            </Card>
            <Label color="#ef4444">Contas fixas do mês</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.financeiro.contasFixas.map(c => (
                <div key={c.id} onClick={() => upd(d => { const x = d.financeiro.contasFixas.find(x => x.id === c.id); if (x) x.pago = !x.pago; return d; })} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: c.pago ? "#10b981" : "transparent", border: `2px solid ${c.pago ? "#10b981" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {c.pago && <span style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: c.pago ? "#475569" : "#e2e8f0", textDecoration: c.pago ? "line-through" : "none" }}>{c.emoji} {c.label}</span>
                  </div>
                  <span style={{ fontSize: 13, color: c.pago ? "#475569" : "#fca5a5", fontWeight: "500" }}>R${c.valor.toLocaleString("pt-BR")}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Total</span>
                <span style={{ fontSize: 13, color: "#fca5a5", fontWeight: "bold" }}>R${data.financeiro.contasFixas.reduce((s, c) => s + c.valor, 0).toLocaleString("pt-BR")}</span>
              </div>
            </Card>
            <Label color="#ef4444">🔴 Dívidas — quitar com urgência</Label>
            {data.financeiro.dividas.map(d => {
              const pctQ = Math.round(((d.valorInicial - d.valorAtual) / d.valorInicial) * 100);
              return (
                <Card key={d.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, color: "#f1f5f9" }}>{d.emoji} {d.label}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Já quitado: <span style={{ color: "#6ee7b7" }}>R${(d.valorInicial - d.valorAtual).toLocaleString("pt-BR")}</span></div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: "bold", color: d.valorAtual === 0 ? "#6ee7b7" : "#fca5a5" }}>{d.valorAtual === 0 ? "✅ QUITADA" : `R$${d.valorAtual.toLocaleString("pt-BR")}`}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>restante</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, marginBottom: 10 }}>
                    <div style={{ width: `${pctQ}%`, background: "#10b981", borderRadius: 4, height: "100%", transition: "width 0.6s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{pctQ}% quitado</span>
                    <button onClick={() => { setModalDivida(d.id); setDividaInput(""); }} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "4px 12px", color: "#6ee7b7", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Registrar pagamento</button>
                  </div>
                </Card>
              );
            })}
            <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 4 }}>💸 TOTAL DE DÍVIDAS</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#fca5a5" }}>R${data.financeiro.dividas.reduce((s, d) => s + d.valorAtual, 0).toLocaleString("pt-BR")}</div>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" }} />
            <Backlog color="#10b981" {...BL("financeiro", "financeiro.tarefas")} />
          </div>
        )}

        {/* METAS */}
        {tab === "metas" && (
          <div>
            <SectionHeader emoji="🎯" title="Metas" color="#8b5cf6" subtitle="OBJETIVOS & PROGRESSO" />
            {data.metas.map(m => {
              const pct = Math.min(100, Math.round((m.atual / m.meta) * 100));
              const editing = editMetaVal[m.id] !== undefined;
              return (
                <Card key={m.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Ring pct={pct} color={m.cor} size={64}>
                    <span style={{ fontSize: 16 }}>{m.emoji}</span>
                    <span style={{ fontSize: 9, color: m.cor, fontWeight: "bold" }}>{pct}%</span>
                  </Ring>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#f1f5f9", marginBottom: 6 }}>{m.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      {editing ? (
                        <input autoFocus value={editMetaVal[m.id]} onChange={e => setEditMetaVal(v => ({ ...v, [m.id]: e.target.value }))}
                          onBlur={() => { upd(d => { const x = d.metas.find(x => x.id === m.id); if (x) x.atual = Number(editMetaVal[m.id]) || x.atual; return d; }); setEditMetaVal(v => { const n = { ...v }; delete n[m.id]; return n; }); }}
                          onKeyDown={e => { if (e.key === "Enter") { upd(d => { const x = d.metas.find(x => x.id === m.id); if (x) x.atual = Number(editMetaVal[m.id]) || x.atual; return d; }); setEditMetaVal(v => { const n = { ...v }; delete n[m.id]; return n; }); } }}
                          style={{ width: 90, background: "rgba(255,255,255,0.08)", border: `1px solid ${m.cor}`, borderRadius: 6, padding: "3px 8px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                      ) : (
                        <button onClick={() => setEditMetaVal(v => ({ ...v, [m.id]: String(m.atual) }))} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, padding: "3px 10px", color: m.cor, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                          {m.prefix || ""}{m.atual.toLocaleString("pt-BR")}
                        </button>
                      )}
                      <span style={{ fontSize: 11, color: "#475569" }}>/ {m.prefix || ""}{m.meta.toLocaleString("pt-BR")}</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 3 }}>
                      <div style={{ width: `${pct}%`, background: m.cor, borderRadius: 3, height: "100%", transition: "width 0.6s", minWidth: pct > 0 ? 4 : 0 }} />
                    </div>
                  </div>
                </Card>
              );
            })}
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#10b981", marginBottom: 8 }}>💡 RECEITA PROJETADA — BIBLIOTECA</div>
              {[["100 assinantes","R$ 3.350/mês"],["300 assinantes","R$ 10.050/mês"],["1.000 assinantes","R$ 33.500/mês"]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                  <span style={{ color: "#64748b" }}>{l}</span>
                  <span style={{ color: "#6ee7b7" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BIBLIOTECA */}
        {tab === "biblioteca" && (
          <div>
            <SectionHeader emoji="📚" title="Biblioteca do Render" color="#8b5cf6" subtitle="META: 1.000 ASSINANTES" />
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <Card style={{ flex: 1, textAlign: "center", padding: "16px 10px" }}>
                <Ring pct={Math.round((data.biblioteca.assinantes / 1000) * 100)} color="#8b5cf6" size={68}>
                  <span style={{ fontSize: 16, color: "#c4b5fd", fontWeight: "bold" }}>{data.biblioteca.assinantes}</span>
                  <span style={{ fontSize: 9, color: "#8b5cf6" }}>assinantes</span>
                </Ring>
                <button onClick={() => { const v = prompt("Atualizar assinantes:"); if (v) upd(d => { d.biblioteca.assinantes = Number(v) || d.biblioteca.assinantes; const m = d.metas.find(x => x.id === "m1"); if (m) m.atual = Number(v) || m.atual; return d; }); }} style={{ marginTop: 8, background: "rgba(139,92,246,0.12)", border: "none", borderRadius: 6, padding: "4px 12px", color: "#c4b5fd", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>atualizar</button>
              </Card>
              <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 8 }}>
                <Card style={{ padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>Renda atual</div>
                  <div style={{ fontSize: 16, color: "#6ee7b7", fontWeight: "bold" }}>R$ {(data.biblioteca.assinantes * 33.5).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                </Card>
                <Card style={{ padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>Faltam</div>
                  <div style={{ fontSize: 16, color: "#c4b5fd", fontWeight: "bold" }}>{1000 - data.biblioteca.assinantes} assinantes</div>
                </Card>
              </div>
            </div>
            <Label color="#8b5cf6">Blocos semanais</Label>
            <Card>
              {data.biblioteca.semanal.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ minWidth: 32, fontSize: 11, color: s.dia === hoje ? "#c4b5fd" : "#475569", fontWeight: s.dia === hoje ? "bold" : "normal" }}>{s.dia}</div>
                  <div style={{ fontSize: 12, color: s.dia === hoje ? "#e2e8f0" : "#64748b" }}>{s.tarefa}</div>
                  {s.dia === hoje && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />}
                </div>
              ))}
            </Card>
            <Label>Notas</Label>
            <textarea value={data.biblioteca.notas || ""} onChange={e => upd(d => { d.biblioteca.notas = e.target.value; return d; })} placeholder="Ideias, próximos conteúdos..." style={{ width: "100%", minHeight: 80, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", color: "#e2e8f0", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 20 }} />
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />
            <Backlog color="#8b5cf6" {...BL("biblioteca", "biblioteca.tarefas")} />
          </div>
        )}

        {/* STUDIO */}
        {tab === "studio" && (
          <div>
            <SectionHeader emoji="🖥️" title="Studio de Renderização" color="#10b981" subtitle="CLIENTES & PROJETOS" />
            <Label color="#10b981">Projetos ativos</Label>
            {data.studio.projetos.map(p => (
              <Card key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#f1f5f9" }}>{p.nome}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{p.etapa}</div>
                </div>
                <button onClick={() => { const e = prompt("Atualizar etapa:", p.etapa); if (e) upd(d => { const x = d.studio.projetos.find(x => x.id === p.id); if (x) x.etapa = e; return d; }); }} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 7, padding: "5px 10px", color: "#6ee7b7", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>editar</button>
              </Card>
            ))}
            <Label>Notas</Label>
            <textarea value={data.studio.notas || ""} onChange={e => upd(d => { d.studio.notas = e.target.value; return d; })} placeholder="Clientes, pendências..." style={{ width: "100%", minHeight: 80, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", color: "#e2e8f0", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 20 }} />
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />
            <Backlog color="#10b981" {...BL("studio", "studio.tarefas")} />
          </div>
        )}

        {/* CASA */}
        {tab === "casa" && (
          <div>
            <SectionHeader emoji="🏡" title="Casa" color="#64748b" subtitle="MANUTENÇÃO & ORGANIZAÇÃO" />
            {diaAtual && (
              <div style={{ background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.22)", borderLeft: "4px solid #64748b", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>TAREFA DE HOJE</div>
                <div style={{ fontSize: 15, color: "#f1f5f9" }}>{diaAtual.emoji} {diaAtual.comodo}</div>
                <button onClick={() => toggle("casa.rodizio", diaAtual.id)} style={{ marginTop: 10, background: diaAtual.feito ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${diaAtual.feito ? "#10b981" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "6px 14px", color: diaAtual.feito ? "#6ee7b7" : "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  {diaAtual.feito ? "✓ Feito!" : "Marcar como feito"}
                </button>
              </div>
            )}
            <Label>Rodízio semanal</Label>
            {data.casa.rodizio.map(item => (
              <div key={item.id} onClick={() => toggle("casa.rodizio", item.id)} style={{ display: "flex", alignItems: "center", gap: 12, background: item.dia === hoje ? "rgba(100,116,139,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${item.dia === hoje ? "rgba(100,116,139,0.22)" : "rgba(255,255,255,0.05)"}`, borderRadius: 12, padding: "11px 14px", marginBottom: 8, cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: item.dia === hoje ? "#94a3b8" : "#475569", marginBottom: 1 }}>{item.dia}{item.dia === hoje ? " — hoje" : ""}</div>
                  <div style={{ fontSize: 13, color: item.feito ? "#475569" : "#e2e8f0", textDecoration: item.feito ? "line-through" : "none" }}>{item.comodo}</div>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: item.feito ? "#10b981" : "transparent", border: `2px solid ${item.feito ? "#10b981" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.feito && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)", borderLeft: "4px solid #f97316", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#f97316" }}>⚠️ Toda noite — INEGOCIÁVEL</div>
              <div style={{ fontSize: 13, color: "#e2e8f0", marginTop: 4 }}>🍽️ Cozinha zerada antes de dormir</div>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />
            <Backlog color="#94a3b8" {...BL("casa", "casa.tarefas")} />
          </div>
        )}

        {/* BUFFET */}
        {tab === "buffet" && (
          <div>
            <SectionHeader emoji="🍽️" title="Buffet & Matuta" color="#f97316" subtitle="EVENTOS & IFOOD" />
            <Backlog color="#f97316" {...BL("buffet", "buffet.matutaTarefas")} />
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Label color="#f97316">Eventos do buffet</Label>
              <button onClick={() => setModalEvento(true)} style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8, padding: "5px 12px", color: "#fdba74", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Novo evento</button>
            </div>
            {data.buffet.eventos.length === 0 && <div style={{ textAlign: "center", padding: "30px", color: "#475569", fontSize: 13 }}>Nenhum evento cadastrado.</div>}
            {data.buffet.eventos.map(ev => {
              const f = ev.tarefas.filter(t => t.feito).length;
              const pct = ev.tarefas.length ? Math.round((f / ev.tarefas.length) * 100) : 0;
              const calLink = ev.data ? gerarLinkCalendar(ev.titulo, ev.data, ev.horario, ev.dias) : null;
              return (
                <Card key={ev.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, color: "#f1f5f9" }}>{ev.titulo}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{ev.data}{ev.horario ? ` às ${ev.horario}` : ""}{ev.dias ? ` · ${ev.dias} dias` : ""}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#f97316", background: "rgba(249,115,22,0.1)", padding: "2px 8px", borderRadius: 20 }}>{f}/{ev.tarefas.length}</span>
                      <button onClick={() => upd(d => { d.buffet.eventos = d.buffet.eventos.filter(e => e.id !== ev.id); return d; })} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                    </div>
                  </div>
                  {ev.tarefas.length > 0 && <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 3, height: 3, marginBottom: 10 }}><div style={{ width: `${pct}%`, background: "#f97316", borderRadius: 3, height: "100%", transition: "width 0.5s" }} /></div>}
                  <div style={{ padding: "0 0 0 2px" }}>
                    {ev.tarefas.map(t => <Check key={t.id} checked={t.feito} onChange={() => toggleEventoTarefa(ev.id, t.id)} label={t.texto} color="#f97316" small />)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <button onClick={() => { const txt = prompt("Nova tarefa:"); if (txt) upd(d => { const e = d.buffet.eventos.find(x => x.id === ev.id); if (e) e.tarefas.push({ id: `t${Date.now()}`, texto: txt, feito: false }); return d; }); }} style={{ background: "none", border: "none", color: "#475569", fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>+ tarefa</button>
                    {calLink && <a href={calLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(66,133,244,0.12)", border: "1px solid rgba(66,133,244,0.25)", borderRadius: 8, padding: "4px 10px", color: "#93c5fd", fontSize: 11, textDecoration: "none" }}>📅 Google Calendar</a>}
                  </div>
                </Card>
              );
            })}
            <Card>
              <div style={{ fontSize: 11, color: "#f97316", marginBottom: 8 }}>💡 Sugestões antes do evento</div>
              {(data.buffet.tarefasPadrao?.antes || []).map((s, i) => <div key={i} style={{ fontSize: 12, color: "#64748b", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>· {s}</div>)}
              <div style={{ fontSize: 11, color: "#10b981", margin: "12px 0 8px" }}>Depois do evento</div>
              {(data.buffet.tarefasPadrao?.depois || []).map((s, i) => <div key={i} style={{ fontSize: 12, color: "#64748b", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>· {s}</div>)}
            </Card>
          </div>
        )}

        {/* DIÁRIO */}
        {tab === "diario" && (
          <div>
            <SectionHeader emoji="📓" title="Diário" color="#a78bfa" subtitle="REGISTRO DIÁRIO" />
            <textarea value={diarioTexto} onChange={e => setDiarioTexto(e.target.value)} placeholder="O que aconteceu hoje? O que você conquistou? Como está se sentindo?" style={{ width: "100%", minHeight: 130, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px", color: "#e2e8f0", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.7, boxSizing: "border-box" }} />
            <button onClick={salvarDiario} style={{ width: "100%", marginTop: 10, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.22)", borderRadius: 10, padding: "12px", color: "#c4b5fd", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 24 }}>Salvar registro</button>
            {data.diario.map(e => (
              <Card key={e.id}>
                <div style={{ fontSize: 10, color: "#475569", marginBottom: 8 }}>{e.data} às {e.hora}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{e.texto}</div>
              </Card>
            ))}
            {data.diario.length === 0 && <div style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: "30px 0" }}>Nenhum registro ainda.</div>}
          </div>
        )}

        {/* CONFIG */}
        {tab === "config" && (
          <div>
            <SectionHeader emoji="⚙️" title="Configurações" color="#64748b" subtitle="EDITAR TUDO" />

            <Label color="#8b5cf6">Hábitos diários</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.habitos.map((h, i) => (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <input value={h.emoji} onChange={e => upd(d => { d.habitos[i].emoji = e.target.value; return d; })} style={{ width: 36, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px", color: "#fff", fontSize: 14, textAlign: "center", outline: "none" }} />
                  <input value={h.label} onChange={e => upd(d => { d.habitos[i].label = e.target.value; return d; })} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <button onClick={() => upd(d => { d.habitos.splice(i, 1); return d; })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                </div>
              ))}
              <button onClick={() => upd(d => { d.habitos.push({ id: `h${Date.now()}`, emoji: "✨", label: "Novo hábito", feito: false }); return d; })} style={{ width: "100%", background: "none", border: "none", color: "#8b5cf6", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "10px 0", textAlign: "left" }}>+ Adicionar hábito</button>
            </Card>

            <Label color="#10b981">Metas</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.metas.map((m, i) => (
                <div key={m.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input value={m.emoji} onChange={e => upd(d => { d.metas[i].emoji = e.target.value; return d; })} style={{ width: 36, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px", color: "#fff", fontSize: 14, textAlign: "center", outline: "none" }} />
                    <input value={m.label} onChange={e => upd(d => { d.metas[i].label = e.target.value; return d; })} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => upd(d => { d.metas.splice(i, 1); return d; })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Atual</div>
                      <input type="number" value={m.atual} onChange={e => upd(d => { d.metas[i].atual = Number(e.target.value); return d; })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Meta</div>
                      <input type="number" value={m.meta} onChange={e => upd(d => { d.metas[i].meta = Number(e.target.value); return d; })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => upd(d => { d.metas.push({ id: `m${Date.now()}`, emoji: "🎯", label: "Nova meta", atual: 0, meta: 100, cor: "#8b5cf6" }); return d; })} style={{ width: "100%", background: "none", border: "none", color: "#10b981", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "10px 0", textAlign: "left" }}>+ Adicionar meta</button>
            </Card>

            <Label color="#ef4444">Contas fixas</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.financeiro.contasFixas.map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <input value={c.emoji} onChange={e => upd(d => { d.financeiro.contasFixas[i].emoji = e.target.value; return d; })} style={{ width: 36, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px", color: "#fff", fontSize: 14, textAlign: "center", outline: "none" }} />
                  <input value={c.label} onChange={e => upd(d => { d.financeiro.contasFixas[i].label = e.target.value; return d; })} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <input type="number" value={c.valor} onChange={e => upd(d => { d.financeiro.contasFixas[i].valor = Number(e.target.value); return d; })} style={{ width: 80, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 8px", color: "#fca5a5", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <button onClick={() => upd(d => { d.financeiro.contasFixas.splice(i, 1); return d; })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                </div>
              ))}
              <button onClick={() => upd(d => { d.financeiro.contasFixas.push({ id: `cf${Date.now()}`, emoji: "💳", label: "Nova conta", valor: 0, pago: false }); return d; })} style={{ width: "100%", background: "none", border: "none", color: "#ef4444", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "10px 0", textAlign: "left" }}>+ Adicionar conta fixa</button>
            </Card>

            <Label color="#ef4444">Dívidas</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.financeiro.dividas.map((d, i) => (
                <div key={d.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input value={d.emoji} onChange={e => upd(dd => { dd.financeiro.dividas[i].emoji = e.target.value; return dd; })} style={{ width: 36, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px", color: "#fff", fontSize: 14, textAlign: "center", outline: "none" }} />
                    <input value={d.label} onChange={e => upd(dd => { dd.financeiro.dividas[i].label = e.target.value; return dd; })} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => upd(dd => { dd.financeiro.dividas.splice(i, 1); return dd; })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Valor inicial</div>
                      <input type="number" value={d.valorInicial} onChange={e => upd(dd => { dd.financeiro.dividas[i].valorInicial = Number(e.target.value); return dd; })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#fca5a5", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Valor atual</div>
                      <input type="number" value={d.valorAtual} onChange={e => upd(dd => { dd.financeiro.dividas[i].valorAtual = Number(e.target.value); return dd; })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#fca5a5", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => upd(d => { d.financeiro.dividas.push({ id: `dv${Date.now()}`, emoji: "💸", label: "Nova dívida", valorInicial: 0, valorAtual: 0, cor: "#ef4444" }); return d; })} style={{ width: "100%", background: "none", border: "none", color: "#ef4444", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "10px 0", textAlign: "left" }}>+ Adicionar dívida</button>
            </Card>

            <Label color="#10b981">Projetos Studio</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.studio.projetos.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ flex: 1 }}>
                    <input value={p.nome} onChange={e => upd(d => { d.studio.projetos[i].nome = e.target.value; return d; })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit", marginBottom: 4, boxSizing: "border-box" }} />
                    <input value={p.etapa} onChange={e => upd(d => { d.studio.projetos[i].etapa = e.target.value; return d; })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#64748b", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  <button onClick={() => upd(d => { d.studio.projetos.splice(i, 1); return d; })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                </div>
              ))}
              <button onClick={() => upd(d => { d.studio.projetos.push({ id: `p${Date.now()}`, nome: "Novo projeto", etapa: "Em andamento" }); return d; })} style={{ width: "100%", background: "none", border: "none", color: "#10b981", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "10px 0", textAlign: "left" }}>+ Adicionar projeto</button>
            </Card>

            <Label color="#64748b">Rodízio da casa</Label>
            <Card style={{ padding: "4px 16px" }}>
              {data.casa.rodizio.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <input value={r.emoji} onChange={e => upd(d => { d.casa.rodizio[i].emoji = e.target.value; return d; })} style={{ width: 36, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px", color: "#fff", fontSize: 14, textAlign: "center", outline: "none" }} />
                  <select value={r.dia} onChange={e => upd(d => { d.casa.rodizio[i].dia = e.target.value; return d; })} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                    {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(dd => <option key={dd} value={dd} style={{ background: "#1a1a2e" }}>{dd}</option>)}
                  </select>
                  <input value={r.comodo} onChange={e => upd(d => { d.casa.rodizio[i].comodo = e.target.value; return d; })} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <button onClick={() => upd(d => { d.casa.rodizio.splice(i, 1); return d; })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                </div>
              ))}
              <button onClick={() => upd(d => { d.casa.rodizio.push({ id: `ca${Date.now()}`, dia: "Seg", comodo: "Novo cômodo", emoji: "🏠", feito: false }); return d; })} style={{ width: "100%", background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "10px 0", textAlign: "left" }}>+ Adicionar cômodo</button>
            </Card>

            <div style={{ marginTop: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 8 }}>⚠️ Zona de perigo</div>
              <button onClick={() => { if (window.confirm("Tem certeza? Isso apaga TODOS os dados.")) { localStorage.removeItem(STORAGE_KEY); window.location.reload(); } }} style={{ width: "100%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "11px", color: "#fca5a5", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                🗑️ Resetar todos os dados
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL NOVO EVENTO */}
      {modalEvento && (
        <BottomModal onClose={() => setModalEvento(false)}>
          <div style={{ fontSize: 15, color: "#f1f5f9", marginBottom: 18 }}>🎪 Novo evento do Buffet</div>
          <input placeholder="Nome do evento" value={eventoForm.titulo} onChange={e => setEventoForm(p => ({ ...p, titulo: e.target.value }))} style={inp} />
          <input placeholder="Data (ex: 30/05)" value={eventoForm.data} onChange={e => setEventoForm(p => ({ ...p, data: e.target.value }))} style={inp} />
          <input placeholder="Horário (ex: 18h)" value={eventoForm.horario} onChange={e => setEventoForm(p => ({ ...p, horario: e.target.value }))} style={inp} />
          <input placeholder="Duração (ex: 3 dias)" value={eventoForm.dias} onChange={e => setEventoForm(p => ({ ...p, dias: e.target.value }))} style={{ ...inp, marginBottom: 14 }} />
          {eventoForm.tarefas.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "8px 14px", marginBottom: 12 }}>
              {eventoForm.tarefas.map((t, i) => <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "4px 0" }}>✓ {t}</div>)}
            </div>
          )}
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>Sugestões rápidas:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {[...(data.buffet.tarefasPadrao?.antes || []), ...(data.buffet.tarefasPadrao?.depois || [])].filter(s => !eventoForm.tarefas.includes(s)).map((s, i) => (
              <button key={i} onClick={() => setEventoForm(p => ({ ...p, tarefas: [...p.tarefas, s] }))} style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 20, padding: "4px 10px", color: "#fdba74", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ {s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input placeholder="Ou escreva uma tarefa..." value={novaTarefa} onChange={e => setNovaTarefa(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && novaTarefa.trim()) { setEventoForm(p => ({ ...p, tarefas: [...p.tarefas, novaTarefa.trim()] })); setNovaTarefa(""); } }} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => { if (novaTarefa.trim()) { setEventoForm(p => ({ ...p, tarefas: [...p.tarefas, novaTarefa.trim()] })); setNovaTarefa(""); } }} style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 10, padding: "10px 14px", color: "#fdba74", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+</button>
          </div>
          <button onClick={addEvento} style={{ width: "100%", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 12, padding: "14px", color: "#fdba74", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Salvar evento</button>
        </BottomModal>
      )}

      {/* MODAL ENTRADA */}
      {modalEntrada && (
        <BottomModal onClose={() => setModalEntrada(false)}>
          <div style={{ fontSize: 15, color: "#f1f5f9", marginBottom: 18 }}>💚 Registrar entrada</div>
          <input placeholder="Descrição (ex: Biblioteca, Cliente...)" value={entradaForm.descricao} onChange={e => setEntradaForm(p => ({ ...p, descricao: e.target.value }))} style={inp} />
          <input placeholder="Valor (ex: 1500)" value={entradaForm.valor} onChange={e => setEntradaForm(p => ({ ...p, valor: e.target.value }))} style={inp} />
          <button onClick={() => { const v = parseFloat(entradaForm.valor.replace(",", ".")); if (v && entradaForm.descricao) { upd(d => { d.financeiro.entradas.push({ descricao: entradaForm.descricao, valor: v, data: new Date().toLocaleDateString("pt-BR") }); return d; }); setModalEntrada(false); setEntradaForm({ descricao: "", valor: "" }); } }} style={{ width: "100%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px", color: "#6ee7b7", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Salvar entrada</button>
        </BottomModal>
      )}

      {/* MODAL PAGAMENTO DÍVIDA */}
      {modalDivida && (
        <BottomModal onClose={() => setModalDivida(null)}>
          {(() => {
            const div = data.financeiro.dividas.find(x => x.id === modalDivida);
            if (!div) return null;
            return (
              <>
                <div style={{ fontSize: 15, color: "#f1f5f9", marginBottom: 4 }}>💸 Registrar pagamento</div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>{div.emoji} {div.label} — restante: R${div.valorAtual.toLocaleString("pt-BR")}</div>
                <input placeholder="Valor pago (ex: 500)" value={dividaInput} onChange={e => setDividaInput(e.target.value)} style={inp} />
                <button onClick={() => { const v = parseFloat(dividaInput.replace(",", ".")); if (v) { upd(d => { const x = d.financeiro.dividas.find(x => x.id === modalDivida); if (x) x.valorAtual = Math.max(0, x.valorAtual - v); return d; }); setModalDivida(null); } }} style={{ width: "100%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px", color: "#6ee7b7", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Confirmar pagamento</button>
              </>
            );
          })()}
        </BottomModal>
      )}

      {/* MODAL PESO */}
      {modalPeso && (
        <BottomModal onClose={() => setModalPeso(false)}>
          <div style={{ fontSize: 15, color: "#f1f5f9", marginBottom: 18 }}>⚖️ Registrar peso</div>
          {!data.emagrecimento.pesoMeta && <input placeholder="Meta de perda (kg) — ex: 15" style={inp} onChange={e => upd(d => { d.emagrecimento.pesoMeta = Number(e.target.value.replace(",", ".")) || 15; return d; })} />}
          <input placeholder="Peso atual (kg) — ex: 72,5" value={pesoInput} onChange={e => setPesoInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") registrarPeso(); }} style={inp} />
          <button onClick={registrarPeso} style={{ width: "100%", background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 12, padding: "14px", color: "#f9a8d4", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Salvar</button>
        </BottomModal>
      )}

    </div>
  );
}
