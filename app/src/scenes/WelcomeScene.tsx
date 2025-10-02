import { assetManifest } from '../config/assets';
import { ActionButton } from '../components/ui/ActionButton';
import { DialogueBubble } from '../components/ui/DialogueBubble';
import { ComicPanel } from '../components/layout/ComicPanel';
import { useGameStore } from '../state/gameStore';

export const WelcomeScene = () => {
  const startInvestigation = useGameStore((state) => state.startInvestigation);

  return (
    <ComicPanel
      backgroundImage={assetManifest.scenes.welcome}
      headline="Namaste! Ready for a brain adventure?"
      subline="Chacha Choudhary and Sabu await your command."
    >
      <div className="scene-grid">
        <img src={assetManifest.characters.chacha} alt="Chacha Choudhary" className="hero-portrait" />
        <img src={assetManifest.characters.sabu} alt="Sabu" className="hero-portrait" />
        <DialogueBubble speaker="Chacha">Namaste! Ready for a brain adventure?</DialogueBubble>
        <DialogueBubble speaker="Sabu" tone="excited">
          Chacha ka dimaag, Sabu ki taakat! Tap start and we roll.
        </DialogueBubble>
        <ActionButton onClick={startInvestigation} data-testid="start-game">
          Start Game
        </ActionButton>
      </div>
    </ComicPanel>
  );
};
