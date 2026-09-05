import { useRef, useEffect } from 'react';

const GridCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const o = offsetRef.current % 40;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 0.5;

      for (let col = -1; col < Math.ceil(w / 40) + 2; col++) {
        ctx.beginPath();
        ctx.moveTo(col * 40 + o, 0);
        ctx.lineTo(col * 40 + o, h);
        ctx.stroke();
      }
      for (let row = -1; row < Math.ceil(h / 40) + 2; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * 40 + o);
        ctx.lineTo(w, row * 40 + o);
        ctx.stroke();
      }

      // Vignette
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0.88)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      offsetRef.current += 0.4;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden pointer-events-none">

      {/* Animated moving grid */}
      <GridCanvas />

      {/* Green glow blobs — sit on top of grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-emerald-900/20 rounded-full blur-[100px]" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

    </div>
  );
};

export default Background;