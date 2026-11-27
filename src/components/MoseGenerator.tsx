import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { WALLPAPER_OPTIONS } from '../data/artistData';

type BgTheme = 'purple' | 'white' | 'black';

const BG_THEMES: { id: BgTheme; label: string; bg: string; fg: string }[] = [
  { id: 'purple', label: 'Lila', bg: '#bc13fe', fg: '#ffffff' },
  { id: 'white', label: 'Weiß', bg: '#ffffff', fg: '#bc13fe' },
  { id: 'black', label: 'Schwarz', bg: '#0e0e0e', fg: '#bc13fe' },
];

export function MoseGenerator() {
  const [selectedId, setSelectedId] = useState<string>('mein-favorite-popstar');
  const [bgTheme, setBgTheme] = useState<BgTheme>('purple');
  const [activePulseIdx, setActivePulseIdx] = useState<number>(0);
  const [downloaded, setDownloaded] = useState(false);

  // Alternate growing larger + italic across the 4 text options
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActivePulseIdx((prev) => (prev + 1) % WALLPAPER_OPTIONS.length);
    }, 950);

    return () => window.clearInterval(interval);
  }, []);

  const activeOption =
    WALLPAPER_OPTIONS.find((o) => o.id === selectedId) ?? WALLPAPER_OPTIONS[3];
  const activeTheme = BG_THEMES.find((t) => t.id === bgTheme) ?? BG_THEMES[0];

  const handleDownloadWallpaper = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = activeTheme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = activeTheme.fg;
    ctx.font = 'bold 92px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.textBaseline = 'top';

    const lineHeight = 96;
    const startY = 340;
    const startX = 104;

    activeOption.lines.forEach((line, idx) => {
      ctx.fillText(line, startX, startY + idx * lineHeight);
    });

    ctx.font = 'bold 28px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('© 2026 Joshua Mose', canvas.width / 2, canvas.height - 96);

    const link = document.createElement('a');
    link.download = `joshua-mose-wallpaper-${activeOption.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloaded(true);
  };

  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
      {/* Left Controls */}
      <div className="w-full max-w-md flex flex-col items-start">
        <p
          data-cursor-ink="white"
          className="helvetica-display text-lg sm:text-xl lg:text-[28px] leading-snug text-white mb-7"
        >
          Gestalte dein eigenes Joshua-Mose-Wallpaper für einen affengeilen Look auf deinem Smartphone.
        </p>

        {/* 4 Text Options: stationary, no box, underlined only, alternating larger + italic */}
        <div className="w-full mb-7">
          <p data-cursor-ink="white" className="text-[11px] lg:text-[15px] font-bold text-white/85 mb-2.5">
            Text-Auswahl (Joshua Mose ist …)
          </p>
          <div className="flex flex-col items-start gap-2">
            {WALLPAPER_OPTIONS.map((option, idx) => {
              const isSelected = selectedId === option.id;
              const isPulsing = activePulseIdx === idx;

              return (
                <button
                  key={option.id}
                  type="button"
                  data-cursor-ink="white"
                  onClick={() => {
                    setSelectedId(option.id);
                    setDownloaded(false);
                  }}
                  className={`helvetica-display text-left text-base sm:text-lg lg:text-[25px] underline underline-offset-4 origin-left transition-all duration-300 ease-out hover:italic hover:scale-[1.15] ${
                    isSelected
                      ? 'text-[#fff000] decoration-[#fff000] decoration-[2.5px]'
                      : 'text-white decoration-white decoration-[1.5px]'
                  } ${isPulsing ? 'italic scale-[1.16]' : ''}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wallpaper Color Preset: no boxes, underlined text only */}
        <div className="w-full mb-8">
          <p data-cursor-ink="white" className="text-[11px] lg:text-[15px] font-bold text-white/85 mb-2.5">
            Hintergrundfarbe
          </p>
          <div className="flex items-center gap-5">
            {BG_THEMES.map((theme) => {
              const active = bgTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  data-cursor-ink="white"
                  onClick={() => {
                    setBgTheme(theme.id);
                    setDownloaded(false);
                  }}
                  className={`helvetica-display text-sm sm:text-base lg:text-[22px] underline underline-offset-4 origin-left transition-transform duration-150 hover:italic hover:scale-[1.15] ${
                    active
                      ? 'text-[#fff000] decoration-[#fff000] decoration-2 italic'
                      : 'text-white decoration-white decoration-1'
                  }`}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Only the Download Button has a box */}
        <button
          type="button"
          onClick={handleDownloadWallpaper}
          data-cursor-surface="white"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#bc13fe] text-xs sm:text-sm lg:text-[20px] font-bold hover:italic hover:scale-[1.04] origin-left transition-transform duration-150"
        >
          <Download className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>Handy-Wallpaper herunterladen (9:16)</span>
        </button>

        {downloaded && (
          <p data-cursor-ink="white" className="mt-2.5 text-[11px] lg:text-[15px] font-bold text-white">
            Wallpaper als PNG (1080×1920) gespeichert.
          </p>
        )}
      </div>

      {/* Live 9:16 Mobile Wallpaper Preview */}
      <div className="shrink-0">
        <div
          data-cursor-surface={bgTheme === 'white' ? 'white' : 'purple'}
          style={{ backgroundColor: activeTheme.bg, color: activeTheme.fg }}
          className="w-52 sm:w-60 aspect-[9/16] p-6 border-2 border-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] flex flex-col justify-between select-none"
        >
          <div className="pt-8 helvetica-display text-xl sm:text-2xl leading-[0.98] tracking-[-0.03em]">
            {activeOption.lines.map((line, i) => (
              <p key={`${activeOption.id}-${i}`}>{line}</p>
            ))}
          </div>

          <div className="text-center pb-1">
            <span className="text-[9px] font-bold tracking-[-0.01em]">
              © 2026 Joshua Mose
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
