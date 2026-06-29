import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════
   STATIC / NOISE CANVAS
══════════════════════════════════════════════ */
function StaticCanvas({ opacity = 0.04 }: { opacity?: number }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        let raf: number;
        const draw = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const img = ctx.createImageData(canvas.width, canvas.height);
            for (let i = 0; i < img.data.length; i += 4) {
                const v = Math.random() > 0.5 ? 255 : 0;
                img.data[i] = img.data[i+1] = img.data[i+2] = v;
                img.data[i+3] = Math.random() * 55;
            }
            ctx.putImageData(img, 0, 0);
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity, mixBlendMode: "screen" }} />;
}

/* ══════════════════════════════════════════════
   RADAR CANVAS V2 — versão cinematográfica
══════════════════════════════════════════════ */
interface Echo { x: number; y: number; born: number; intensity: number; }

function RadarCanvas({
    phase,
    onDetected,
    onZoomComplete,
}: {
    phase: "scanning" | "detected" | "zoom" | "done";
    onDetected: () => void;
    onZoomComplete: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({
        angle: -Math.PI / 2,          // começa do topo
        totalRotated: 0,
        detected: false,
        detectedCalled: false,
        echoes: [] as Echo[],
        lockProgress: 0,               // 0→1 animação de lock-on
        pingWaves: [] as { born: number; }[],
        zoomProgress: 0,
        frameCount: 0,
        // ponto detectado: posição fixa relativa ao centro
        targetAngle: -Math.PI * 0.3,
        targetDist: 0.48,
    });
    const phaseRef = useRef(phase);
    phaseRef.current = phase;
    const rafRef = useRef<number>();
    const onDetectedRef = useRef(onDetected);
    onDetectedRef.current = onDetected;
    const onZoomCompleteRef = useRef(onZoomComplete);
    onZoomCompleteRef.current = onZoomComplete;

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const s = stateRef.current;

        // Reset
        s.angle = -Math.PI / 2;
        s.totalRotated = 0;
        s.detected = false;
        s.detectedCalled = false;
        s.echoes = [];
        s.lockProgress = 0;
        s.pingWaves = [];
        s.zoomProgress = 0;
        s.frameCount = 0;

        // Semear ecos falsos iniciais (ruído de fundo)
        for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = 0.2 + Math.random() * 0.7;
            s.echoes.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, born: -Math.random() * 200, intensity: 0.08 + Math.random() * 0.12 });
        }

        const ROTATIONS_BEFORE_DETECT = 2.2;
        const TARGET_TOTAL = Math.PI * 2 * ROTATIONS_BEFORE_DETECT;
        const SWEEP_SPEED = 0.022;
        const TRAIL_ANGLE = Math.PI * 0.7;

        // Para o texto HUD que "digita"
        const HUD_LINES = [
            "> FREQ 2.4GHz",
            "> ALCANCE 384.400km",
            "> OBJETO IDENTIFICADO",
            "> @frontista ██ LOCK",
        ];
        let hudLineIndex = 0;
        let hudCharIndex = 0;
        let hudText: string[] = [];
        let hudTimer = 0;

        const draw = (ts: number) => {
            s.frameCount++;
            const ph = phaseRef.current;
            if (ph === "done") return;

            // Resize
            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            if (canvas.width !== W || canvas.height !== H) {
                canvas.width = W; canvas.height = H;
            }
            ctx.clearRect(0, 0, W, H);

            const cx = W / 2, cy = H / 2;
            const R = Math.min(cx, cy) * 0.78;
            const now = ts;

            /* ── 1. FUNDO ESCURECIDO CIRCULAR ─────────────────── */
            const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.1);
            bgGrad.addColorStop(0, "rgba(0,20,8,0.55)");
            bgGrad.addColorStop(0.8, "rgba(0,10,4,0.35)");
            bgGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            /* ── 2. GRID DO RADAR ─────────────────────────────── */
            // Círculos com dashes levemente animados
            ctx.save();
            ctx.translate(cx, cy);
            const dashOffset = (ts * 0.012) % 20;
            [0.25, 0.5, 0.75, 1].forEach((f, idx) => {
                ctx.beginPath();
                ctx.arc(0, 0, R * f, 0, Math.PI * 2);
                if (idx === 3) {
                    // Anel externo: sólido e mais brilhante
                    ctx.strokeStyle = "rgba(34,197,94,0.25)";
                    ctx.lineWidth = 1;
                    ctx.setLineDash([]);
                } else {
                    ctx.strokeStyle = `rgba(34,197,94,${0.06 + idx * 0.025})`;
                    ctx.lineWidth = 0.6;
                    ctx.setLineDash([4, 8]);
                    ctx.lineDashOffset = -dashOffset * (idx + 1);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // Raios de ângulo: 8 direções com marcações
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
                ctx.strokeStyle = "rgba(34,197,94,0.05)";
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // Tick marks nas interseções
                [0.25, 0.5, 0.75, 1].forEach(f => {
                    const tx = Math.cos(a) * R * f;
                    const ty = Math.sin(a) * R * f;
                    ctx.fillStyle = "rgba(34,197,94,0.3)";
                    ctx.fillRect(tx - 1, ty - 1, 2, 2);
                });
            }

            // Marcações de grau no anel externo
            for (let i = 0; i < 36; i++) {
                const a = (i / 36) * Math.PI * 2;
                const inner = i % 3 === 0 ? R * 0.93 : R * 0.96;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
                ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
                ctx.strokeStyle = i % 3 === 0 ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.12)";
                ctx.lineWidth = i % 9 === 0 ? 1 : 0.5;
                ctx.stroke();
            }
            ctx.restore();

            /* ── 3. RASTRO DE SWEEP (setor com gradiente real) ── */
            // Técnica: desenhar N fatias finas com opacidade decrescente
            const SLICES = 120;
            for (let i = 0; i < SLICES; i++) {
                const frac = i / SLICES; // 0 = ponta da linha, 1 = fim do rastro
                const sliceAngle = s.angle - frac * TRAIL_ANGLE;
                const nextAngle = sliceAngle - TRAIL_ANGLE / SLICES;

                // Curva de opacidade: intensa na ponta, morre exponencialmente
                const alpha = Math.pow(1 - frac, 1.8) * 0.55;

                // Verde fosforescente
                const r = 34, g = 197, b = 94;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, R, sliceAngle, nextAngle, true);
                ctx.closePath();
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.fill();
            }

            // Glow extra na borda do rastro (bloom)
            ctx.save();
            ctx.globalCompositeOperation = "screen";
            for (let i = 0; i < 20; i++) {
                const frac = i / 20;
                const sliceAngle = s.angle - frac * (TRAIL_ANGLE * 0.3);
                const alpha = Math.pow(1 - frac, 2) * 0.25;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, R, sliceAngle, sliceAngle - TRAIL_ANGLE * 0.3 / 20, true);
                ctx.closePath();
                ctx.fillStyle = `rgba(180,255,200,${alpha})`;
                ctx.fill();
            }
            ctx.restore();

            /* ── 4. LINHA PRINCIPAL DE SWEEP ─────────────────── */
            const sx = cx + Math.cos(s.angle) * R;
            const sy = cy + Math.sin(s.angle) * R;
            const lineGrad = ctx.createLinearGradient(cx, cy, sx, sy);
            lineGrad.addColorStop(0, "rgba(34,197,94,0)");
            lineGrad.addColorStop(0.3, "rgba(34,197,94,0.15)");
            lineGrad.addColorStop(0.85, "rgba(100,255,150,0.7)");
            lineGrad.addColorStop(1, "rgba(200,255,220,1)");
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(sx, sy);
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Glow da linha
            ctx.save();
            ctx.globalCompositeOperation = "screen";
            const glowGrad = ctx.createLinearGradient(cx, cy, sx, sy);
            glowGrad.addColorStop(0, "rgba(34,197,94,0)");
            glowGrad.addColorStop(0.7, "rgba(34,197,94,0.08)");
            glowGrad.addColorStop(1, "rgba(34,197,94,0.3)");
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(sx, sy);
            ctx.strokeStyle = glowGrad;
            ctx.lineWidth = 12;
            ctx.stroke();
            ctx.restore();

            // Ponto brilhante na ponta
            const tipGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10);
            tipGlow.addColorStop(0, "rgba(220,255,230,1)");
            tipGlow.addColorStop(0.3, "rgba(34,197,94,0.8)");
            tipGlow.addColorStop(1, "rgba(34,197,94,0)");
            ctx.beginPath();
            ctx.arc(sx, sy, 10, 0, Math.PI * 2);
            ctx.fillStyle = tipGlow;
            ctx.fill();

            /* ── 5. ECOS (pontos que ficam após varredura) ─────── */
            s.echoes.forEach(echo => {
                const age = s.frameCount - echo.born;
                const ECHO_LIFE = 180; // frames
                if (age > ECHO_LIFE) return;
                const life = 1 - age / ECHO_LIFE;
                const ex = cx + echo.x * R;
                const ey = cy + echo.y * R;
                const alpha = life * echo.intensity;
                // Brilho verde fosforescente
                const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
                eg.addColorStop(0, `rgba(180,255,200,${alpha * 2.5})`);
                eg.addColorStop(1, `rgba(34,197,94,0)`);
                ctx.beginPath();
                ctx.arc(ex, ey, 5, 0, Math.PI * 2);
                ctx.fillStyle = eg;
                ctx.fill();
            });

            /* ── 6. AVANÇO DO SWEEP ───────────────────────────── */
            if (ph === "scanning") {
                s.angle += SWEEP_SPEED;
                s.totalRotated += SWEEP_SPEED;

                // Gerar ecos aleatórios conforme a linha passa
                if (s.frameCount % 8 === 0 && Math.random() < 0.55) {
                    const echoAngle = s.angle - Math.random() * TRAIL_ANGLE * 0.6;
                    const echoDist = 0.15 + Math.random() * 0.78;
                    s.echoes.push({
                        x: Math.cos(echoAngle) * echoDist,
                        y: Math.sin(echoAngle) * echoDist,
                        born: s.frameCount,
                        intensity: 0.05 + Math.random() * 0.15,
                    });
                }
                // Limpar ecos velhos
                s.echoes = s.echoes.filter(e => s.frameCount - e.born < 200);

                // Detectar após N rotações
                if (!s.detectedCalled && s.totalRotated >= TARGET_TOTAL) {
                    s.detectedCalled = true;
                    onDetectedRef.current();
                }
            }

            /* ── 7. ALVO DETECTADO ────────────────────────────── */
            const tx = cx + Math.cos(s.targetAngle) * R * s.targetDist;
            const ty = cy + Math.sin(s.targetAngle) * R * s.targetDist;

            if (ph === "detected" || ph === "zoom") {
                // Lock-on progress
                if (ph === "detected") {
                    s.lockProgress = Math.min(s.lockProgress + 0.018, 1);
                }

                // Ping waves
                if (s.frameCount % 30 === 0 && ph === "detected") {
                    s.pingWaves.push({ born: s.frameCount });
                }
                s.pingWaves = s.pingWaves.filter(w => s.frameCount - w.born < 90);
                s.pingWaves.forEach(w => {
                    const age = s.frameCount - w.born;
                    const wProg = age / 90;
                    const wR = wProg * 48;
                    const wAlpha = (1 - wProg) * 0.85;
                    const wGrad = ctx.createRadialGradient(tx, ty, wR * 0.8, tx, ty, wR);
                    wGrad.addColorStop(0, `rgba(34,197,94,0)`);
                    wGrad.addColorStop(0.7, `rgba(34,197,94,${wAlpha * 0.5})`);
                    wGrad.addColorStop(1, `rgba(34,197,94,${wAlpha})`);
                    ctx.beginPath();
                    ctx.arc(tx, ty, wR, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(34,197,94,${wAlpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                });

                // Ponto central brilhante
                const pg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 14);
                pg.addColorStop(0, "rgba(255,255,255,1)");
                pg.addColorStop(0.2, "rgba(100,255,180,1)");
                pg.addColorStop(0.6, "rgba(34,197,94,0.6)");
                pg.addColorStop(1, "rgba(34,197,94,0)");
                ctx.beginPath();
                ctx.arc(tx, ty, 14, 0, Math.PI * 2);
                ctx.fillStyle = pg;
                ctx.fill();
                // Core
                ctx.beginPath();
                ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,1)";
                ctx.fill();

                // Lock-on: 4 cantos de mira que fecham
                const lockSize = 22 - s.lockProgress * 10; // 22px → 12px
                const gap = 4;
                const corners = [
                    [-1, -1], [1, -1], [1, 1], [-1, 1],
                ] as const;
                corners.forEach(([dx, dy]) => {
                    const bx = tx + dx * lockSize;
                    const by = ty + dy * lockSize;
                    const len = lockSize * 0.5 * s.lockProgress + 4;
                    ctx.strokeStyle = `rgba(34,197,94,${0.5 + s.lockProgress * 0.5})`;
                    ctx.lineWidth = 1.5;
                    // Horizontal
                    ctx.beginPath();
                    ctx.moveTo(bx, by);
                    ctx.lineTo(bx - dx * len, by);
                    ctx.stroke();
                    // Vertical
                    ctx.beginPath();
                    ctx.moveTo(bx, by);
                    ctx.lineTo(bx, by - dy * len);
                    ctx.stroke();
                });

                // Label HUD ao lado do alvo
                if (s.lockProgress > 0.4) {
                    const labelAlpha = (s.lockProgress - 0.4) / 0.6;
                    // Linha de conexão ao label
                    ctx.beginPath();
                    ctx.moveTo(tx + 16, ty - 16);
                    ctx.lineTo(tx + 40, ty - 40);
                    ctx.lineTo(tx + 90, ty - 40);
                    ctx.strokeStyle = `rgba(34,197,94,${labelAlpha * 0.5})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                    // Label
                    ctx.font = `bold ${9}px monospace`;
                    ctx.fillStyle = `rgba(34,197,94,${labelAlpha * 0.9})`;
                    ctx.fillText("@FRONTISTA", tx + 44, ty - 44);
                    ctx.font = `${8}px monospace`;
                    ctx.fillStyle = `rgba(34,197,94,${labelAlpha * 0.5})`;
                    ctx.fillText("SINAL FORTE · LOCK", tx + 44, ty - 33);
                }
            }

            /* ── 8. FASE ZOOM: explosão do ponto ─────────────── */
            if (ph === "zoom") {
                s.zoomProgress = Math.min(s.zoomProgress + 0.025, 1);

                // Shockwave expandindo do ponto
                for (let w = 0; w < 3; w++) {
                    const wProg = Math.min(s.zoomProgress + w * 0.15, 1);
                    const wR = wProg * Math.max(W, H) * 0.8;
                    const wAlpha = (1 - wProg) * (0.7 - w * 0.15);
                    if (wAlpha <= 0) continue;
                    const sg = ctx.createRadialGradient(tx, ty, wR * 0.85, tx, ty, wR);
                    sg.addColorStop(0, `rgba(34,197,94,0)`);
                    sg.addColorStop(0.6, `rgba(34,197,94,${wAlpha * 0.4})`);
                    sg.addColorStop(0.85, `rgba(100,255,180,${wAlpha})`);
                    sg.addColorStop(1, `rgba(34,197,94,0)`);
                    ctx.beginPath();
                    ctx.arc(tx, ty, wR, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(100,255,180,${wAlpha})`;
                    ctx.lineWidth = 2 - w * 0.5;
                    ctx.stroke();
                }

                // Flash branco crescente
                if (s.zoomProgress > 0.6) {
                    const fp = (s.zoomProgress - 0.6) / 0.4;
                    const flashGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, fp * Math.max(W, H));
                    flashGrad.addColorStop(0, `rgba(200,255,220,${fp * 0.9})`);
                    flashGrad.addColorStop(0.5, `rgba(34,197,94,${fp * 0.3})`);
                    flashGrad.addColorStop(1, `rgba(0,0,0,0)`);
                    ctx.fillStyle = flashGrad;
                    ctx.fillRect(0, 0, W, H);
                }

                // Quando zoom chega em 1, chamar callback
                if (s.zoomProgress >= 1) {
                    onZoomCompleteRef.current();
                    return;
                }
            }

            /* ── 9. HUD: texto no canto ───────────────────────── */
            ctx.save();
            // Quadrante inferior esquerdo
            const hudX = cx - R + 16;
            const hudY = cy + R - 16 - (HUD_LINES.length) * 16;

            // Atualiza texto "digitando" quando detectado
            if ((ph === "detected") && s.lockProgress > 0.1) {
                hudTimer++;
                if (hudTimer % 4 === 0) {
                    if (hudLineIndex < HUD_LINES.length) {
                        const line = HUD_LINES[hudLineIndex];
                        if (hudCharIndex < line.length) {
                            if (!hudText[hudLineIndex]) hudText[hudLineIndex] = "";
                            hudText[hudLineIndex] += line[hudCharIndex];
                            hudCharIndex++;
                        } else {
                            hudLineIndex++;
                            hudCharIndex = 0;
                        }
                    }
                }
            }

            hudText.forEach((line, i) => {
                const isLast = i === hudText.length - 1 && hudLineIndex === i;
                ctx.font = "bold 8px monospace";
                ctx.fillStyle = i === HUD_LINES.length - 1
                    ? "rgba(100,255,150,0.9)"
                    : "rgba(34,197,94,0.6)";
                ctx.fillText(line + (isLast ? (s.frameCount % 20 < 10 ? "█" : "") : ""), hudX, hudY + i * 14);
            });
            ctx.restore();

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [phase]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                zIndex: 4,
                opacity: phase === "done" ? 0 : 1,
                transition: phase === "done" ? "opacity 0.3s" : "none",
            }}
        />
    );
}

/* ══════════════════════════════════════════════
   MATERIALIZING CARD
══════════════════════════════════════════════ */
function MaterializeCard({ show }: { show: boolean }) {
    const [columns, setColumns] = useState<boolean[]>(Array(20).fill(false));
    const [fullyVisible, setFullyVisible] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const [floatY, setFloatY] = useState(0);
    const rafRef = useRef<number>();
    const [blink, setBlink] = useState(true);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        if (!show) return;
        columns.forEach((_, i) => {
            setTimeout(() => {
                setColumns(prev => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                });
                if (i === 19) setTimeout(() => setFullyVisible(true), 200);
            }, i * 60);
        });
    }, [show]);

    useEffect(() => {
        let t = 0;
        const tick = () => {
            t += 0.008;
            setFloatY(Math.sin(t) * 6);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current!);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setBlink(v => !v), 900);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const pad = (n: number) => String(n).padStart(2, "0");

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current; if (!card) return;
        const rect = card.getBoundingClientRect();
        setTilt({
            x: ((e.clientY - rect.top) / rect.height - 0.5) * 8,
            y: ((e.clientX - rect.left) / rect.width - 0.5) * 8,
        });
    };

    if (!show) return null;

    return (
        <div className="relative z-10 flex items-center justify-center px-4 w-full" style={{ zIndex: 10 }}>
            <div style={{ transform: `translateY(${floatY}px)`, transition: "transform 0.1s ease-out", width: "100%", maxWidth: 760 }}>
                {/* Transmission label */}
                <div className="flex items-center justify-between mb-3 px-1"
                    style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.4)" }}>
                            <div className="w-2 h-2 rounded-full bg-emerald-400"
                                style={{ boxShadow: blink ? "0 0 8px rgba(34,197,94,0.9)" : "none",
                                    opacity: blink ? 1 : 0.3, transition: "all 0.15s" }} />
                            <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(34,197,94,0.9)", letterSpacing: 2, fontWeight: 700 }}>
                                AO VIVO
                            </span>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(6,182,212,0.5)", letterSpacing: 2 }}>
                            CH 01 · FRONTISTA
                        </span>
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>
                        {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
                    </span>
                </div>

                {/* THE CARD */}
                <div
                    ref={cardRef}
                    onMouseMove={onMouseMove}
                    onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                    className="relative overflow-hidden"
                    style={{
                        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        transition: "transform 0.15s ease-out",
                        background: "rgba(4,12,8,0.92)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        boxShadow: "0 0 0 1px rgba(6,182,212,0.1), 0 0 60px rgba(34,197,94,0.12), 0 0 120px rgba(6,182,212,0.06), inset 0 0 60px rgba(34,197,94,0.03)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {/* Column materializing mask */}
                    <div className="absolute inset-0 pointer-events-none z-20 flex"
                        style={{ opacity: fullyVisible ? 0 : 1, transition: "opacity 0.4s" }}>
                        {columns.map((visible, i) => (
                            <div key={i} className="flex-1 h-full"
                                style={{
                                    background: visible ? "transparent" : "rgba(0,0,0,0.95)",
                                    transition: "background 0.15s ease",
                                }} />
                        ))}
                    </div>

                    <StaticCanvas opacity={0.025} />

                    {/* Scan lines */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 3px)" }} />

                    {/* Top glow bar */}
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.9),rgba(6,182,212,1),rgba(34,197,94,0.9),transparent)" }} />

                    {/* Conteúdo — mobile stack / desktop 2 cols */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr" }} className="card-grid">
                        {/* LEFT */}
                        <div style={{ padding: "clamp(24px,5vw,36px) clamp(20px,5vw,40px)" }} className="card-left">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    style={{ boxShadow: "0 0 8px rgba(34,197,94,0.9)" }} />
                                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(34,197,94,0.7)", letterSpacing: 3, textTransform: "uppercase" }}>
                                    Criador de Conteúdo
                                </span>
                            </div>

                            <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, lineHeight: 1, marginBottom: 16, letterSpacing: -1 }}>
                                <span style={{
                                    background: "linear-gradient(135deg,#22c55e,#06b6d4,#22c55e)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    backgroundClip: "text", display: "inline-block",
                                }}>
                                    @frontista
                                </span>
                            </h2>

                            <div style={{ height: 1, background: "linear-gradient(90deg,rgba(34,197,94,0.4),transparent)", marginBottom: 20 }} />

                            <p style={{ color: "rgba(220,240,220,0.85)", fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>
                                Dev que virou criador.
                            </p>
                            <p style={{ color: "rgba(180,210,190,0.6)", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
                                Conteúdo de tecnologia sem ser chato, sem tutorial genérico,
                                sem ser o mesmo de sempre. O{" "}
                                <span style={{ color: "rgba(34,197,94,0.9)", fontWeight: 700 }}>@frontista</span>{" "}
                                existe pra mostrar que dá pra falar de front-end com personalidade —
                                e furar a bolha tech de vez.
                            </p>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {["#frontend", "#fora do padrão", "#dev", "#criador"].map(tag => (
                                    <span key={tag} style={{
                                        fontFamily: "monospace", fontSize: 10, padding: "4px 10px",
                                        border: "1px solid rgba(34,197,94,0.22)",
                                        color: "rgba(34,197,94,0.65)",
                                        background: "rgba(34,197,94,0.05)",
                                        letterSpacing: 0.5,
                                    }}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div style={{ padding: "clamp(24px,5vw,36px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 20 }}>
                                    {[3, 5, 7, 9, 11, 9, 7].map((h, i) => (
                                        <div key={i} style={{
                                            width: 4, height: h * 2,
                                            background: i < 5 ? `rgba(34,197,94,${0.4 + i * 0.12})` : "rgba(255,255,255,0.07)",
                                            borderRadius: 2,
                                            animation: `signalPulse 1.4s ease-in-out ${i * 0.1}s infinite alternate`,
                                        }} />
                                    ))}
                                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(34,197,94,0.5)", letterSpacing: 2, marginLeft: 6 }}>
                                        SINAL DETECTADO
                                    </span>
                                </div>

                                <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: 1, lineHeight: 2, marginBottom: 20 }}>
                                    &gt; carregando perfil...<br />
                                    &gt; conteúdo diferente encontrado<br />
                                    &gt; <span style={{ color: "rgba(34,197,94,0.75)" }}>frontista ativo ✓</span>
                                </p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: 2, marginBottom: 4 }}>// SINTONIZE O CANAL</p>

                                {[
                                    { href: "https://instagram.com/ofrontista", label: "Instagram", color: "#e1306c", icon: "IG" },
                                    { href: "https://tiktok.com/@frontista", label: "TikTok", color: "#06b6d4", icon: "TK" },
                                ].map(btn => (
                                    <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                                        className="group flex items-center gap-3 transition-all duration-200"
                                        style={{
                                            padding: "12px 20px",
                                            border: `1px solid rgba(34,197,94,0.2)`,
                                            background: "rgba(34,197,94,0.04)",
                                            color: "rgba(200,240,210,0.75)",
                                            textDecoration: "none",
                                            fontFamily: "monospace", fontSize: 12, fontWeight: 700, letterSpacing: 2,
                                            textTransform: "uppercase",
                                            position: "relative", overflow: "hidden",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.border = `1px solid ${btn.color}`;
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${btn.color}44, inset 0 0 12px ${btn.color}11`;
                                            (e.currentTarget as HTMLElement).style.color = btn.color;
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.border = "1px solid rgba(34,197,94,0.2)";
                                            (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                            (e.currentTarget as HTMLElement).style.color = "rgba(200,240,210,0.75)";
                                        }}
                                    >
                                        <span style={{ fontFamily: "monospace", fontSize: 9, opacity: 0.5 }}>{btn.icon}</span>
                                        <span>{btn.label}</span>
                                        <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 10 }}>›</span>
                                    </a>
                                ))}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.18))" }} />
                                <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(34,197,94,0.25)", letterSpacing: 1 }}>
                                    FRONTISTA © 2025
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.5),rgba(34,197,94,0.7),transparent)" }} />
                </div>

                <div className="flex items-center justify-between mt-3 px-1"
                    style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>
                        REC · 00:00:00:00
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(34,197,94,0.3)", letterSpacing: 1 }}>
                        TRANSMISSÃO RECEBIDA · 384.400 km · SINAL ESTÁVEL
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>
                        SP · PE · BR
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════ */
type Phase = "idle" | "scanning" | "detected" | "zoom" | "materialize";

export default function Frontista() {
    const [phase, setPhase] = useState<Phase>("idle");
    const ref = useRef<HTMLElement>(null);
    const triggered = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !triggered.current) {
                    triggered.current = true;
                    setTimeout(() => setPhase("scanning"), 300);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const handleDetected = () => setPhase("detected");
    // Após zoom completo (animação interna do canvas), o canvas chama isto
    const handleZoomComplete = () => setPhase("materialize");

    // Após ficar em "detected" por 1.8s, iniciar zoom
    useEffect(() => {
        if (phase !== "detected") return;
        const t = setTimeout(() => setPhase("zoom"), 1800);
        return () => clearTimeout(t);
    }, [phase]);

    return (
        <section ref={ref} id="frontista" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-24">

            {/* Nebula */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full"
                    style={{ background: "radial-gradient(ellipse,rgba(34,197,94,0.05) 0%,rgba(6,182,212,0.04) 40%,transparent 70%)" }} />
            </div>

            {/* Radar */}
            {(phase === "scanning" || phase === "detected" || phase === "zoom") && (
                <div className="absolute inset-0" style={{ zIndex: 4 }}>
                    <RadarCanvas
                        phase={phase as any}
                        onDetected={handleDetected}
                        onZoomComplete={handleZoomComplete}
                    />
                </div>
            )}

            {/* Card */}
            <MaterializeCard show={phase === "materialize"} />

            {/* Section title — antes da animação */}
            <div className="relative z-10 text-center"
                style={{
                    opacity: phase === "idle" ? 1 : 0,
                    transition: "opacity 0.6s ease",
                    pointerEvents: "none",
                    position: phase === "materialize" ? "absolute" : "relative",
                }}>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <span className="text-emerald-400/40 font-light">&lt;</span>
                    {" "}Frontista{" "}
                    <span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>
                <p className="mt-3 text-xs tracking-widest text-emerald-500/40 uppercase">— sintonizando transmissão —</p>
            </div>

            <style>{`
                @keyframes signalPulse {
                    from { opacity: 0.4; transform: scaleY(0.85); }
                    to   { opacity: 1;   transform: scaleY(1); }
                }
                @media (min-width: 768px) {
                    .card-grid { grid-template-columns: 1fr 1fr !important; }
                    .card-left {
                        border-right: 1px solid rgba(34,197,94,0.1);
                        border-bottom: none !important;
                    }
                }
                .card-left {
                    border-bottom: 1px solid rgba(34,197,94,0.1);
                }
            `}</style>
        </section>
    );
}
