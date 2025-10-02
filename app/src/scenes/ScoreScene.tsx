import { assetManifest } from '../config/assets';
import { ActionButton } from '../components/ui/ActionButton';
import { Badge } from '../components/ui/Badge';
import { ComicPanel } from '../components/layout/ComicPanel';
import { useGameStore } from '../state/gameStore';

export const ScoreScene = () => {
  const { score, badges, resetRound } = useGameStore((state) => ({
    score: state.score,
    badges: state.badges,
    resetRound: state.resetRound
  }));

  return (
    <ComicPanel
      backgroundImage={assetManifest.scenes.celebration}
      headline="Brain Power Boost!"
      subline="Episode 1 complete—keep the streak alive."
    >
      <div className="score-grid">
        <section className="score-grid__panel">
          <h2>Brain Power</h2>
          <Badge icon={assetManifest.ui.badgeBrain} label={`+${score}`} highlight />
        </section>
        <section className="score-grid__panel">
          <h2>Your Badges</h2>
          <div className="score-grid__badges">
            {badges.length ? (
              badges.map((badge) => <Badge key={badge} label={badge} />)
            ) : (
              <p>Crack the case faster to unlock special titles.</p>
            )}
          </div>
        </section>
        <section className="score-grid__panel">
          <h2>Share & Replay</h2>
          <p>Brag about your detective skills with friends.</p>
          <div className="score-grid__actions">
            <ActionButton variant="secondary" onClick={() => alert('Share coming soon!')}>
              Share Comic Badge
            </ActionButton>
            <ActionButton onClick={resetRound}>Play Again</ActionButton>
          </div>
        </section>
        <section className="score-grid__panel">
          <h2>Next Episode</h2>
          <p>New mystery awaits! Unlock soon.</p>
          <Badge icon={assetManifest.ui.badgeChoice} label="Chacha’s Choice" />
        </section>
      </div>
    </ComicPanel>
  );
};
