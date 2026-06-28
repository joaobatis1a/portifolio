import { useEffect, useRef, useState } from "react";

/* ── Data ── */
const UNLOCKED = [
  {
    id: "limpattack",
    name: "Limpattack",
    period: "Fev 2025 – Jun 2025",
    shortDesc: "Jogo educativo interativo inspirado em Pokémon, para crianças de 6–10 anos. Foco em higiene e combate a bactérias.",
    fullDesc: "Jogo educativo interativo inspirado na franquia Pokémon, voltado para crianças de 6 a 10 anos com foco em higiene e combate a bactérias. Atuei como desenvolvedor principal do sistema de batalha e mecânicas de progressão, além de liderar a integração visual com Pygame. Desenvolvido em equipe com Python e Pygame.",
    role: "Desenvolvedor de Gameplay & Integração Visual",
    stack: ["Python", "Pygame"],
    github: "https://github.com/joaobatis1a",
    demo: "#",
    trailer: "/trailer_limpattack.mp4",
    award: "🏆 1º Lugar",
    mx: 210, my: 210,
    color: {
      base: "rgba(251,191,36,0.95)",
      glow: "rgba(251,191,36,0.6)",
      bg: "rgba(251,191,36,0.12)",
      border: "rgba(251,191,36,0.35)",
      text: "rgba(253,230,138,0.95)",
      ping: "rgba(251,191,36,0.3)",
      hex: "#FBbf24",
      solid: "rgba(251,191,36,0.08)",
    },
  },
  {
    id: "benevo",
    name: "Benevo",
    period: "Jul 2025 – Dez 2025",
    shortDesc: "Sistema de gestão de doações para ONGs com controle de estoque, recebimento e distribuição de itens.",
    fullDesc: "Sistema de gestão de doações para ONGs com controle de estoque, recebimento e distribuição de itens. Assumi o papel de Scrum Master durante todos os sprints e liderei a equipe de front-end, definindo arquitetura de componentes, padrões de design system e garantindo a entrega de interfaces acessíveis e responsivas. A plataforma impactou diretamente o fluxo de trabalho de voluntários em campo.",
    role: "Líder de Front-end & Scrum Master",
    stack: ["HTML", "CSS", "JavaScript", "Java", "MongoDB"],
    github: "https://github.com/joaobatis1a",
    demo: "#",
    trailer: null,
    award: "🥈 2º Lugar",
    mx: 420, my: 275,
    color: {
      base: "rgba(59,130,246,0.95)",
      glow: "rgba(59,130,246,0.6)",
      bg: "rgba(59,130,246,0.12)",
      border: "rgba(59,130,246,0.35)",
      text: "rgba(147,197,253,0.95)",
      ping: "rgba(59,130,246,0.3)",
      hex: "#3b82f6",
      solid: "rgba(59,130,246,0.08)",
    },
  },
  {
    id: "ponte",
    name: "P.O.N.T.E",
    period: "Jan 2026 – presente",
    shortDesc: "Plataforma que conecta jovens talentos a oportunidades profissionais reais.",
    fullDesc: "Plataforma de Oportunidades e Novos Talentos Emergentes — conecta jovens talentos a oportunidades profissionais reais. Conduzi os rituais ágeis como Scrum Master e dirigi toda a frente de design e desenvolvimento front-end: sistema de rotas, componentização, prototipagem no Figma e handoff para o time. O projeto nasceu de uma demanda real identificada durante vivências acadêmicas.",
    role: "Líder de Front-end & Scrum Master",
    stack: ["HTML", "CSS", "JavaScript", "Figma"],
    github: "https://github.com/joaobatis1a",
    demo: "#",
    trailer: null,
    award: "🏆 1º Lugar",
    mx: 600, my: 215,
    color: {
      base: "rgba(249,115,22,0.95)",
      glow: "rgba(249,115,22,0.6)",
      bg: "rgba(249,115,22,0.12)",
      border: "rgba(249,115,22,0.35)",
      text: "rgba(253,186,116,0.95)",
      ping: "rgba(249,115,22,0.3)",
      hex: "#f97316",
      solid: "rgba(249,115,22,0.08)",
    },
  },
];

const LOCKED = [
  {
    id: "guts",
    name: "Guts",
    date: "23/08/2026",
    mx: 310, my: 400,
    hint: "Um sistema que age antes de você pensar.",
    fullHint: "Uma ferramenta de automação inteligente projetada para antecipar padrões e executar ações antes mesmo da interação humana. Arquitetura orientada a eventos com aprendizado incremental.",
    classLevel: "ALPHA",
    stack: ["?", "?", "?"],
  },
  {
    id: "praxis",
    name: "Praxis",
    date: "15/10/2026",
    mx: 530, my: 435,
    hint: "Onde teoria e prática finalmente se encontram.",
    fullHint: "Plataforma educacional que transforma conceitos abstratos em experimentos práticos interativos. Simulações em tempo real, feedback imediato e currículo adaptativo.",
    classLevel: "BETA",
    stack: ["?", "?"],
  },
  {
    id: "kairos",
    name: "Kairos",
    date: "20/01/2027",
    mx: 415, my: 165,
    hint: "O momento certo. A janela que não reabre.",
    fullHint: "Sistema de análise temporal que identifica janelas críticas de oportunidade em fluxos de dados. Processamento em stream com visualizações em tempo real.",
    classLevel: "OMEGA",
    stack: ["?", "?", "?", "?"],
  },
];

const ISLAND_PATH = `
  M 110 330
  C  75 280,  65 220,  95 175
  C 120 138, 165 115, 215 100
  C 260  87, 295  70, 350  62
  C 400  55, 445  46, 495  58
  C 545  70, 575  92, 610 112
  C 648 133, 675 155, 698 182
  C 725 212, 730 246, 724 278
  C 718 308, 700 332, 688 358
  C 670 392, 664 420, 644 448
  C 620 480, 590 500, 556 516
  C 520 532, 482 540, 448 546
  C 410 552, 372 554, 334 549
  C 292 543, 252 526, 220 508
  C 184 488, 156 462, 138 432
  C 118 400, 116 368, 110 330 Z
`;

type UnlockedProject = typeof UNLOCKED[0];
type LockedProject = typeof LOCKED[0];

/* ── Per-project card effects ── */

// Limpattack: pixel battle sparks — small squares bursting from center like hits
function LimpattackEffect() {
  type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; id: number };
  const [sparks, setSparks] = useState<Spark[]>([]);
  const spawnRef = useRef<number>();
  const rafRef = useRef<number>();
  useEffect(() => {
    let id = 0;
    const spawn = () => {
      setSparks(prev => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.8;
        const fresh: Spark[] = Array.from({ length: 3 }, () => {
          const a = angle + (Math.random() - 0.5) * 1.2;
          return { x: 110 + Math.cos(a) * 12, y: 70 + Math.sin(a) * 10, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 0.5, life: 1, size: Math.random() * 4 + 2, id: id++ };
        });
        return [...prev.filter(p => p.life > 0), ...fresh].slice(-30);
      });
      spawnRef.current = window.setTimeout(spawn, 180);
    };
    const tick = () => {
      setSparks(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.08, life: p.life - 0.045 })).filter(p => p.life > 0));
      rafRef.current = requestAnimationFrame(tick);
    };
    spawn(); rafRef.current = requestAnimationFrame(tick);
    return () => { clearTimeout(spawnRef.current); cancelAnimationFrame(rafRef.current!); };
  }, []);
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140">
      {/* Pixel grid hint */}
      {Array.from({ length: 6 }, (_, i) => Array.from({ length: 4 }, (_, j) => (
        <rect key={`${i}-${j}`} x={18 + i * 30} y={12 + j * 30} width="4" height="4"
          fill="rgba(251,191,36,0.08)" rx="0.5" />
      )))}
      {/* Battle sparks as pixel squares */}
      {sparks.map(s => (
        <rect key={s.id}
          x={s.x - s.size / 2} y={s.y - s.size / 2}
          width={s.size * s.life} height={s.size * s.life}
          fill={s.life > 0.6 ? "#FBbf24" : "#f97316"}
          opacity={s.life * 0.9} rx="0.5"
        />
      ))}
      {/* HP bar flicker at top */}
      <rect x="12" y="8" width="80" height="6" rx="3" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.25)" strokeWidth="0.5" />
      <rect x="12" y="8" width={`${55 + Math.sin(Date.now() / 300) * 8}`} height="6" rx="3" fill="rgba(251,191,36,0.5)" style={{ animation: "hpFlicker 1.8s ease-in-out infinite" }} />
    </svg>
  );
}

// Benevo: floating donation hearts/packages drifting upward
function BenevoEffect() {
  type Item = { x: number; y: number; vy: number; vx: number; life: number; type: "heart" | "box"; id: number; rot: number };
  const [items, setItems] = useState<Item[]>([]);
  const spawnRef = useRef<number>();
  const rafRef = useRef<number>();
  useEffect(() => {
    let id = 0;
    const spawn = () => {
      setItems(prev => {
        const isHeart = Math.random() > 0.4;
        const fresh: Item = { x: 20 + Math.random() * 180, y: 130, vy: -(Math.random() * 0.9 + 0.4), vx: (Math.random() - 0.5) * 0.5, life: 1, type: isHeart ? "heart" : "box", id: id++, rot: Math.random() * 20 - 10 };
        return [...prev.filter(p => p.life > 0), fresh].slice(-12);
      });
      spawnRef.current = window.setTimeout(spawn, 300);
    };
    const tick = () => {
      setItems(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.018 })).filter(p => p.life > 0));
      rafRef.current = requestAnimationFrame(tick);
    };
    spawn(); rafRef.current = requestAnimationFrame(tick);
    return () => { clearTimeout(spawnRef.current); cancelAnimationFrame(rafRef.current!); };
  }, []);
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140">
      {/* Subtle network lines */}
      {[[30,120,80,60],[80,60,160,90],[160,90,190,40],[30,120,160,90]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(59,130,246,0.08)" strokeWidth="0.8" strokeDasharray="3 6" />
      ))}
      {items.map(it => (
        <g key={it.id} transform={`translate(${it.x},${it.y}) rotate(${it.rot})`} opacity={it.life * 0.85}>
          {it.type === "heart" ? (
            <path d="M0,-5 C0,-9 -7,-9 -7,-4 C-7,0 0,6 0,6 C0,6 7,0 7,-4 C7,-9 0,-9 0,-5 Z"
              fill="rgba(59,130,246,0.7)" style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.5))" }} />
          ) : (
            <g>
              <rect x="-6" y="-5" width="12" height="10" rx="1" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="1" />
              <line x1="-6" y1="-1" x2="6" y2="-1" stroke="rgba(59,130,246,0.4)" strokeWidth="0.8" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(59,130,246,0.4)" strokeWidth="0.8" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

// Ponte: connection nodes linking up — lines drawing between dots
function PonteEffect() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    let start: number;
    const tick = (ts: number) => { if (!start) start = ts; setT((ts - start) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);
  const nodes = [
    { x: 30, y: 70 }, { x: 75, y: 30 }, { x: 110, y: 70 },
    { x: 155, y: 25 }, { x: 190, y: 70 }, { x: 145, y: 110 }, { x: 65, y: 110 },
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[2,5],[1,3]];
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140">
      {edges.map(([a, b], i) => {
        const phase = (t * 0.6 + i * 0.3) % 1;
        const nx1 = nodes[a].x, ny1 = nodes[a].y, nx2 = nodes[b].x, ny2 = nodes[b].y;
        const px = nx1 + (nx2 - nx1) * phase, py = ny1 + (ny2 - ny1) * phase;
        return (
          <g key={i}>
            <line x1={nx1} y1={ny1} x2={nx2} y2={ny2} stroke="rgba(249,115,22,0.1)" strokeWidth="0.8" />
            <circle cx={px} cy={py} r="2.5" fill="rgba(249,115,22,0.7)" style={{ filter: "drop-shadow(0 0 4px rgba(249,115,22,0.6))" }} />
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i * 0.9);
        return (
          <circle key={i} cx={n.x} cy={n.y} r={3 + pulse * 1.5}
            fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1"
            opacity={0.4 + pulse * 0.5} />
        );
      })}
      {nodes.map((n, i) => (
        <circle key={`c${i}`} cx={n.x} cy={n.y} r="3" fill="rgba(249,115,22,0.8)"
          style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.7))" }} />
      ))}
    </svg>
  );
}

const CARD_EFFECTS: Record<string, React.FC> = {
  limpattack: LimpattackEffect,
  benevo: BenevoEffect,
  ponte: PonteEffect,
};

/* ── Hover preview card for UNLOCKED ── */
function UnlockedHoverCard({ project, svgX, svgY, svgW, svgH, visible }: {
  project: UnlockedProject; svgX: number; svgY: number; svgW: number; svgH: number; visible: boolean;
}) {
  const c = project.color;
  const leftPct = (svgX / svgW) * 100;
  const topPct = (svgY / svgH) * 100;
  const flipLeft = leftPct > 55;
  const flipUp = topPct > 60;
  const Effect = CARD_EFFECTS[project.id];

  return (
    <div style={{
      position: "absolute",
      left: `${leftPct}%`, top: `${topPct}%`,
      transform: `translate(${flipLeft ? "calc(-100% - 14px)" : "22px"}, ${flipUp ? "calc(-100% + 14px)" : "-14px"})`,
      zIndex: 60, pointerEvents: "none",
      opacity: visible ? 1 : 0,
      scale: visible ? "1" : "0.86",
      transition: "opacity 0.2s ease, scale 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      width: "230px",
    }}>
      {/* Connector dot */}
      <div style={{
        position: "absolute",
        [flipLeft ? "right" : "left"]: "-8px", top: "22px",
        width: "7px", height: "7px", borderRadius: "50%",
        background: c.base, boxShadow: `0 0 10px ${c.glow}`,
      }} />

      <div style={{
        background: "rgba(4,9,5,0.97)", border: `1px solid ${c.border}`,
        borderRadius: "14px", overflow: "hidden",
        boxShadow: `0 0 30px ${c.bg}, 0 8px 32px rgba(0,0,0,0.7)`,
        position: "relative",
      }}>
        {/* Per-project animated background */}
        {visible && Effect && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "14px" }}>
            <Effect />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: "10px 12px 8px", borderBottom: `1px solid ${c.solid}`, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.base, boxShadow: `0 0 7px ${c.glow}` }} />
              <span style={{ color: c.text, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", opacity: 0.7, fontFamily: "monospace" }}>
                {project.period}
              </span>
            </div>
            {project.award && (
              <span style={{ fontSize: "9px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                {project.award}
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: "10px 12px 12px", position: "relative" }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: "15px", marginBottom: "6px" }}>{project.name}</div>
          <p style={{ color: "rgba(180,180,190,0.85)", fontSize: "10.5px", lineHeight: "1.55", marginBottom: "10px" }}>
            {project.shortDesc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
            {project.stack.map(s => (
              <span key={s} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "20px", fontWeight: 600, background: c.solid, border: `1px solid ${c.border}`, color: c.text }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize: "9px", color: c.text, opacity: 0.45, textAlign: "center", borderTop: `1px solid ${c.solid}`, paddingTop: "7px", fontFamily: "monospace", letterSpacing: "1px" }}>
            CLIQUE PARA VER DETALHES
          </div>
        </div>
      </div>
      <style>{`@keyframes hpFlicker { 0%,100%{opacity:0.5} 50%{opacity:0.9} }`}</style>
    </div>
  );
}

/* ── Full panel for UNLOCKED ── */
function UnlockedPanel({ project, onClose }: { project: UnlockedProject; onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"sobre" | "stack">("sobre");
  const c = project.color;
  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(4,9,5,0.98)",
          border: `1px solid ${c.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "540px",
          boxShadow: `0 0 80px ${c.bg}, 0 0 160px ${c.solid}, 0 24px 64px rgba(0,0,0,0.8)`,
          transform: show ? "scale(1) translateY(0)" : "scale(0.9) translateY(30px)",
          opacity: show ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Scanlines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(34,197,94,0.012) 3px,rgba(34,197,94,0.012) 4px)" }} />
        {/* Top glow bar */}
        <div style={{ height: "3px", background: `linear-gradient(90deg, transparent, ${c.base}, ${c.glow}, ${c.base}, transparent)` }} />

        {/* Header */}
        <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${c.solid}`, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.base, boxShadow: `0 0 10px ${c.glow}` }} />
                <span style={{ color: c.text, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.65, fontFamily: "monospace" }}>{project.period}</span>
              </div>
              <h3 style={{ color: "white", fontWeight: 900, fontSize: "28px", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "8px" }}>{project.name}</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {project.award && (
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                    {project.award}
                  </span>
                )}
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(200,200,210,0.7)", fontFamily: "monospace" }}>
                  {project.role}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ color: "rgba(120,120,130,0.7)", fontSize: "20px", background: "none", border: "none", cursor: "pointer", paddingTop: "2px", lineHeight: 1 }}>✕</button>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: "4px", marginTop: "18px" }}>
            {(["sobre", "stack"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", border: "none", cursor: "pointer",
                background: tab === t ? c.bg : "transparent",
                color: tab === t ? c.text : "rgba(120,120,140,0.6)",
                borderBottom: tab === t ? `2px solid ${c.base}` : "2px solid transparent",
                transition: "all 0.2s ease",
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "22px 28px 26px", minHeight: "180px" }}>
          {tab === "sobre" ? (
            <div>
              <p style={{ color: "rgba(200,200,210,0.9)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>
                {project.fullDesc}
              </p>
              {/* Trailer button — highlighted but proportional */}
              {project.trailer && (
                <a
                  href={project.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "7px",
                    padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 700,
                    textDecoration: "none", position: "relative", overflow: "hidden",
                    background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(234,88,12,0.15))",
                    border: "1px solid rgba(251,191,36,0.55)",
                    color: "rgba(253,230,138,0.95)",
                    boxShadow: "0 0 18px rgba(251,191,36,0.2)",
                    animation: "trailerPulse 2.5s ease-in-out infinite",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 30%,rgba(253,230,138,0.1) 50%,transparent 70%)", animation: "trailerShimmer 2.2s linear infinite", pointerEvents: "none" }} />
                  {/* Play icon */}
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(251,191,36,0.25)", border: "1px solid rgba(251,191,36,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", inset: "-3px", borderRadius: "50%", border: "1px solid rgba(251,191,36,0.3)", animation: "trailerRing 2s ease-out infinite" }} />
                    <svg style={{ width: 9, height: 9, marginLeft: "1px" }} fill="rgba(253,230,138,0.95)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <span style={{ position: "relative" }}>▶ Trailer</span>
                </a>
              )}

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, textDecoration: "none", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e4e4e7", transition: "opacity 0.2s" }}>
                  <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, textDecoration: "none", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                  <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver Demo
                </a>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: "rgba(120,130,140,0.7)", fontSize: "11px", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "14px", textTransform: "uppercase" }}>Tecnologias utilizadas</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {project.stack.map((s, i) => (
                  <div key={s} style={{
                    padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: 700,
                    background: c.bg, border: `1px solid ${c.border}`, color: c.text,
                    boxShadow: `0 0 20px ${c.solid}`,
                    animation: `stackPop 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s both`,
                  }}>{s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes stackPop { from { opacity:0; transform:scale(0.7) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes trailerPulse { 0%,100% { box-shadow:0 0 40px rgba(251,191,36,0.2),0 0 80px rgba(234,88,12,0.1),inset 0 1px 0 rgba(253,230,138,0.15); } 50% { box-shadow:0 0 60px rgba(251,191,36,0.35),0 0 120px rgba(234,88,12,0.18),inset 0 1px 0 rgba(253,230,138,0.25); } }
        @keyframes trailerShimmer { 0% { transform:translateX(-100%); } 100% { transform:translateX(200%); } }
        @keyframes trailerRing { 0% { transform:scale(1); opacity:0.8; } 100% { transform:scale(1.8); opacity:0; } }
        @keyframes trailerArrow { 0%,100% { transform:translateX(0); opacity:0.6; } 50% { transform:translateX(5px); opacity:1; } }`}</style>
    </div>
  );
}

/* ── Hover preview card for LOCKED ── */
function LockedHoverCard({ locked, svgX, svgY, svgW, svgH, visible }: {
  locked: LockedProject; svgX: number; svgY: number; svgW: number; svgH: number; visible: boolean;
}) {
  const [glitch, setGlitch] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!visible) { setGlitch(false); return; }
    const t1 = setTimeout(() => setGlitch(true), 80);
    const t2 = setTimeout(() => setGlitch(false), 200);
    const t3 = setTimeout(() => setGlitch(true), 320);
    const t4 = setTimeout(() => setGlitch(false), 420);
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      setScanPos(((ts - start) % 1800) / 1800);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  const leftPct = (svgX / svgW) * 100;
  const topPct = (svgY / svgH) * 100;
  const flipLeft = leftPct > 55;
  const flipUp = topPct > 60;
  const gx = glitch ? (Math.random() * 5 - 2.5) : 0;
  const gy = glitch ? (Math.random() * 3 - 1.5) : 0;

  return (
    <div style={{
      position: "absolute",
      left: `${leftPct}%`, top: `${topPct}%`,
      transform: `translate(${flipLeft ? "calc(-100% - 14px)" : "22px"}, ${flipUp ? "calc(-100% + 14px)" : "-14px"})`,
      zIndex: 60, pointerEvents: "none",
      opacity: visible ? 1 : 0,
      scale: visible ? "1" : "0.85",
      transition: "opacity 0.3s ease, scale 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      width: "200px",
    }}>
      <div style={{
        background: "rgba(3,3,18,0.98)", border: "1px solid rgba(100,80,200,0.5)",
        borderRadius: "12px", overflow: "hidden",
        boxShadow: "0 0 40px rgba(80,60,180,0.35), 0 0 80px rgba(60,40,150,0.15), 0 8px 32px rgba(0,0,0,0.8)",
        transform: `translate(${gx}px,${gy}px)`, transition: glitch ? "none" : "transform 0.1s ease", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "12px", zIndex: 10 }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: "2px", top: `${scanPos * 100}%`, background: "linear-gradient(90deg,transparent,rgba(120,100,255,0.6),rgba(180,160,255,0.8),rgba(120,100,255,0.6),transparent)", boxShadow: "0 0 12px rgba(140,120,255,0.6)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(100,80,200,0.04) 2px,rgba(100,80,200,0.04) 3px)" }} />
        </div>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(80,60,180,0.25)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px" }}>🔒</span>
          <div>
            <div style={{ color: "rgba(160,140,255,0.9)", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", fontFamily: "monospace" }}>{locked.name}</div>
            <div style={{ color: "rgba(100,80,200,0.6)", fontSize: "8px", fontFamily: "monospace" }}>PROJETO CLASSIFICADO</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(239,68,68,0.9)", boxShadow: "0 0 6px rgba(239,68,68,0.8)", animation: "redPulse 1s ease-in-out infinite" }} />
          </div>
        </div>
        <div style={{ padding: "12px" }}>
          <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[100, 85, 92, 60].map((w, i) => (
              <div key={i} style={{ height: "8px", width: `${w}%`, borderRadius: "3px", background: i < 2 ? "rgba(80,60,180,0.4)" : "rgba(239,68,68,0.25)", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(0,0,0,0.4) 6px,rgba(0,0,0,0.4) 7px)" }} />
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(80,60,180,0.08)", border: "1px solid rgba(100,80,200,0.2)", borderRadius: "6px", padding: "8px 10px", marginBottom: "10px" }}>
            <div style={{ fontSize: "8px", color: "rgba(120,100,200,0.6)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "4px" }}>// PISTA DECODIFICADA</div>
            <p style={{ color: "rgba(180,160,255,0.85)", fontSize: "10px", fontStyle: "italic", lineHeight: "1.5", fontFamily: "serif" }}>"{locked.hint}"</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(80,60,180,0.2)", paddingTop: "9px" }}>
            <span style={{ fontSize: "8px", color: "rgba(100,80,200,0.5)", fontFamily: "monospace" }}>LIBERAÇÃO PREVISTA</span>
            <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "monospace", color: "rgba(160,140,255,0.9)", textShadow: "0 0 8px rgba(140,120,255,0.5)" }}>{locked.date}</span>
          </div>
          <div style={{ marginTop: "8px", textAlign: "center", fontSize: "9px", color: "rgba(140,120,255,0.45)", fontFamily: "monospace", letterSpacing: "0.5px" }}>CLIQUE PARA REVELAR MAIS</div>
        </div>
      </div>
    </div>
  );
}

/* ── Full panel for LOCKED ── */
function LockedPanel({ locked, onClose }: { locked: LockedProject; onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    // Entry glitch burst
    const t1 = setTimeout(() => setGlitch(true), 100);
    const t2 = setTimeout(() => setGlitch(false), 220);
    const t3 = setTimeout(() => setGlitch(true), 380);
    const t4 = setTimeout(() => setGlitch(false), 480);
    // Scan line
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      setScanPos(((ts - start) % 2400) / 2400);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const gx = glitch ? (Math.random() * 8 - 4) : 0;
  const gy = glitch ? (Math.random() * 4 - 2) : 0;

  const classColors: Record<string, string> = {
    ALPHA: "rgba(251,191,36,0.9)",
    BETA: "rgba(34,197,94,0.9)",
    OMEGA: "rgba(239,68,68,0.9)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(4,4,22,0.99)",
          border: "1px solid rgba(120,100,220,0.5)",
          borderRadius: "20px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 0 80px rgba(80,60,200,0.3), 0 0 160px rgba(60,40,160,0.15), 0 24px 64px rgba(0,0,0,0.9)",
          transform: show ? `scale(1) translateY(0) translate(${gx}px,${gy}px)` : "scale(0.88) translateY(30px)",
          opacity: show ? 1 : 0,
          transition: glitch ? "none" : "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Scan sweep */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "20px", zIndex: 5 }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: "3px",
            top: `${scanPos * 100}%`,
            background: "linear-gradient(90deg,transparent,rgba(120,100,255,0.5),rgba(200,180,255,0.9),rgba(120,100,255,0.5),transparent)",
            boxShadow: "0 0 16px rgba(160,140,255,0.7)",
          }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(100,80,200,0.035) 2px,rgba(100,80,200,0.035) 3px)" }} />
        </div>

        {/* Top accent bar */}
        <div style={{ height: "3px", background: "linear-gradient(90deg,transparent,rgba(120,100,255,0.8),rgba(200,160,255,1),rgba(120,100,255,0.8),transparent)", position: "relative", zIndex: 6 }} />

        {/* Header */}
        <div style={{ padding: "24px 28px 18px", borderBottom: "1px solid rgba(80,60,200,0.2)", position: "relative", zIndex: 6 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", color: "rgba(120,100,200,0.6)", textTransform: "uppercase" }}>PROJETO CLASSIFICADO</span>
                <span style={{
                  fontSize: "9px", fontWeight: 800, padding: "1px 8px", borderRadius: "20px",
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid ${classColors[locked.classLevel] || "rgba(120,100,200,0.5)"}`,
                  color: classColors[locked.classLevel] || "rgba(180,160,255,0.9)",
                  fontFamily: "monospace",
                }}>
                  {locked.classLevel}
                </span>
              </div>
              <h3 style={{ color: "rgba(200,180,255,0.95)", fontWeight: 900, fontSize: "32px", letterSpacing: "-0.5px", fontFamily: "monospace" }}>
                {locked.name}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <button onClick={onClose} style={{ color: "rgba(120,120,130,0.6)", fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(239,68,68,0.9)", boxShadow: "0 0 6px rgba(239,68,68,0.8)", animation: "redPulse 1s ease-in-out infinite" }} />
                <span style={{ fontSize: "8px", color: "rgba(239,68,68,0.7)", fontFamily: "monospace" }}>ACESSO RESTRITO</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 28px 26px", position: "relative", zIndex: 6 }}>
          {/* Redacted block that reveals on click */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", color: "rgba(120,100,200,0.55)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>
              // Descrição do projeto
            </div>
            {!revealed ? (
              <div
                onClick={() => setRevealed(true)}
                style={{ cursor: "pointer", position: "relative", padding: "14px 16px", borderRadius: "10px", border: "1px dashed rgba(100,80,200,0.35)", background: "rgba(80,60,180,0.06)" }}
              >
                {/* Fake redacted lines */}
                {[95, 88, 100, 72, 85, 60].map((w, i) => (
                  <div key={i} style={{ height: "10px", width: `${w}%`, borderRadius: "3px", marginBottom: "6px", background: "rgba(80,60,180,0.45)", overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 5px,rgba(0,0,0,0.35) 5px,rgba(0,0,0,0.35) 6px)" }} />
                  </div>
                ))}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "rgba(4,4,22,0.5)", backdropFilter: "blur(2px)" }}>
                  <span style={{ fontSize: "11px", color: "rgba(160,140,255,0.8)", fontFamily: "monospace", letterSpacing: "1.5px" }}>🔓 CLIQUE PARA DECIFRAR</span>
                </div>
              </div>
            ) : (
              <p style={{ color: "rgba(190,180,255,0.85)", fontSize: "13.5px", lineHeight: "1.7", animation: "fadeIn 0.5s ease" }}>
                {locked.fullHint}
              </p>
            )}
          </div>

          {/* Pista */}
          <div style={{ background: "rgba(80,60,180,0.08)", border: "1px solid rgba(100,80,200,0.22)", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
            <div style={{ fontSize: "8px", color: "rgba(120,100,200,0.5)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "5px" }}>// TRANSMISSÃO INTERCEPTADA</div>
            <p style={{ color: "rgba(180,160,255,0.85)", fontSize: "13px", fontStyle: "italic", lineHeight: "1.6", fontFamily: "serif" }}>"{locked.hint}"</p>
          </div>

          {/* Stack (hidden) */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", color: "rgba(120,100,200,0.55)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>// Stack [REDACTED]</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {locked.stack.map((s, i) => (
                <div key={i} style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, background: "rgba(80,60,180,0.15)", border: "1px solid rgba(100,80,200,0.25)", color: "rgba(120,100,200,0.5)", fontFamily: "monospace", letterSpacing: "2px" }}>
                  {s.repeat(3)}
                </div>
              ))}
            </div>
          </div>

          {/* Release */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(80,60,180,0.2)", paddingTop: "16px" }}>
            <div>
              <div style={{ fontSize: "8px", color: "rgba(100,80,200,0.5)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "3px" }}>TRANSMISSÃO PREVISTA</div>
              <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: "rgba(180,160,255,0.95)", textShadow: "0 0 20px rgba(160,140,255,0.5)" }}>{locked.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "8px", color: "rgba(100,80,200,0.5)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "3px" }}>NÍVEL</div>
              <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: classColors[locked.classLevel] || "rgba(180,160,255,0.9)", textShadow: `0 0 20px ${classColors[locked.classLevel] || "rgba(160,140,255,0.5)"}` }}>{locked.classLevel}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes redPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

/* ── Map ── */
function IslandMap() {
  const [selectedUnlocked, setSelectedUnlocked] = useState<UnlockedProject | null>(null);
  const [selectedLocked, setSelectedLocked] = useState<LockedProject | null>(null);
  const [hoveredUnlocked, setHoveredUnlocked] = useState<string | null>(null);
  const [hoveredLocked, setHoveredLocked] = useState<string | null>(null);
  const VW = 800, VH = 600;

  return (
    <div className="relative w-full" style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Hover cards */}
      {UNLOCKED.map(p => (
        <UnlockedHoverCard key={p.id} project={p} svgX={p.mx} svgY={p.my} svgW={VW} svgH={VH} visible={hoveredUnlocked === p.id && selectedUnlocked === null} />
      ))}
      {LOCKED.map(lk => (
        <LockedHoverCard key={lk.id} locked={lk} svgX={lk.mx} svgY={lk.my} svgW={VW} svgH={VH} visible={hoveredLocked === lk.id && selectedLocked === null} />
      ))}

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ filter: "drop-shadow(0 0 40px rgba(34,197,94,0.08))" }}>
        <defs>
          <pattern id="waterGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="islandGrad" cx="45%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(30,50,30,0.95)" />
            <stop offset="40%" stopColor="rgba(18,32,20,0.98)" />
            <stop offset="100%" stopColor="rgba(8,15,10,1)" />
          </radialGradient>
          <radialGradient id="islandGlow" cx="45%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.06)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
          <radialGradient id="fogGrad0" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(40,40,80,0.95)" />
            <stop offset="60%" stopColor="rgba(20,20,50,0.85)" />
            <stop offset="100%" stopColor="rgba(10,10,30,0)" />
          </radialGradient>
          <radialGradient id="fogGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(35,35,75,0.92)" />
            <stop offset="60%" stopColor="rgba(18,18,48,0.82)" />
            <stop offset="100%" stopColor="rgba(8,8,28,0)" />
          </radialGradient>
          <radialGradient id="fogGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45,40,85,0.93)" />
            <stop offset="60%" stopColor="rgba(22,18,52,0.83)" />
            <stop offset="100%" stopColor="rgba(10,8,32,0)" />
          </radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="strongGlow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        <rect width="800" height="600" fill="url(#waterGrid)" />
        {[80,160,240,320,400,480,560].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="800" y2={y} stroke="rgba(6,182,212,0.04)" strokeWidth="1" strokeDasharray="20 60"
            style={{ animation: `shimmer ${3 + i * 0.4}s linear infinite`, animationDelay: `${i * 0.3}s` }} />
        ))}

        <path d={ISLAND_PATH} fill="rgba(0,0,0,0.5)" transform="translate(6,8)" />
        <path d={ISLAND_PATH} fill="url(#islandGrad)" />
        <path d={ISLAND_PATH} fill="url(#islandGlow)" />
        <path d={ISLAND_PATH} fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
        <path d={ISLAND_PATH} fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="4" strokeDasharray="8 16" />

        {["M 180 220 Q 290 195 400 210 Q 510 225 615 215","M 160 278 Q 280 258 400 270 Q 520 282 635 272","M 162 335 Q 285 318 405 328 Q 525 338 632 330","M 185 388 Q 300 375 415 383 Q 530 390 622 382","M 215 438 Q 330 428 440 434 Q 548 440 603 433"].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(34,197,94,0.07)" strokeWidth="1" />
        ))}

        {/* Fog for locked */}
        {LOCKED.map((lk, i) => {
          const isH = hoveredLocked === lk.id;
          return (
            <g key={lk.id}>
              <ellipse cx={lk.mx} cy={lk.my} rx={isH ? 40 : 70} ry={isH ? 28 : 48} fill={`url(#fogGrad${i})`} style={{ transition: "all 0.6s ease", filter: "blur(1px)", opacity: isH ? 0.4 : 1 }} />
              <ellipse cx={lk.mx - 15} cy={lk.my + 8} rx={isH ? 22 : 40} ry={isH ? 15 : 28} fill={`url(#fogGrad${i})`} opacity={isH ? 0.2 : 0.7} style={{ filter: "blur(3px)", transition: "all 0.6s ease", animation: `fogDrift 5s ease-in-out infinite`, animationDelay: `${i * 1.2}s` }} />
              <ellipse cx={lk.mx + 12} cy={lk.my - 10} rx={isH ? 18 : 35} ry={isH ? 12 : 22} fill={`url(#fogGrad${i})`} opacity={isH ? 0.15 : 0.6} style={{ filter: "blur(2px)", transition: "all 0.6s ease", animation: `fogDrift 7s ease-in-out infinite reverse`, animationDelay: `${i * 0.8}s` }} />
              {isH && (
                <g>
                  <line x1={lk.mx - 8} y1={lk.my - 20} x2={lk.mx + 4} y2={lk.my + 5} stroke="rgba(160,140,255,0.6)" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(140,120,255,0.8))" }} />
                  <line x1={lk.mx + 4} y1={lk.my + 5} x2={lk.mx - 3} y2={lk.my + 22} stroke="rgba(160,140,255,0.4)" strokeWidth="1" />
                  <line x1={lk.mx + 4} y1={lk.my + 5} x2={lk.mx + 14} y2={lk.my + 18} stroke="rgba(160,140,255,0.35)" strokeWidth="0.8" />
                </g>
              )}
            </g>
          );
        })}

        {/* Unlocked markers */}
        {UNLOCKED.map((p, idx) => {
          const c = p.color;
          const isH = hoveredUnlocked === p.id;
          return (
            <g key={p.id} style={{ cursor: "pointer" }}
              onClick={() => setSelectedUnlocked(p)}
              onMouseEnter={() => setHoveredUnlocked(p.id)}
              onMouseLeave={() => setHoveredUnlocked(null)}
            >
              <circle cx={p.mx} cy={p.my} r={isH ? 30 : 22} fill="none" stroke={c.ping} strokeWidth="1" style={{ animation: `ping 2s ease-out infinite`, animationDelay: `${idx * 0.6}s`, transition: "r 0.3s ease" }} />
              {isH && <circle cx={p.mx} cy={p.my} r={42} fill="none" stroke={c.ping} strokeWidth="0.5" style={{ animation: `ping 1.5s ease-out infinite` }} />}
              <circle cx={p.mx} cy={p.my} r={isH ? 17 : 14} fill={c.bg} stroke={c.glow} strokeWidth={isH ? 2 : 1.5} filter="url(#glow)" style={{ transition: "all 0.25s ease" }} />
              <circle cx={p.mx} cy={p.my} r={isH ? 6 : 5} fill={c.base} filter={isH ? "url(#strongGlow)" : "url(#glow)"} style={{ transition: "all 0.25s ease" }} />
              <rect x={p.mx - 34} y={p.my - 36} width={68} height={18} rx={9} fill="rgba(6,12,6,0.88)" stroke={isH ? c.border : "rgba(34,197,94,0.2)"} strokeWidth="1" style={{ transition: "stroke 0.2s ease" }} />
              <text x={p.mx} y={p.my - 23} textAnchor="middle" dominantBaseline="middle" fill={c.text} fontSize="10" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">{p.name}</text>
              <line x1={p.mx} y1={p.my - 18} x2={p.mx} y2={p.my - 14} stroke={c.border} strokeWidth="1" />
            </g>
          );
        })}

        {/* Locked markers */}
        {LOCKED.map((lk, i) => {
          const isH = hoveredLocked === lk.id;
          return (
            <g key={lk.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredLocked(lk.id)}
              onMouseLeave={() => setHoveredLocked(null)}
              onClick={() => setSelectedLocked(lk)}
            >
              <circle cx={lk.mx} cy={lk.my} r={16} fill={isH ? "rgba(60,50,120,0.85)" : "rgba(40,40,80,0.7)"} stroke={isH ? "rgba(140,120,255,0.8)" : "rgba(80,80,140,0.4)"} strokeWidth="1.5" style={{ transition: "all 0.3s", filter: isH ? "drop-shadow(0 0 10px rgba(120,100,255,0.6))" : "none" }} />
              <circle cx={lk.mx} cy={lk.my} r={isH ? 30 : 24} fill="none" stroke={isH ? "rgba(140,120,255,0.35)" : "rgba(100,100,180,0.25)"} strokeWidth="1" style={{ animation: `ping 2.5s ease-out infinite`, animationDelay: `${i * 0.7}s`, transition: "all 0.3s" }} />
              <text x={lk.mx} y={lk.my + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={isH ? "rgba(200,180,255,0.95)" : "rgba(150,150,220,0.8)"}>🔒</text>
            </g>
          );
        })}

        <text x="400" y="582" textAnchor="middle" fill="rgba(34,197,94,0.3)" fontSize="11" fontFamily="monospace" letterSpacing="4" fontWeight="600">ILHA DOS PROJETOS</text>
      </svg>

      {selectedUnlocked && <UnlockedPanel project={selectedUnlocked} onClose={() => setSelectedUnlocked(null)} />}
      {selectedLocked && <LockedPanel locked={selectedLocked} onClose={() => setSelectedLocked(null)} />}

      <style>{`
        @keyframes ping { 0% { transform-origin:center; transform:scale(1); opacity:0.8; } 100% { transform-origin:center; transform:scale(2.2); opacity:0; } }
        @keyframes fogDrift { 0%,100% { transform:translate(0,0); } 50% { transform:translate(8px,-6px); } }
        @keyframes shimmer { 0% { stroke-dashoffset:0; } 100% { stroke-dashoffset:-80; } }
        @keyframes redPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{ background: "linear-gradient(180deg,#000000 0%,#03050a 50%,#050810 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
          <span className="text-emerald-400/40 font-light">&lt;</span>{" "}Projetos{" "}<span className="text-emerald-400/40 font-light">/&gt;</span>
        </h2>
        <p className="mt-4 text-sm tracking-widest text-emerald-500/40 uppercase">— explore o território —</p>
        <p className="mt-2 text-sm text-zinc-500">Passe o mouse nos marcadores · Áreas com névoa guardam segredos</p>
      </div>
      <div className="relative z-10 w-full max-w-3xl"><IslandMap /></div>
    </section>
  );
}

export default Projects;
