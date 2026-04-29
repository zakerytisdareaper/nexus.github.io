import { useEffect, useRef } from "react";

export const DotsBackground = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const colorVar = () => {
      const root = getComputedStyle(document.documentElement);
      return [
        root.getPropertyValue("--primary").trim(),
        root.getPropertyValue("--accent").trim(),
        root.getPropertyValue("--secondary").trim(),
      ];
    };

    type Dot = { x: number; y: number; r: number; vx: number; vy: number; bvy: number; a: number; c: string };
    const make = (): Dot => {
      const colors = colorVar();
      return {
        x: Math.random() * w,
        y: Math.random() * -h,
        r: Math.random() * 2.2 + 0.6,
        vx: 0,
        vy: Math.random() * 0.6 + 0.25,
        bvy: Math.random() * 0.6 + 0.25,
        a: Math.random() * 0.5 + 0.2,
        c: colors[Math.floor(Math.random() * colors.length)],
      };
    };
    const count = Math.min(140, Math.floor((w * h) / 14000));
    let dots: Dot[] = Array.from({ length: count }, make);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const onLeave = () => { mouse.active = false; mouse.x = mouse.y = -9999; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX; mouse.y = t.clientY; mouse.active = true;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    const REPEL = 110;
    const REPEL_SQ = REPEL * REPEL;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        // Mouse repulsion
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (mouse.active && distSq < REPEL_SQ && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / REPEL) * 1.6;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }
        // Damping + drift back toward base downward velocity
        d.vx *= 0.92;
        d.vy = d.vy * 0.92 + d.bvy * 0.08;

        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y - d.r > h) {
          Object.assign(d, make(), { y: -10, x: Math.random() * w });
        }

        // Glow brighter near cursor
        const near = mouse.active && distSq < REPEL_SQ;
        const alpha = near ? Math.min(1, d.a + 0.5) : d.a;
        ctx.beginPath();
        ctx.fillStyle = `hsl(${d.c} / ${alpha})`;
        ctx.shadowColor = `hsl(${d.c})`;
        ctx.shadowBlur = near ? 16 : 8;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden
    />
  );
};