import { useEffect, useRef } from "react";

function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight;
        };
        resize();

        const STAR_COUNT = 260;
        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.3,
            speed: Math.random() * 0.18 + 0.04,
            alpha: Math.random() * 0.6 + 0.3,
            twinkleSpeed: Math.random() * 0.008 + 0.003,
            twinklePhase: Math.random() * Math.PI * 2,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = performance.now() / 1000;

            for (const s of stars) {
                const alpha = s.alpha * (0.6 + 0.4 * Math.sin(now * s.twinkleSpeed * 60 + s.twinklePhase));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 255, 240, ${alpha})`;
                ctx.fill();

                s.y += s.speed;
                if (s.y > canvas.height) {
                    s.y = 0;
                    s.x = Math.random() * canvas.width;
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        const onResize = () => {
            resize();
            for (const s of stars) {
                s.x = Math.random() * canvas.width;
                s.y = Math.random() * canvas.height;
            }
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}

export default StarBackground;
