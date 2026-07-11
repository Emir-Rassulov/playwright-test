import { test } from '@playwright/test';
import { MainPage } from '../models/MainPage';
import { Theme } from '../models/Elements';

const THEMES: Theme[] = ['light', 'dark'];

test.describe('Home Page Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.openMainPage();
  });

  test('Verify header navigation elements are visible', async () => {
    await mainPage.checkElementsVisibility();
  });

  test('Verify header navigation elements text', async () => {
    await mainPage.checkElementsText();
  });

  test('Verify header navigation elements attributes', async () => {
    await mainPage.checkElementsAttributes();
  });

  THEMES.forEach((theme) => {
    test(`Verify switching to "${theme}" theme`, async () => {
      await mainPage.checkTheme(theme);
    });
  });
});

// ---------------- Visual Regression Tests ----------------

test.describe('Theme visual regression tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.openMainPage();
  });

  THEMES.forEach((theme) => {
    test(`Verify visual regression in "${theme}" theme`, async () => {
      await mainPage.checkTheme(theme);
      await mainPage.checkVisualSnapshot(theme);
    });
  });
});
