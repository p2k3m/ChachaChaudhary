import { scenes } from '../../config/gameData';
import type { SceneId } from '../../types/game';

interface ProgressTrackerProps {
  activeScene: SceneId;
}

export const ProgressTracker = ({ activeScene }: ProgressTrackerProps) => (
  <ol className="progress-tracker">
    {scenes.map((scene, index) => {
      const position = index + 1;
      const isActive = scene.id === activeScene;
      return (
        <li key={scene.id} className={`progress-tracker__step ${isActive ? 'is-active' : ''}`}>
          <span className="progress-tracker__index">{position}</span>
          <span className="progress-tracker__label">{scene.title}</span>
        </li>
      );
    })}
  </ol>
);
