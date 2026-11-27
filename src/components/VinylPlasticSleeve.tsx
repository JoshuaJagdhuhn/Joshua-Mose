import { useEffect, useRef, useState } from 'react';

interface VinylPlasticSleeveProps {
  src: string;
  alt: string;
  ariaLabel: string;
  initialOffset?: { x: number; y: number };
  initialVelocity?: { vx: number; vy: number };
  isDrifting?: boolean;
  onClick?: () => void;
  onBringToFront?: () => void;
  onDragMove?: () => void;
  zIndex?: number;
  className?: string;
}

export function VinylPlasticSleeve({
  src,
  alt,
  ariaLabel,
  initialOffset = { x: 0, y: 0 },
  initialVelocity = { vx: 0, vy: 0 },
  isDrifting = false,
  onClick,
  onBringToFront,
  onDragMove,
  zIndex = 20,
  className = 'w-36 sm:w-48 md:w-52 lg:w-56',
}: VinylPlasticSleeveProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef<{ x: number; y: number }>(initialOffset);
  const velRef = useRef<{ vx: number; vy: number }>(initialVelocity);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragSessionRef = useRef<{
    pointerId: number;
    startPointerX: number;
    startPointerY: number;
    startOffsetX: number;
    startOffsetY: number;
    hasMoved: boolean;
  } | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (el) {
      el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }
  }, []);

  useEffect(() => {
    if (!isDrifting) return;
    if (velRef.current.vx === 0 && velRef.current.vy === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      const node = elRef.current;
      if (node && !isDraggingRef.current) {
        const halfW = (node.offsetWidth || 160) / 2;
        const halfH = (node.offsetHeight || 160) / 2;
        const boundX = Math.max(40, window.innerWidth / 2 - halfW - 10);
        const boundY = Math.max(40, window.innerHeight / 2 - halfH - 10);

        let nextX = posRef.current.x + velRef.current.vx * dt;
        let nextY = posRef.current.y + velRef.current.vy * dt;

        if (nextX >= boundX) {
          nextX = boundX;
          velRef.current.vx = -Math.abs(velRef.current.vx);
        } else if (nextX <= -boundX) {
          nextX = -boundX;
          velRef.current.vx = Math.abs(velRef.current.vx);
        }

        if (nextY >= boundY) {
          nextY = boundY;
          velRef.current.vy = -Math.abs(velRef.current.vy);
        } else if (nextY <= -boundY) {
          nextY = -boundY;
          velRef.current.vy = Math.abs(velRef.current.vy);
        }

        posRef.current = { x: nextX, y: nextY };
        node.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [isDrifting]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    onBringToFront?.();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragSessionRef.current = {
      pointerId: e.pointerId,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startOffsetX: posRef.current.x,
      startOffsetY: posRef.current.y,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const dx = e.clientX - session.startPointerX;
    const dy = e.clientY - session.startPointerY;

    if (!session.hasMoved && Math.hypot(dx, dy) > 6) {
      session.hasMoved = true;
      onDragMove?.();
    }

    const maxX = Math.max(90, window.innerWidth * 0.44);
    const maxY = Math.max(90, window.innerHeight * 0.44);
    const nextX = Math.max(-maxX, Math.min(maxX, session.startOffsetX + dx));
    const nextY = Math.max(-maxY, Math.min(maxY, session.startOffsetY + dy));

    posRef.current = { x: nextX, y: nextY };
    if (elRef.current) {
      elRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const didMove = session.hasMoved;
    dragSessionRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (!didMove && onClick) {
      onClick();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragSessionRef.current?.pointerId === e.pointerId) {
      dragSessionRef.current = null;
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  return (
    <div
      ref={elRef}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      data-cursor-surface="white"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
        touchAction: 'none',
        zIndex: isDragging ? 40 : zIndex,
        willChange: 'transform',
        boxShadow: isDragging
          ? '18px 22px 4px rgba(0, 0, 0, 0.46), 3px 3px 0px rgba(0, 0, 0, 0.55)'
          : '8px 10px 2px rgba(0, 0, 0, 0.52), 2px 2px 0px rgba(0, 0, 0, 0.65)',
      }}
      className={`group pointer-events-auto relative aspect-square select-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 transition-[box-shadow] duration-150 ease-out ${className} ${
        isDragging ? 'scale-[1.03]' : ''
      }`}
    >
      {/* Artwork with Vintage Film Cast */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        referrerPolicy="no-referrer"
        style={{
          filter: 'sepia(0.18) contrast(1.06) brightness(0.97) saturate(0.92)',
        }}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Aged Paper Warmth & Vintage Edge Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,244,214,0.06) 45%, rgba(35,20,10,0.26) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Vinyl LP Ringwear / Worn Cardboard Impression */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3.5%] rounded-full"
        style={{
          boxShadow:
            'inset 0 0 12px rgba(255,250,235,0.28), 0 0 8px rgba(0,0,0,0.22)',
          border: '1.5px solid rgba(255,248,230,0.22)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[34%] rounded-full"
        style={{
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.16)',
          border: '1px solid rgba(255,248,230,0.16)',
        }}
      />

      {/* Vintage Scratches, Scuffs & Dust Specks Overlay */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-75"
        fill="none"
      >
        {/* Fine hairline scratches */}
        <path
          d="M18 32 Q 46 28, 72 44"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="0.6"
        />
        <path
          d="M135 20 Q 155 46, 182 58"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.55"
        />
        <path
          d="M28 148 L 62 178"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="0.7"
        />
        <path
          d="M116 142 Q 148 158, 176 132"
          stroke="rgba(255,255,255,0.26)"
          strokeWidth="0.5"
        />
        <path
          d="M84 62 Q 96 76, 114 70"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.45"
        />
        <path
          d="M148 92 L 172 114"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.5"
        />
        <path
          d="M12 96 Q 28 104, 40 94"
          stroke="rgba(0,0,0,0.22)"
          strokeWidth="0.6"
        />
        <path
          d="M66 14 L 78 30"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
        {/* Corner sleeve scuff marks */}
        <path
          d="M2 18 L 16 2 M 184 2 L 198 16 M 2 182 L 18 198 M 182 198 L 198 182"
          stroke="rgba(255,245,225,0.32)"
          strokeWidth="1.2"
        />
        {/* Dust specks */}
        <circle cx="44" cy="68" r="0.8" fill="rgba(255,255,255,0.45)" />
        <circle cx="156" cy="44" r="0.7" fill="rgba(255,255,255,0.4)" />
        <circle cx="92" cy="158" r="0.9" fill="rgba(255,255,255,0.38)" />
        <circle cx="164" cy="166" r="0.65" fill="rgba(255,255,255,0.42)" />
        <circle cx="24" cy="126" r="0.75" fill="rgba(255,255,255,0.35)" />
        <circle cx="122" cy="96" r="0.6" fill="rgba(255,255,255,0.35)" />
      </svg>

      {/* Left Cardboard Spine Shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,248,235,0.3) 0%, rgba(0,0,0,0.24) 40%, transparent 100%)',
        }}
      />

      {/* Glossy Shrink-Wrap / Plastic Poly-Sleeve Specular Glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-85 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background:
            'linear-gradient(128deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 22%, transparent 38%, rgba(255,255,255,0.18) 51%, rgba(255,255,255,0.03) 62%, transparent 76%, rgba(255,255,255,0.24) 94%, rgba(255,255,255,0.08) 100%)',
        }}
      />

      {/* Corner Plastic Wrinkles & Shrink-Wrap Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 8% 8%, rgba(255,255,255,0.3) 0%, transparent 18%), radial-gradient(circle at 94% 92%, rgba(255,255,255,0.26) 0%, transparent 20%), linear-gradient(45deg, transparent 88%, rgba(255,255,255,0.26) 96%, transparent 100%)',
          boxShadow:
            'inset 0 0 0 1.5px rgba(255,255,255,0.45), inset 0 1px 4px rgba(255,255,255,0.35), inset 0 -2px 6px rgba(0,0,0,0.26)',
        }}
      />

      {/* Outer Translucent Poly-Bag Rim */}
      <div
        aria-hidden="true"
        className="pointer-events-none -inset-[2px] absolute border border-white/40"
      />
    </div>
  );
}
