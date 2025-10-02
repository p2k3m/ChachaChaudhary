import { AssetManifest } from '../types/game';
import { invariant } from '../utils/invariant';

const baseUrl = import.meta.env.VITE_ASSET_BASE_URL as string | undefined;

invariant(
  Boolean(baseUrl),
  'Missing VITE_ASSET_BASE_URL. Upload the generated assets to S3 and expose the public base URL via the Vite environment file.'
);

export const assetManifest: AssetManifest = {
  characters: {
    chacha: `${baseUrl}/characters/chacha.png`,
    sabu: `${baseUrl}/characters/sabu.png`,
    bini: `${baseUrl}/characters/bini.png`,
    cheenu: `${baseUrl}/characters/cheenu.png`,
    raju: `${baseUrl}/characters/raju.png`,
    pandu: `${baseUrl}/characters/pandu.png`,
    gudiya: `${baseUrl}/characters/gudiya.png`
  },
  scenes: {
    welcome: `${baseUrl}/scenes/welcome.jpg`,
    garden: `${baseUrl}/scenes/garden.jpg`,
    deduction: `${baseUrl}/scenes/deduction.jpg`,
    celebration: `${baseUrl}/scenes/celebration.jpg`
  },
  ui: {
    footprint: `${baseUrl}/ui/footprint.png`,
    mangoBowl: `${baseUrl}/ui/mango-bowl.png`,
    ladder: `${baseUrl}/ui/ladder.png`,
    badgeBrain: `${baseUrl}/ui/badge-brain.png`,
    badgeChoice: `${baseUrl}/ui/badge-choice.png`
  }
};
