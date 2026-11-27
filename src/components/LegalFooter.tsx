import { SectionId } from '../types';

interface LegalFooterProps {
  onNavigate: (section: SectionId) => void;
  className?: string;
}

export function LegalFooter({
  onNavigate,
  className = '',
}: LegalFooterProps) {
  return (
    <footer
      className={`select-none flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] sm:text-[11px] lg:text-[15px] font-bold tracking-[-0.01em] text-white ${className}`}
    >
      <span data-cursor-ink="white" className="whitespace-nowrap">
        © 2026 Joshua Mose
      </span>
      <span aria-hidden="true" className="text-[7px] sm:text-[7px] lg:text-[8px]">
        ·
      </span>
      <button
        type="button"
        data-cursor-ink="white"
        onClick={() => onNavigate('impressum')}
        className="text-[7px] sm:text-[7px] lg:text-[8px] underline decoration-1 underline-offset-2 transition-transform duration-150 hover:italic hover:scale-[1.14] whitespace-nowrap"
      >
        Impressum
      </button>
      <span aria-hidden="true" className="text-[7px] sm:text-[7px] lg:text-[8px]">
        ·
      </span>
      <button
        type="button"
        data-cursor-ink="white"
        onClick={() => onNavigate('datenschutz')}
        className="text-[7px] sm:text-[7px] lg:text-[8px] underline decoration-1 underline-offset-2 transition-transform duration-150 hover:italic hover:scale-[1.14] whitespace-nowrap"
      >
        Datenschutz
      </button>
    </footer>
  );
}
