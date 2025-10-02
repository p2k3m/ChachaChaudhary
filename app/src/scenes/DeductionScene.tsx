import { useMemo } from 'react';
import { assetManifest } from '../config/assets';
import { clues, suspects } from '../config/gameData';
import { ActionButton } from '../components/ui/ActionButton';
import { DialogueBubble } from '../components/ui/DialogueBubble';
import { ComicPanel } from '../components/layout/ComicPanel';
import { useHint } from '../hooks/useHint';
import { useGameStore } from '../state/gameStore';

export const DeductionScene = () => {
  const { matchedClues, selectedSuspectId, toggleClue, solve } = useGameStore((state) => ({
    matchedClues: state.matchedClues,
    selectedSuspectId: state.selectedSuspectId,
    toggleClue: state.toggleClue,
    solve: state.solve
  }));
  const openScene = useGameStore((state) => state.openScene);
  const { loading, error, response, requestHint } = useHint();

  const selectedSuspect = useMemo(
    () => suspects.find((suspect) => suspect.id === selectedSuspectId),
    [selectedSuspectId]
  );

  const handleSolve = () => {
    solve();
    openScene('solution');
  };

  return (
    <ComicPanel
      backgroundImage={assetManifest.scenes.deduction}
      headline="Deduction Time"
      subline="Match clues to the culprit and solve the case."
    >
      <div className="deduction-grid">
        <section className="deduction-grid__summary">
          {selectedSuspect ? (
            <DialogueBubble speaker="Chacha" tone="hint">
              You suspect {selectedSuspect.name}. Match the right clues to lock your answer.
            </DialogueBubble>
          ) : (
            <DialogueBubble speaker="Chacha" tone="warning">
              Select a suspect first by revisiting the investigation.
            </DialogueBubble>
          )}
          <div className="deduction-grid__actions">
            <ActionButton
              variant="secondary"
              onClick={() =>
                requestHint({
                  scene: 'deduction',
                  inspectedClues: matchedClues,
                  suspect: selectedSuspectId
                }).catch(() => null)
              }
              disabled={loading}
            >
              {loading ? 'Summoning Hint…' : 'Need a Hint?'}
            </ActionButton>
            {error ? <p className="error-text">{error}</p> : null}
            {response ? (
              <DialogueBubble speaker="Chacha" tone="hint">
                {response.hint}
              </DialogueBubble>
            ) : null}
          </div>
        </section>
        <section className="deduction-grid__board" aria-label="Match clues to suspects">
          {clues.map((clue) => (
            <article key={clue.id} className="deduction-grid__card">
              <header>
                <img src={assetManifest.ui[clue.iconKey]} alt="" aria-hidden />
                <h3>{clue.label}</h3>
              </header>
              <p>{clue.description}</p>
              <div className="deduction-grid__options">
                {suspects.map((suspect) => (
                  <button
                    key={`${clue.id}-${suspect.id}`}
                    type="button"
                    className={`deduction-chip ${
                      matchedClues[clue.id] === suspect.id ? 'deduction-chip--active' : ''
                    }`}
                    onClick={() => toggleClue(clue.id, suspect.id)}
                  >
                    {suspect.name}
                  </button>
                ))}
                <button
                  type="button"
                  className={`deduction-chip ${matchedClues[clue.id] === null ? 'deduction-chip--active' : ''}`}
                  onClick={() => toggleClue(clue.id, null)}
                >
                  Ignore clue
                </button>
              </div>
            </article>
          ))}
        </section>
        <footer className="deduction-grid__footer">
          <ActionButton onClick={handleSolve} disabled={!selectedSuspectId}>
            Solve the Mystery
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => openScene('investigation')}>
            Revisit Investigation
          </ActionButton>
        </footer>
      </div>
    </ComicPanel>
  );
};
