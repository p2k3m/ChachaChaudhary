import { useMemo, useState } from 'react';
import { assetManifest } from '../config/assets';
import { clues, suspects } from '../config/gameData';
import { ActionButton } from '../components/ui/ActionButton';
import { ClueCard } from '../components/ui/ClueCard';
import { DialogueBubble } from '../components/ui/DialogueBubble';
import { SuspectCard } from '../components/ui/SuspectCard';
import { ComicPanel } from '../components/layout/ComicPanel';
import { useGameStore } from '../state/gameStore';
import type { Clue, Suspect } from '../types/game';

export const InvestigationScene = () => {
  const openScene = useGameStore((state) => state.openScene);
  const setSuspect = useGameStore((state) => state.setSuspect);
  const selectedSuspectId = useGameStore((state) => state.selectedSuspectId);
  const [inspectedClues, setInspectedClues] = useState<Clue['id'][]>([]);

  const selectedSuspect = useMemo(
    () => suspects.find((suspect) => suspect.id === selectedSuspectId),
    [selectedSuspectId]
  );

  const handleSuspect = (suspect: Suspect) => {
    setSuspect(suspect.id);
  };

  const handleClue = (clue: Clue) => {
    setInspectedClues((current) =>
      current.includes(clue.id) ? current.filter((id) => id !== clue.id) : [...current, clue.id]
    );
  };

  return (
    <ComicPanel
      backgroundImage={assetManifest.scenes.garden}
      headline="Investigate the Garden"
      subline="Tap each suspect and clue to collect statements."
    >
      <div className="investigation-grid">
        <section className="investigation-grid__clues" aria-label="Clues">
          {clues.map((clue) => (
            <ClueCard
              key={clue.id}
              clue={clue}
              iconUrl={assetManifest.ui[clue.iconKey]}
              isSelected={inspectedClues.includes(clue.id)}
              onToggle={handleClue}
            />
          ))}
        </section>
        <section className="investigation-grid__suspects" aria-label="Suspects">
          {suspects.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              avatarUrl={assetManifest.characters[suspect.avatarKey]}
              isActive={selectedSuspectId === suspect.id}
              onSelect={handleSuspect}
            />
          ))}
        </section>
        <aside className="investigation-grid__dialogue" aria-live="polite">
          {selectedSuspect ? (
            <DialogueBubble speaker={selectedSuspect.name}>{selectedSuspect.statement}</DialogueBubble>
          ) : (
            <DialogueBubble speaker="Chacha" tone="hint">
              Tap each suspect to hear their story, then continue to deduction.
            </DialogueBubble>
          )}
        </aside>
        <ActionButton onClick={() => openScene('deduction')} disabled={!selectedSuspectId}>
          Review the Evidence
        </ActionButton>
      </div>
    </ComicPanel>
  );
};
