import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clues, suspects } from '../config/gameData';
import type { Clue, SceneId, SolveResult, Suspect } from '../types/game';

type MatchedClues = Record<Clue['id'], Suspect['id'] | null>;

interface GameState {
  scene: SceneId;
  selectedSuspectId?: Suspect['id'];
  matchedClues: MatchedClues;
  attempts: number;
  usedHint: boolean;
  score: number;
  badges: string[];
  lastSolveResult?: SolveResult;
  startInvestigation: () => void;
  openScene: (scene: SceneId) => void;
  setSuspect: (suspectId: Suspect['id']) => void;
  toggleClue: (clueId: Clue['id'], suspectId: Suspect['id'] | null) => void;
  markHintUsed: () => void;
  solve: () => SolveResult;
  resetRound: () => void;
}

const defaultMatchedClues = (): MatchedClues =>
  clues.reduce<MatchedClues>((acc, clue) => ({ ...acc, [clue.id]: null }), {} as MatchedClues);

const BRAIN_POWER_KEY = 'missing-mangoes-brain-power';
const BADGE_KEY = 'missing-mangoes-badges';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      scene: 'welcome',
      selectedSuspectId: undefined,
      matchedClues: defaultMatchedClues(),
      attempts: 0,
      usedHint: false,
      score: 0,
      badges: [],
      lastSolveResult: undefined,
      startInvestigation: () => {
        set({ scene: 'intro' });
      },
      openScene: (scene) => set({ scene }),
      setSuspect: (suspectId) => set({ selectedSuspectId: suspectId }),
      toggleClue: (clueId, suspectId) =>
        set((state) => ({
          matchedClues: {
            ...state.matchedClues,
            [clueId]: suspectId
          }
        })),
      markHintUsed: () => set({ usedHint: true }),
      solve: () => {
        const state = get();
        const culprit = suspects.find((suspect) => suspect.isCulprit);
        const culpritId = culprit?.id ?? 'gudiya';
        const correct = state.selectedSuspectId === culpritId;

        const shouldBoost = correct && state.attempts === 0 && !state.usedHint;
        const nextScore = shouldBoost ? state.score + 1 : state.score;
        const badges = new Set(state.badges);

        if (shouldBoost) {
          badges.add('Brain Power +1');
        }
        if (correct && state.usedHint === false && state.attempts === 0) {
          badges.add('Quick Thinker');
        }

        const result: SolveResult = { correct, culpritId };

        set({
          scene: 'solution',
          score: nextScore,
          badges: Array.from(badges),
          attempts: state.attempts + 1,
          lastSolveResult: result
        });

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(BRAIN_POWER_KEY, JSON.stringify(nextScore));
          window.localStorage.setItem(BADGE_KEY, JSON.stringify(Array.from(badges)));
        }
        return result;
      },
      resetRound: () =>
        set({
          scene: 'welcome',
          selectedSuspectId: undefined,
          matchedClues: defaultMatchedClues(),
          attempts: 0,
          usedHint: false,
          lastSolveResult: undefined
        })
    }),
    {
      name: 'missing-mangoes-store',
      partialize: (state) => ({
        score: state.score,
        badges: state.badges
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const storedScore =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(BRAIN_POWER_KEY)
            : null;
        const storedBadges =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(BADGE_KEY)
            : null;
        state.score = storedScore ? JSON.parse(storedScore) : state.score;
        state.badges = storedBadges ? JSON.parse(storedBadges) : state.badges;
      }
    }
  )
);
