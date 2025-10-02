import { Clue, SceneContent, Suspect } from '../types/game';

export const suspects: Suspect[] = [
  {
    id: 'cheenu',
    name: 'Cheenu the Milkman',
    description: 'Cheery milkman with an early morning routine.',
    avatarKey: 'cheenu',
    statement: 'I came for milk delivery early morning, mangoes were already missing.',
    isCulprit: false
  },
  {
    id: 'raju',
    name: 'Raju the Kid',
    description: 'Mischievous neighbour kid who loves adventures.',
    avatarKey: 'raju',
    statement: 'My dog, Gudiya, was out all night.',
    isCulprit: false
  },
  {
    id: 'pandu',
    name: 'Pandu the Fruit Seller',
    description: 'Honest vendor who respects Chacha Choudhary.',
    avatarKey: 'pandu',
    statement: "I like mangoes, but I wasn't here at night.",
    isCulprit: false
  },
  {
    id: 'gudiya',
    name: 'Gudiya the Dog',
    description: 'Raju’s playful dog with a mango obsession.',
    avatarKey: 'gudiya',
    statement: 'Woof! (dreaming of mangoes...)',
    isCulprit: true
  }
];

export const clues: Clue[] = [
  {
    id: 'footprints',
    label: 'Tiny Footprints',
    description: 'Small paw-like prints circling the mango tree.',
    iconKey: 'footprint',
    matchesSuspect: 'gudiya'
  },
  {
    id: 'peels',
    label: 'Mango Peel Bowl',
    description: 'A bowl filled with mango peels hidden behind a bush.',
    iconKey: 'mangoBowl',
    matchesSuspect: 'gudiya'
  },
  {
    id: 'ladder',
    label: 'Heavy Ladder',
    description: 'A tall ladder that only Sabu could probably lift.',
    iconKey: 'ladder',
    matchesSuspect: null
  }
];

export const scenes: SceneContent[] = [
  {
    id: 'welcome',
    title: 'Welcome & Intro',
    headline: 'Namaste! Ready for a brain adventure?',
    description: 'Chacha Choudhary and Sabu greet you with comic flair.'
  },
  {
    id: 'intro',
    title: 'The Mystery Begins',
    headline: 'Bini Chachi’s mangoes are missing!',
    description: 'Help Chacha and Sabu crack the fruity case.'
  },
  {
    id: 'investigation',
    title: 'The Investigation',
    headline: 'Tap each suspect and inspect the garden for clues.',
    description: 'Collect statements and evidence to solve the puzzle.'
  },
  {
    id: 'deduction',
    title: 'Deduction Puzzle',
    headline: 'Match the right clues with the sneakiest suspect.',
    description: 'Drag clues and suspects into the suspect box to decide.'
  },
  {
    id: 'solution',
    title: 'Solution Time',
    headline: 'Was your deduction correct?',
    description: 'Chacha delivers the verdict with Sabu cheering on.'
  },
  {
    id: 'score',
    title: 'Brain Power Boost',
    headline: 'Celebrate your win and prep for the next episode!',
    description: 'Collect badges, share, and peek at the upcoming teaser.'
  }
];
