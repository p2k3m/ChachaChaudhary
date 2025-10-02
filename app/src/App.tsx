import { type ReactElement, useMemo } from 'react';
import { ProgressTracker } from './components/ui/ProgressTracker';
import { useGameStore } from './state/gameStore';
import type { SceneId } from './types/game';
import { DeductionScene } from './scenes/DeductionScene';
import { InvestigationScene } from './scenes/InvestigationScene';
import { IntroScene } from './scenes/IntroScene';
import { ScoreScene } from './scenes/ScoreScene';
import { SolutionScene } from './scenes/SolutionScene';
import { WelcomeScene } from './scenes/WelcomeScene';

const sceneComponents: Record<SceneId, ReactElement> = {
  welcome: <WelcomeScene />,
  intro: <IntroScene />,
  investigation: <InvestigationScene />,
  deduction: <DeductionScene />,
  solution: <SolutionScene />,
  score: <ScoreScene />
};

const App = () => {
  const activeScene = useGameStore((state) => state.scene);

  const activePanel = useMemo(() => sceneComponents[activeScene], [activeScene]);

  return (
    <div className="app-shell">
      <ProgressTracker activeScene={activeScene} />
      <main className="app-shell__main" aria-live="polite">
        {activePanel}
      </main>
      <footer className="app-shell__footer">
        <p>Episode teaser: New mystery awaits!</p>
      </footer>
    </div>
  );
};

export default App;
