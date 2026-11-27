import { useEffect, useRef, useState } from 'react';

type CursorColorMode = 'on-purple' | 'on-white-surface' | 'on-white-ink';

function parseRgb(color: string): [number, number, number, number] | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    match[4] !== undefined ? Number(match[4]) : 1,
  ];
}

function isWhiteColor(rgb: [number, number, number, number]): boolean {
  const [r, g, b, a] = rgb;
  return a > 0.45 && r > 235 && g > 235 && b > 235;
}

function isPurpleColor(rgb: [number, number, number, number]): boolean {
  const [r, g, b, a] = rgb;
  // #bc13fe -> (188, 19, 254)
  return a > 0.45 && r > 140 && g < 80 && b > 200;
}

function detectSurfaceUnderCursor(x: number, y: number): CursorColorMode {
  const elements = document.elementsFromPoint(x, y);

  for (const el of elements) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.dataset.customCursor === 'true') continue;

    // Explicit ink marker (e.g. white text elements over purple background)
    if (el.dataset.cursorInk === 'white') {
      return 'on-white-ink';
    }

    // Explicit surface marker
    if (el.dataset.cursorSurface === 'white') {
      return 'on-white-surface';
    }
    if (el.dataset.cursorSurface === 'purple') {
      return 'on-purple';
    }

    const styles = window.getComputedStyle(el);
    const bg = parseRgb(styles.backgroundColor);

    if (bg && bg[3] > 0.2) {
      if (isWhiteColor(bg)) {
        return 'on-white-surface';
      }
      if (isPurpleColor(bg)) {
        return 'on-purple';
      }
    }
  }

  // Fallback check against body background
  const bodyBg = parseRgb(window.getComputedStyle(document.body).backgroundColor);
  if (bodyBg && isWhiteColor(bodyBg)) {
    return 'on-white-surface';
  }
  return 'on-purple';
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<CursorColorMode>('on-purple');

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.body.classList.add('custom-cursor-active');

    let rafId = 0;
    let latestX = -100;
    let latestY = -100;

    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%) scale(${pressed ? 0.78 : 1})`;
      }
      setMode(detectSurfaceUnderCursor(latestX, latestY));
      rafId = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      latestX = e.clientX;
      latestY = e.clientY;
      if (!visible) setVisible(true);
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateCursor);
      }
    };

    const handlePointerDown = () => setPressed(true);
    const handlePointerUp = () => setPressed(false);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pressed, visible]);

  if (!visible) return null;

  const isPurpleDot = mode === 'on-white-surface' || mode === 'on-white-ink';

  return (
    <div
      ref={cursorRef}
      data-custom-cursor="true"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-none transition-[background-color,border-color,width,height] duration-100 ease-out"
      style={{
        width: '14px',
        height: '14px',
        backgroundColor: isPurpleDot ? '#bc13fe' : '#ffffff',
        border: mode === 'on-white-ink' ? '1.5px solid #ffffff' : '1.5px solid transparent',
        willChange: 'transform',
      }}
    />
  );
}
