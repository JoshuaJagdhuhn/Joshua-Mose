/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { HomeStage } from './components/HomeStage';
import { SubpageShell } from './components/SubpageShell';
import { MENU_ITEMS } from './data/artistData';
import { SectionId } from './types';

const ALL_SECTIONS: SectionId[] = [
  ...MENU_ITEMS.map((m) => m.id),
  'impressum',
  'datenschutz',
];

function readSectionFromHash(): SectionId {
  const raw = window.location.hash.replace(/^#/, '') as SectionId;
  if (ALL_SECTIONS.includes(raw) && raw !== 'home') {
    return raw;
  }
  return 'home';
}

export default function App() {
  const [section, setSection] = useState<SectionId>(() => readSectionFromHash());
  const [showIntro, setShowIntro] = useState<boolean>(() => readSectionFromHash() === 'home');
  const [hasMovedSongs, setHasMovedSongs] = useState<boolean>(false);

  useEffect(() => {
    const onHashChange = () => {
      setSection(readSectionFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: SectionId) => {
    setSection(next);
    window.history.pushState(null, '', next === 'home' ? '#' : `#${next}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <>
      <CustomCursor />
      {section === 'home' ? (
        <HomeStage
          onSelectSection={navigate}
          playIntro={showIntro}
          onIntroComplete={() => setShowIntro(false)}
          hasMovedSongs={hasMovedSongs}
          onSongsMoved={() => setHasMovedSongs(true)}
        />
      ) : (
        <SubpageShell activeSection={section} onNavigate={navigate} />
      )}
    </>
  );
}
