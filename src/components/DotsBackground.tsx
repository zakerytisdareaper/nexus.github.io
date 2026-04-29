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

    const colorVar = () => {
      const root = getComputedStyle(document.documentElement);
      return [
        root.getPropertyValue("--primary").trim(),
        root.getPropertyValue("--accent").trim(),
        root.getPropertyValue("--secondary").trim(),
      ];
    };

    type Dot = { x: number; y: number; r: number; vy: number; a: number; c: string };
    const make = (): Dot => {
      const colors = colorVar();
      return {
        x: Math.random() * w,
        y: Math.random() * -h,
        r: Math.random() * 2.2 + 0.6,
        vy: Math.random() * 0.6 + 0.25,
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
    window.addEventListener("resize", onResize);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y += d.vy;
        if (d.y - d.r > h) {
          Object.assign(d, make(), { y: -10, x: Math.random() * w });
        }
        ctx.beginPath();
        ctx.fillStyle = `hsl(${d.c} / ${d.a})`;
        ctx.shadowColor = `hsl(${d.c})`;
        ctx.shadowBlur = 8;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
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