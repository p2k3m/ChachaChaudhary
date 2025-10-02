export type SceneId =
  | 'welcome'
  | 'intro'
  | 'investigation'
  | 'deduction'
  | 'solution'
  | 'score';

export interface Suspect {
  id: 'cheenu' | 'raju' | 'pandu' | 'gudiya';
  name: string;
  description: string;
  avatarKey: string;
  statement: string;
  isCulprit: boolean;
}

export interface Clue {
  id: 'footprints' | 'peels' | 'ladder';
  label: string;
  description: string;
  iconKey: string;
  matchesSuspect: 'gudiya' | null;
}

export interface SceneContent {
  id: SceneId;
  title: string;
  headline: string;
  description: string;
}

export interface SolveResult {
  correct: boolean;
  culpritId: Suspect['id'];
}

export interface AssetManifest {
  characters: Record<string, string>;
  scenes: Record<string, string>;
  ui: Record<string, string>;
}
