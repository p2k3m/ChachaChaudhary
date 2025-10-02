import { assetManifest } from '../config/assets';
import { ActionButton } from '../components/ui/ActionButton';
import { DialogueBubble } from '../components/ui/DialogueBubble';
import { ComicPanel } from '../components/layout/ComicPanel';
import { useGameStore } from '../state/gameStore';

export const SolutionScene = () => {
  const { lastSolveResult, openScene } = useGameStore((state) => ({
    lastSolveResult: state.lastSolveResult,
    openScene: state.openScene
  }));

  const message = lastSolveResult?.correct
    ? 'Wah wah! You have sharp brains! Only Gudiya could leave such marks.'
    : 'Think again! The clues point to someone small and furry!';

  return (
    <ComicPanel
      backgroundImage={assetManifest.scenes.celebration}
      headline={lastSolveResult?.correct ? 'Mystery Solved!' : 'Not Quite...'}
      subline={lastSolveResult?.correct ? 'Gudiya confesses with wagging tail.' : 'Use the hint and try again.'}
    >
      <div className="solution-grid">
        <img src={assetManifest.characters.chacha} alt="Chacha celebrating" className="hero-portrait" />
        <img src={assetManifest.characters.gudiya} alt="Gudiya the dog" className="hero-portrait" />
        <DialogueBubble speaker="Chacha" tone={lastSolveResult?.correct ? 'excited' : 'warning'}>
          {message}
        </DialogueBubble>
        {lastSolveResult?.correct ? (
          <DialogueBubble speaker="Sabu" tone="excited">TING TING TING!</DialogueBubble>
        ) : (
          <DialogueBubble speaker="Chacha" tone="hint">
            Remember, who loves mangoes and is quick on their feet?
          </DialogueBubble>
        )}
        <div className="solution-grid__actions">
          {lastSolveResult?.correct ? (
            <ActionButton onClick={() => openScene('score')}>View Score</ActionButton>
          ) : (
            <ActionButton variant="secondary" onClick={() => openScene('deduction')}>
              Try Again
            </ActionButton>
          )}
        </div>
      </div>
    </ComicPanel>
  );
};
