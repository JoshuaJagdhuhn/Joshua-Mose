import { ArrowLeft } from 'lucide-react';
import {
  IMPOSTER_IMAGE,
  MENU_ITEMS,
  NEUE_NASE_IMAGE,
  WHATS_IN_MY_BAG_IMAGE,
} from '../data/artistData';
import { SectionId } from '../types';
import { LegalFooter } from './LegalFooter';
import { MoseGenerator } from './MoseGenerator';
import { VinylPlasticSleeve } from './VinylPlasticSleeve';

interface SubpageShellProps {
  activeSection: Exclude<SectionId, 'home'>;
  onNavigate: (section: SectionId) => void;
}

export function SubpageShell({
  activeSection,
  onNavigate,
}: SubpageShellProps) {
  const currentItem = MENU_ITEMS.find((item) => item.id === activeSection);
  const pageTitle =
    activeSection === 'impressum'
      ? 'Impressum'
      : activeSection === 'datenschutz'
      ? 'Datenschutz'
      : activeSection === 'whats-in-my-bag'
      ? 'What‘s In My Bag'
      : currentItem?.label;

  const songCover =
    activeSection === 'whats-in-my-bag'
      ? {
          src: WHATS_IN_MY_BAG_IMAGE,
          alt: "Joshua Mose — What's In My Bag",
          label: "What's In My Bag Platte verschieben",
          spotifyLabel: 'Whats In My Bag auf Spotify',
          spotifyUrl:
            'https://open.spotify.com/intl-de/track/3Ddhj3Zg9CL0RcWw4MDvUw?si=f074629008464c05',
        }
      : activeSection === 'neue-nase'
      ? {
          src: NEUE_NASE_IMAGE,
          alt: 'Joshua Mose — Neue Nase',
          label: 'Neue Nase Platte verschieben',
          spotifyLabel: 'Neue Nase auf Spotify',
          spotifyUrl:
            'https://open.spotify.com/intl-de/track/1cBNUgcMLHEOPFKBSPQM9B?si=39d554bac0644a7d',
        }
      : activeSection === 'imposter'
      ? {
          src: IMPOSTER_IMAGE,
          alt: 'Joshua Mose — Imposter',
          label: 'Imposter Platte verschieben',
          spotifyLabel: 'Imposter auf Spotify',
          spotifyUrl:
            'https://open.spotify.com/intl-de/track/3mDljO23QzMe0jVQXogBYB?si=d099ff9066d947ff',
        }
      : null;

  return (
    <div
      data-cursor-surface="purple"
      className="min-h-screen w-full bg-[#bc13fe] text-white flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Bar: Back to Home & Current Page Label */}
      <header className="w-full px-6 sm:px-10 pt-7 sm:pt-10 flex items-center justify-between gap-4 z-30">
        <button
          type="button"
          data-cursor-ink="white"
          onClick={() => onNavigate('home')}
          className="helvetica-display inline-flex items-center gap-2 text-[1.28rem] sm:text-[1.61rem] md:text-[1.8rem] lg:text-[1.48rem] text-white underline decoration-[2px] lg:decoration-[2px] underline-offset-[3px] lg:underline-offset-[3px] origin-left transition-transform duration-150 ease-out hover:italic hover:scale-[1.14] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          <span>Zurück</span>
        </button>

        {pageTitle && (
          <span
            data-cursor-ink="white"
            className="helvetica-display text-[1.28rem] sm:text-[1.61rem] md:text-[1.8rem] lg:text-[1.48rem] text-white select-none whitespace-nowrap shrink-0"
          >
            {pageTitle}
          </span>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-10">
        {songCover && (
          <div className="flex flex-col items-center justify-center gap-6">
            <VinylPlasticSleeve
              src={songCover.src}
              alt={songCover.alt}
              ariaLabel={songCover.label}
              className="w-52 sm:w-64 md:w-72"
            />
            <a
              href={songCover.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-ink="white"
              className="helvetica-display text-center text-[1.28rem] sm:text-[1.61rem] md:text-[1.8rem] lg:text-[1.48rem] leading-[1.14] tracking-[-0.03em] text-[#fff000] underline decoration-[#fff000] decoration-[2px] underline-offset-[3px] transition-transform duration-150 ease-out hover:italic hover:scale-[1.14] focus-visible:outline-2 focus-visible:outline-[#fff000] focus-visible:outline-offset-4"
            >
              {songCover.spotifyLabel}
            </a>
          </div>
        )}

        {activeSection === 'mose-generator' && <MoseGenerator />}

        {activeSection === 'impressum' && (
          <article className="max-w-xl w-full space-y-3 text-[9px] sm:text-[10px] lg:text-[10px] font-bold leading-relaxed text-white">
            <h2 className="helvetica-display text-[11px] sm:text-[12px] lg:text-[14px] italic">
              Angaben gemäß § 18 Abs. 1 Medienstaatsvertrag (MStV)
            </h2>

            <section className="space-y-0.5">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                Betreiber der Website
              </h3>
              <p data-cursor-ink="white">
                Joshua Moussa Jagdhuhn
                <br />
                Künstlername: Joshua Mose
              </p>
              <p data-cursor-ink="white" className="pt-0.5">
                Schöneberger Straße 15
                <br />
                12163 Berlin
                <br />
                Deutschland
              </p>
            </section>

            <section className="space-y-0.5">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                Kontakt
              </h3>
              <p data-cursor-ink="white">
                E-Mail: joshuamose.contact@gmail.com
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                Über diese Website
              </h3>
              <p data-cursor-ink="white">
                Diese Website ist ein privates Artist- und Musikprojekt von Joshua Jagdhuhn.
                <br />
                Sie dient der Präsentation und Verlinkung eigener musikalischer Veröffentlichungen sowie der Bereitstellung eines kostenlosen Wallpaper-Generators.
                <br />
                Über die Website werden derzeit keine Waren oder kostenpflichtigen Dienstleistungen angeboten.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                Externe Links
              </h3>
              <p data-cursor-ink="white">
                Diese Website enthält Verlinkungen zu externen Plattformen und Social-Media-Diensten. Für die Inhalte der verlinkten Seiten sind ausschließlich deren jeweilige Betreiber verantwortlich.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                Urheberrecht
              </h3>
              <p data-cursor-ink="white">
                Die auf dieser Website veröffentlichten eigenen Inhalte, insbesondere Texte, Grafiken, Designs und musikalischen Werke, unterliegen dem deutschen Urheberrecht, soweit nicht anders gekennzeichnet.
                <br />
                Eine Verwendung, Vervielfältigung oder Verbreitung außerhalb der gesetzlichen Grenzen des Urheberrechts bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                Hinweis zur Erstellung der Website
              </h3>
              <p data-cursor-ink="white">
                Diese Website wurde unter Einsatz von KI-gestützten Tools konzipiert und entwickelt. Die KI-Tools dienten dabei als unterstützende Werkzeuge bei der Gestaltung, Programmierung und Umsetzung der Website. Die inhaltliche Verantwortung für die Website liegt beim Betreiber.
              </p>
            </section>
          </article>
        )}

        {activeSection === 'datenschutz' && (
          <article className="max-w-xl w-full space-y-3 text-[9px] sm:text-[10px] lg:text-[10px] font-bold leading-relaxed text-white">
            <div>
              <h2 className="helvetica-display text-[11px] sm:text-[12px] lg:text-[14px] italic">
                Datenschutzerklärung
              </h2>
              <p data-cursor-ink="white" className="mt-0.5">
                Stand: November 2026
              </p>
            </div>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                1. Verantwortlicher
              </h3>
              <p data-cursor-ink="white">
                Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
              </p>
              <p data-cursor-ink="white">
                Joshua Moussa Jagdhuhn
                <br />
                Schöneberger Straße 15
                <br />
                12163 Berlin
                <br />
                Deutschland
              </p>
              <p data-cursor-ink="white">
                E-Mail: joshuamose.contact@gmail.com
                <br />
                Website: https://joshuamose.com
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                2. Allgemeine Hinweise
              </h3>
              <p data-cursor-ink="white">
                Diese Website dient der Präsentation meines privaten Artist- und Musikprojekts.
                <br />
                Besucher können hier Informationen zu meiner Musik finden, externe Musik- und Social-Media-Plattformen aufrufen und einen kostenlosen Wallpaper-Generator verwenden.
                <br />
                Der Schutz personenbezogener Daten ist mir wichtig. Personenbezogene Daten werden ausschließlich im Rahmen der geltenden gesetzlichen Datenschutzbestimmungen verarbeitet.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                3. Hosting über GitHub Pages
              </h3>
              <p data-cursor-ink="white">
                Diese Website wird über GitHub Pages bereitgestellt.
                <br />
                Anbieter:
                <br />
                GitHub, Inc.
                <br />
                88 Colin P. Kelly Jr. Street
                <br />
                San Francisco, CA 94107
                <br />
                USA
              </p>
              <p data-cursor-ink="white">
                GitHub Pages ist ein Hosting-Dienst, mit dem statische Websites direkt aus einem GitHub-Repository veröffentlicht werden können.
                <br />
                Laut GitHub werden beim Aufruf einer GitHub-Pages-Website die IP-Adressen der Besucher aus Sicherheitsgründen protokolliert und gespeichert.
                <br />
                Dabei können insbesondere folgende Informationen verarbeitet werden:
              </p>
              <ul data-cursor-ink="white" className="list-disc pl-4 space-y-0.5">
                <li>IP-Adresse</li>
                <li>Zeitpunkt des Zugriffs</li>
                <li>Aufgerufene Inhalte und Dateien</li>
                <li>Technische Informationen zur Verbindung</li>
              </ul>
              <p data-cursor-ink="white">
                Die Verarbeitung dient der Sicherheit und dem zuverlässigen Betrieb der Website.
                <br />
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse besteht im sicheren und funktionsfähigen Betrieb der Website.
                <br />
                Weitere Informationen zum Datenschutz bei GitHub:
                <br />
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-1 underline-offset-2 hover:italic break-all"
                >
                  https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
                </a>
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                4. Wallpaper-Generator
              </h3>
              <p data-cursor-ink="white">
                Auf dieser Website wird ein kostenloser Wallpaper-Generator angeboten.
                <br />
                Die Erstellung der Wallpaper erfolgt lokal im Browser des jeweiligen Besuchers.
                <br />
                Nach dem derzeitigen technischen Konzept werden durch den Generator selbst keine personenbezogenen Daten gespeichert oder an externe Dienste übermittelt.
                <br />
                Die normale technische Kommunikation beim Aufruf der Website bleibt davon unberührt.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                5. Externe Links zu Musik- und Social-Media-Plattformen
              </h3>
              <p data-cursor-ink="white">
                Diese Website enthält Links zu externen Plattformen, darunter beispielsweise:
              </p>
              <ul data-cursor-ink="white" className="list-disc pl-4 space-y-0.5">
                <li>Spotify</li>
                <li>SoundCloud</li>
                <li>YouTube</li>
                <li>Instagram</li>
                <li>Weitere Social-Media-Plattformen</li>
              </ul>
              <p data-cursor-ink="white">
                Es handelt sich um gewöhnliche externe Verlinkungen und nicht um automatisch geladene Inhalte dieser Anbieter.
                <br />
                Erst durch das Anklicken eines Links wird eine Verbindung zur jeweiligen externen Plattform hergestellt.
                <br />
                Ab diesem Zeitpunkt gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
                <br />
                Für die Datenverarbeitung durch externe Plattformen bin ich nicht verantwortlich.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                6. Schriftarten und externe Ressourcen
              </h3>
              <p data-cursor-ink="white">
                Auf dieser Website können Schriftarten und andere technische Ressourcen verwendet werden.
                <br />
                Die konkrete Einbindung der Schriftarten wird derzeit geprüft.
                <br />
                Falls Schriftarten lokal auf dem eigenen Webserver bereitgestellt werden, erfolgt dadurch keine zusätzliche Verbindung zu externen Schriftarten-Anbietern.
                <br />
                Falls externe Schriftarten-Dienste eingesetzt werden, können beim Laden der Schriftarten personenbezogene Daten, insbesondere die IP-Adresse, an die jeweiligen Anbieter übertragen werden.
                <br />
                Die Angaben zu den tatsächlich verwendeten Schriftarten und deren Anbietern werden nach technischer Prüfung ergänzt.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                7. Cookies und Tracking
              </h3>
              <p data-cursor-ink="white">
                Nach aktuellem Stand ist kein Einsatz von Werbe- oder Analyse-Tracking durch den Websitebetreiber vorgesehen.
                <br />
                Ob technisch notwendige Cookies oder vergleichbare Technologien durch eingesetzte Komponenten verwendet werden, ist vor Veröffentlichung anhand der tatsächlichen Website-Konfiguration zu prüfen.
                <br />
                Nicht notwendige Technologien, die eine Einwilligung erfordern, werden nur nach entsprechender Einwilligung eingesetzt.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                8. Deine Rechte
              </h3>
              <p data-cursor-ink="white">
                Im Rahmen der Datenschutz-Grundverordnung hast du insbesondere folgende Rechte:
              </p>
              <ul data-cursor-ink="white" className="list-disc pl-4 space-y-0.5">
                <li>Auskunft über deine gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung deiner personenbezogenen Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)</li>
              </ul>
              <p data-cursor-ink="white">
                Außerdem hast du das Recht, dich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren (Art. 77 DSGVO).
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                9. Datensicherheit
              </h3>
              <p data-cursor-ink="white">
                Diese Website wird über eine HTTPS-gesicherte Verbindung bereitgestellt, sofern HTTPS für die verwendete Domain aktiviert ist.
                <br />
                Die verschlüsselte Verbindung dient dem Schutz der übertragenen Daten vor unbefugtem Zugriff während der Übertragung.
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="helvetica-display text-[10px] sm:text-[10px] lg:text-[11px] italic">
                10. Änderungen dieser Datenschutzerklärung
              </h3>
              <p data-cursor-ink="white">
                Ich behalte mir vor, diese Datenschutzerklärung anzupassen, wenn sich die technischen Funktionen der Website oder die rechtlichen Anforderungen ändern.
                <br />
                Es gilt die jeweils auf dieser Website veröffentlichte Fassung.
              </p>
            </section>
          </article>
        )}

        {!songCover &&
          activeSection !== 'mose-generator' &&
          activeSection !== 'impressum' &&
          activeSection !== 'datenschutz' && (
            <p
              data-cursor-ink="white"
              className="helvetica-display italic text-center text-[1.28rem] sm:text-[1.61rem] md:text-[1.8rem] lg:text-[1.48rem] leading-[1.14] tracking-[-0.03em] text-white"
            >
              Coming Soon
            </p>
          )}
      </main>

      {/* Bottom Center Handle & Legal Links */}
      <div className="w-full pb-2.5 sm:pb-3.5 pt-4 px-4 z-30">
        <LegalFooter onNavigate={onNavigate} />
      </div>
    </div>
  );
}
