import { assetManifest } from '../config/assets';
import { ActionButton } from '../components/ui/ActionButton';
import { DialogueBubble } from '../components/ui/DialogueBubble';
import { ComicPanel } from '../components/layout/ComicPanel';
import { useGameStore } from '../state/gameStore';

export const IntroScene = () => {
  const openScene = useGameStore((state) => state.openScene);

  return (
    <ComicPanel
      backgroundImage={assetManifest.scenes.garden}
      headline="The Mystery Begins"
      subline="Bini Chachi needs your sharp mind."
    >
      <div className="scene-grid scene-grid--intro">
        <img src={assetManifest.characters.bini} alt="Bini Chachi" className="hero-portrait" />
        <img src={assetManifest.characters.chacha} alt="Chacha Choudhary" className="hero-portrait" />
        <img src={assetManifest.characters.sabu} alt="Sabu enjoying paratha" className="hero-portrait" />
        <DialogueBubble speaker="Bini Chachi" tone="warning">
          Oh Chacha! My mangoes are gone. Help!
        </DialogueBubble>
        <DialogueBubble speaker="Chacha">
          Time to solve a fruity puzzle.
        </DialogueBubble>
        <DialogueBubble speaker="Sabu" tone="hint">
          Paratha tastes better with a mystery!
        </DialogueBubble>
        <ActionButton onClick={() => openScene('investigation')}>Start Investigation</ActionButton>
      </div>
    </ComicPanel>
  );
};
