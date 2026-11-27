import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  BOTTOM_MENU_ITEMS,
  IMPOSTER_IMAGE,
  MENU_ITEMS,
  NEUE_NASE_IMAGE,
  TOP_RIGHT_MENU_ITEMS,
  WALLPAPER_OPTIONS,
  WHATS_IN_MY_BAG_IMAGE,
} from '../data/artistData';
import { MenuItem, SectionId } from '../types';
import { LegalFooter } from './LegalFooter';
import { VinylPlasticSleeve } from './VinylPlasticSleeve';

interface HomeStageProps {
  onSelectSection: (section: SectionId) => void;
  playIntro?: boolean;
  onIntroComplete?: () => void;
  hasMovedSongs?: boolean;
  onSongsMoved?: () => void;
}

type JiggleVariant = 'a' | 'b' | 'c';
type IntroPhase = 'burst' | 'docking' | 'done';

interface ActiveJiggle {
  id: string;
  variant: JiggleVariant;
  key: number;
}

interface IntroOffset {
  dx: number;
  dy: number;
  scale: number;
  baseFontPx: number;
  naturalHeight: number;
}

const VARIANTS: JiggleVariant[] = ['a', 'b', 'c'];

export function HomeStage({
  onSelectSection,
  playIntro = false,
  onIntroComplete,
  hasMovedSongs = false,
  onSongsMoved,
}: HomeStageProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => {
    if (!playIntro) return 'done';
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'done';
    }
    return 'burst';
  });
  const [introOffset, setIntroOffset] = useState<IntroOffset | null>(null);
  const [activeJiggle, setActiveJiggle] = useState<ActiveJiggle | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [logoBurstIdx, setLogoBurstIdx] = useState<number | null>(null);
  const [cdCyclePhase, setCdCyclePhase] = useState<'driving' | 'paused'>('driving');
  const [cardOrder, setCardOrder] = useState<('bag' | 'nase' | 'imposter')[]>([
    'bag',
    'nase',
    'imposter',
  ]);
  const hoveredIdRef = useRef<string | null>(null);
  const lastJiggledIdRef = useRef<string | null>(null);
  const jiggleCounterRef = useRef(0);

  const logoRef = useRef<HTMLElement | null>(null);
  const songsNavRef = useRef<HTMLElement | null>(null);
  const onIntroCompleteRef = useRef(onIntroComplete);
  onIntroCompleteRef.current = onIntroComplete;
  const [mobileCenterY, setMobileCenterY] = useState<number | null>(null);

  const bringCardToFront = (card: 'bag' | 'nase' | 'imposter') => {
    setCardOrder((prev) => [...prev.filter((c) => c !== card), card]);
  };

  const introOffsetRef = useRef<IntroOffset | null>(null);
  introOffsetRef.current = introOffset;

  useLayoutEffect(() => {
    const mobilePortraitQuery = window.matchMedia('(max-width: 639px) and (orientation: portrait)');

    const updateCenter = () => {
      if (!mobilePortraitQuery.matches) {
        setMobileCenterY(null);
        return;
      }
      const logoEl = logoRef.current;
      const songsEl = songsNavRef.current;
      if (!logoEl || !songsEl) return;
      const logoHeight = introOffsetRef.current
        ? introOffsetRef.current.naturalHeight
        : logoEl.offsetHeight;
      const logoBottom = logoEl.offsetTop + logoHeight;
      const songsRect = songsEl.getBoundingClientRect();
      setMobileCenterY((logoBottom + songsRect.top) / 2);
    };

    updateCenter();
    const ro = new ResizeObserver(updateCenter);
    if (logoRef.current) ro.observe(logoRef.current);
    if (songsNavRef.current) ro.observe(songsNavRef.current);
    window.addEventListener('resize', updateCenter);
    window.addEventListener('orientationchange', updateCenter);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('orientationchange', updateCenter);
    };
  }, [introOffset]);

  const initialOffsets = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        bag: { x: -230, y: -48 },
        nase: { x: 230, y: -28 },
        imposter: { x: 0, y: 145 },
      };
    }
    const w = window.innerWidth;
    if (w < 640) {
      return {
        bag: { x: -68, y: -145 },
        nase: { x: 68, y: -115 },
        imposter: { x: 0, y: 120 },
      };
    }
    if (w < 1024) {
      return {
        bag: { x: -145, y: -64 },
        nase: { x: 145, y: -38 },
        imposter: { x: 0, y: 118 },
      };
    }
    return {
      bag: { x: -230, y: -48 },
      nase: { x: 230, y: -28 },
      imposter: { x: 0, y: 145 },
    };
  }, []);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let cycleTimer: number | null = null;
    let clearTimer: number | null = null;

    const triggerNextJiggle = () => {
      const candidates = MENU_ITEMS.filter(
        (item) => item.id !== lastJiggledIdRef.current && item.id !== hoveredIdRef.current
      );
      const pool = candidates.length > 0 ? candidates : MENU_ITEMS;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];

      lastJiggledIdRef.current = chosen.id;
      jiggleCounterRef.current += 1;

      setActiveJiggle({
        id: chosen.id,
        variant,
        key: jiggleCounterRef.current,
      });

      if (clearTimer !== null) window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(() => {
        setActiveJiggle((curr) => (curr?.id === chosen.id ? null : curr));
      }, 400);

      const nextPause = 520 + Math.random() * 780;
      cycleTimer = window.setTimeout(triggerNextJiggle, nextPause);
    };

    cycleTimer = window.setTimeout(triggerNextJiggle, 450);

    return () => {
      if (cycleTimer !== null) window.clearTimeout(cycleTimer);
      if (clearTimer !== null) window.clearTimeout(clearTimer);
    };
  }, []);

  // Opening intro: measure natural logo & compute crisp full-res font size + center FLIP offset before first paint
  useLayoutEffect(() => {
    if (introPhase !== 'burst' || introOffset !== null) return;
    const logoEl = logoRef.current;
    const h1El = logoEl?.querySelector('h1');
    if (!logoEl || !h1El) return;

    const baseFontPx = parseFloat(window.getComputedStyle(h1El).fontSize) || 20;
    const w = logoEl.offsetWidth;
    const h = logoEl.offsetHeight;
    const maxScaleForViewport = (window.innerWidth * 0.72) / Math.max(w, 1);
    const scale = Math.max(1.6, Math.min(2.65, maxScaleForViewport));
    const dx = window.innerWidth / 2 - logoEl.offsetLeft - (w * scale) / 2;
    const dy = window.innerHeight / 2 - logoEl.offsetTop - (h * scale) / 2;

    setIntroOffset({ dx, dy, scale, baseFontPx, naturalHeight: h });
  }, [introPhase, introOffset]);

  // Opening intro sequence: ~1.65s rapid variant sweep in center -> fast dock to top-left + homescreen fade-in
  useEffect(() => {
    if (introPhase === 'done') return;

    const sequence = [0, 1, 2, 0, 1, 2, 3];
    let step = 0;
    let tickTimer: number | null = null;
    let dockTimer: number | null = null;
    let doneTimer: number | null = null;

    if (introPhase === 'burst') {
      setLogoBurstIdx(sequence[0]);
      const advanceStep = () => {
        step += 1;
        if (step < sequence.length) {
          setLogoBurstIdx(sequence[step]);
          tickTimer = window.setTimeout(advanceStep, 195);
        } else {
          setLogoBurstIdx(null);
          dockTimer = window.setTimeout(() => {
            setIntroPhase('docking');
          }, 220);
        }
      };

      tickTimer = window.setTimeout(advanceStep, 195);
    } else if (introPhase === 'docking') {
      doneTimer = window.setTimeout(() => {
        setIntroPhase('done');
        setIntroOffset(null);
        onIntroCompleteRef.current?.();
      }, 560);
    }

    return () => {
      if (tickTimer !== null) window.clearTimeout(tickTimer);
      if (dockTimer !== null) window.clearTimeout(dockTimer);
      if (doneTimer !== null) window.clearTimeout(doneTimer);
    };
  }, [introPhase]);

  // CD cycle after intro fades in: 3s slow drive (prompt hidden) -> 10s pause (prompt appears in italic) -> repeat; stops permanently once user moves a song
  useEffect(() => {
    if (hasMovedSongs) {
      setCdCyclePhase('paused');
      return;
    }
    if (introPhase === 'burst') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCdCyclePhase('paused');
      return;
    }

    let timer: number | null = null;

    const startDrive = () => {
      setCdCyclePhase('driving');
      timer = window.setTimeout(() => {
        setCdCyclePhase('paused');
        timer = window.setTimeout(startDrive, 10000);
      }, 3000);
    };

    startDrive();

    return () => {
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [introPhase === 'burst', hasMovedSongs]);

  // ~5s rapid variant switching (without jiggle or yellow), then 10s calm pause (runs after intro finishes)
  useEffect(() => {
    if (introPhase !== 'done') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let tickTimer: number | null = null;
    let phaseTimer: number | null = null;
    let lastVariantIdx = 3;

    const pickNextIdx = (): number => {
      const candidates = WALLPAPER_OPTIONS.map((_, idx) => idx).filter(
        (idx) => idx !== lastVariantIdx
      );
      const nextIdx =
        candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
      lastVariantIdx = nextIdx;
      return nextIdx;
    };

    const startBurst = () => {
      const runTick = () => {
        setLogoBurstIdx(pickNextIdx());
        const nextDelay = 140 + Math.random() * 100;
        tickTimer = window.setTimeout(runTick, nextDelay);
      };

      runTick();

      phaseTimer = window.setTimeout(() => {
        if (tickTimer !== null) {
          window.clearTimeout(tickTimer);
          tickTimer = null;
        }
        lastVariantIdx = 3;
        setLogoBurstIdx(null);
        phaseTimer = window.setTimeout(startBurst, 10000);
      }, 5000);
    };

    phaseTimer = window.setTimeout(startBurst, 10000);

    return () => {
      if (tickTimer !== null) window.clearTimeout(tickTimer);
      if (phaseTimer !== null) window.clearTimeout(phaseTimer);
    };
  }, [introPhase]);

  const currentLogoOption =
    logoBurstIdx !== null
      ? WALLPAPER_OPTIONS[logoBurstIdx] ?? WALLPAPER_OPTIONS[3]
      : WALLPAPER_OPTIONS[3];

  const renderMenuButton = (item: MenuItem, align: 'left' | 'right') => {
    const isHovered = hoveredId === item.id;
    const isJiggling = !isHovered && activeJiggle?.id === item.id;
    const jiggleClass = isJiggling ? `animate-jiggle-${activeJiggle.variant}` : '';
    const isMoseGenerator = item.id === 'mose-generator';
    const isBlinking = isMoseGenerator || item.id === 'whats-in-my-bag';
    const sizeClasses =
      align === 'right'
        ? 'text-[0.86rem] sm:text-[1.12rem] md:text-[1.25rem] lg:text-[1.15rem] leading-[1.18] tracking-[-0.025em] decoration-[1.5px] lg:decoration-[1.5px] underline-offset-[2px]'
        : 'text-[1.28rem] sm:text-[1.61rem] md:text-[1.8rem] lg:text-[1.48rem] leading-[1.14] tracking-[-0.03em] decoration-[2px] lg:decoration-[2px] underline-offset-[3px] lg:underline-offset-[3px]';

    const sharedClassName = `helvetica-display relative block py-0.5 transition-transform duration-150 ease-out focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 whitespace-nowrap ${
      isMoseGenerator ? 'mb-[2.4em]' : ''
    } ${!isBlinking ? 'text-white' : ''} ${sizeClasses} ${
      align === 'right' ? 'text-right pl-3 origin-right' : 'text-left pr-3 origin-left'
    } ${isHovered ? 'italic scale-[1.16]' : 'hover:italic hover:scale-[1.16]'} ${jiggleClass}`;

    const content = (
      <span
        className={`underline decoration-inherit underline-offset-inherit ${
          isBlinking ? 'animate-mose-blink' : ''
        }`}
      >
        {item.label}
      </span>
    );

    if (item.href) {
      return (
        <a
          key={isJiggling ? `${item.id}-${activeJiggle.key}` : item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-ink="white"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId((curr) => (curr === item.id ? null : curr))}
          onFocus={() => setHoveredId(item.id)}
          onBlur={() => setHoveredId((curr) => (curr === item.id ? null : curr))}
          className={sharedClassName}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={isJiggling ? `${item.id}-${activeJiggle.key}` : item.id}
        type="button"
        data-cursor-ink="white"
        onClick={() => onSelectSection(item.id)}
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId((curr) => (curr === item.id ? null : curr))}
        onFocus={() => setHoveredId(item.id)}
        onBlur={() => setHoveredId((curr) => (curr === item.id ? null : curr))}
        className={sharedClassName}
      >
        {content}
      </button>
    );
  };

  return (
    <main
      data-cursor-surface="purple"
      className="relative min-h-screen w-full overflow-hidden bg-[#bc13fe] text-white"
    >
      {/* Top-Left Logo (clickable -> Mose Generator, intro FLIP at native high-res font size from center -> top-left, ~5s rapid variant burst + 10s pause) */}
      <header
        ref={logoRef}
        style={
          introPhase === 'burst'
            ? {
                transform: introOffset
                  ? `translate3d(${introOffset.dx}px, ${introOffset.dy}px, 0) scale(1)`
                  : undefined,
                transformOrigin: 'top left',
                opacity: introOffset ? 1 : 0,
                pointerEvents: 'none',
                willChange: 'transform',
              }
            : introPhase === 'docking' && introOffset
            ? {
                transform: `translate3d(0px, 0px, 0) scale(${1 / introOffset.scale})`,
                transformOrigin: 'top left',
                transition: 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: 1,
                pointerEvents: 'none',
                willChange: 'transform',
              }
            : undefined
        }
        className="absolute top-7 left-6 sm:top-10 sm:left-10 z-30 select-none"
      >
        <button
          type="button"
          data-cursor-ink="white"
          aria-label="Joshua Mose — zum Mose Generator"
          onClick={() => onSelectSection('mose-generator')}
          className="text-left origin-top-left transition-transform duration-150 ease-out hover:italic hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
        >
          <h1
            style={
              introPhase !== 'done' && introOffset
                ? { fontSize: `${introOffset.baseFontPx * introOffset.scale}px` }
                : undefined
            }
            className="helvetica-display flex flex-col items-start min-h-[4.08em] text-[1.28rem] sm:text-[1.61rem] md:text-[1.8rem] lg:text-[1.48rem] text-white leading-[1.02] tracking-[-0.03em] select-none"
          >
            {currentLogoOption.lines.map((line, idx) => {
              const isBursting = logoBurstIdx !== null;
              if (isBursting && idx === 1 && line === 'ist mein') {
                return (
                  <span
                    key={`${currentLogoOption.id}-${idx}`}
                    data-cursor-ink="white"
                    className="inline-block select-none"
                  >
                    ist <span className="italic">mein</span>
                  </span>
                );
              }
              const isVariantLine = isBursting && idx >= 2;
              return (
                <span
                  key={`${currentLogoOption.id}-${idx}`}
                  data-cursor-ink="white"
                  className={`inline-block select-none ${isVariantLine ? 'italic' : ''}`}
                >
                  {line}
                </span>
              );
            })}
          </h1>
        </button>
      </header>

      {/* Homescreen stage elements fade in as logo docks to top-left */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          introPhase === 'burst' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Center Label: "Verschiebe die Songs von Joshua Mose" (fades in/out; stays gone until reload once user moves a song) */}
        <div
          style={mobileCenterY !== null ? { top: `${mobileCenterY}px` } : undefined}
          className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 text-center transition-opacity duration-700 ease-in-out ${
            !hasMovedSongs && cdCyclePhase === 'paused' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            data-cursor-ink="white"
            className="pointer-events-none helvetica-display italic text-[0.86rem] sm:text-[1.12rem] md:text-[1.25rem] lg:text-[1.15rem] leading-[1.18] tracking-[-0.025em] text-white select-none whitespace-nowrap"
          >
            Verschiebe die Songs von Joshua Mose
          </span>
        </div>

        {/* Draggable Vintage Scratched Vinyl Sleeves Layer */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute">
              <VinylPlasticSleeve
                src={WHATS_IN_MY_BAG_IMAGE}
                alt="Joshua Mose — What's In My Bag"
                ariaLabel="What's In My Bag Platte verschieben oder öffnen"
                initialOffset={initialOffsets.bag}
                initialVelocity={{ vx: 11, vy: 7 }}
                isDrifting={!hasMovedSongs && introPhase !== 'burst' && cdCyclePhase === 'driving'}
                zIndex={21 + cardOrder.indexOf('bag')}
                onBringToFront={() => bringCardToFront('bag')}
                onDragMove={onSongsMoved}
                onClick={() => onSelectSection('whats-in-my-bag')}
                className="w-28 sm:w-40 md:w-44 lg:w-52"
              />
            </div>
            <div className="absolute">
              <VinylPlasticSleeve
                src={NEUE_NASE_IMAGE}
                alt="Joshua Mose — Neue Nase"
                ariaLabel="Neue Nase Platte verschieben oder öffnen"
                initialOffset={initialOffsets.nase}
                initialVelocity={{ vx: -9, vy: 8 }}
                isDrifting={!hasMovedSongs && introPhase !== 'burst' && cdCyclePhase === 'driving'}
                zIndex={21 + cardOrder.indexOf('nase')}
                onBringToFront={() => bringCardToFront('nase')}
                onDragMove={onSongsMoved}
                onClick={() => onSelectSection('neue-nase')}
                className="w-28 sm:w-40 md:w-44 lg:w-52"
              />
            </div>
            <div className="absolute">
              <VinylPlasticSleeve
                src={IMPOSTER_IMAGE}
                alt="Joshua Mose — Imposter"
                ariaLabel="Imposter Platte verschieben oder öffnen"
                initialOffset={initialOffsets.imposter}
                initialVelocity={{ vx: 8, vy: -10 }}
                isDrifting={!hasMovedSongs && introPhase !== 'burst' && cdCyclePhase === 'driving'}
                zIndex={21 + cardOrder.indexOf('imposter')}
                onBringToFront={() => bringCardToFront('imposter')}
                onDragMove={onSongsMoved}
                onClick={() => onSelectSection('imposter')}
                className="w-28 sm:w-40 md:w-44 lg:w-52"
              />
            </div>
          </div>
        </div>

        {/* Right Menu: bottom-right on mobile/tablet, top-right on desktop, smaller font */}
        <nav
          aria-label="Social & Extra Menü"
          className="absolute bottom-11 right-6 sm:bottom-11 sm:right-10 lg:bottom-auto lg:top-10 lg:right-10 z-30 flex flex-col items-end"
        >
          {TOP_RIGHT_MENU_ITEMS.map((item) => renderMenuButton(item, 'right'))}
        </nav>

        {/* Bottom-Left Menu: NEUE SINGLE: What's In My Bag, Neue Nase, Imposter (vertically centered only in mobile portrait) */}
        <nav
          ref={songsNavRef}
          aria-label="Hauptmenü"
          className="absolute bottom-11 left-6 sm:left-10 max-sm:portrait:bottom-auto max-sm:portrait:top-1/2 max-sm:portrait:-translate-y-1/2 z-30 flex flex-col items-start"
        >
          {BOTTOM_MENU_ITEMS.map((item) => renderMenuButton(item, 'left'))}
        </nav>

        {/* Bottom Center Handle & Legal Links */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 w-full px-4">
          <LegalFooter onNavigate={onSelectSection} />
        </div>
      </div>
    </main>
  );
}
