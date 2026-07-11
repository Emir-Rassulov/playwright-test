import { test } from '../fixtures/fixtures';
import { Theme } from '../models/Elements';

const THEMES: Theme[] = ['light', 'dark'];

test.describe('Home Page Tests', () => {
  test('Verify header navigation elements are visible', async ({ mainPage }) => {
    await mainPage.checkElementsVisibility();
  });

  test('Verify header navigation elements text', async ({ mainPage }) => {
    await mainPage.checkElementsText();
  });

  test('Verify header navigation elements attributes', async ({ mainPage }) => {
    await mainPage.checkElementsAttributes();
  });

  THEMES.forEach((theme) => {
    test(`Verify switching to "${theme}" theme`, async ({ mainPage }) => {
      await mainPage.checkTheme(theme);
    });
  });
});

// ---------------- Visual Regression Tests ----------------

test.describe('Theme visual regression tests', () => {
  THEMES.forEach((theme) => {
    test(`Verify visual regression in "${theme}" theme`, async ({ mainPage }) => {
      await mainPage.checkTheme(theme);
      await mainPage.checkVisualSnapshot(theme);
    });
  });
});
