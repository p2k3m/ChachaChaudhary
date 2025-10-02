import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./config/assets', () => ({
  assetManifest: {
    characters: {
      chacha: 'chacha.png',
      sabu: 'sabu.png',
      bini: 'bini.png',
      cheenu: 'cheenu.png',
      raju: 'raju.png',
      pandu: 'pandu.png',
      gudiya: 'gudiya.png'
    },
    scenes: {
      welcome: 'welcome.png',
      garden: 'garden.png',
      deduction: 'deduction.png',
      celebration: 'celebration.png'
    },
    ui: {
      footprint: 'footprint.png',
      mangoBowl: 'bowl.png',
      ladder: 'ladder.png',
      badgeBrain: 'brain.png',
      badgeChoice: 'choice.png'
    }
  }
}));

vi.mock('./config/environment', () => ({
  environment: {
    hintApiBase: 'https://example.com'
  }
}));

// Polyfill fetch for the hint hook tests.
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ hint: 'Test hint', source: 'llm' })
  })
));

// LocalStorage polyfill for zustand persist.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('App', () => {
  it('renders welcome scene heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /Ready for a brain adventure/i })).toBeInTheDocument();
  });
});
