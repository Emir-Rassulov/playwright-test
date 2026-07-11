import { test as base } from '@playwright/test';
import { MainPage } from '../models/MainPage';

type MyFixtures = {
  mainPage: MainPage;
};

// Extend base test by providing "mainPage".
// This new "test" can be used in multiple test files, and each of them will get the fixture.
export const test = base.extend<MyFixtures>({
  mainPage: async ({ page }, use) => {
    // Set up the fixture.
    const mainPage = new MainPage(page);
    await mainPage.openMainPage();

    // Use the fixture value in the test.
    await use(mainPage);

    // Clean up the fixture (nothing to clean up for this page object).
  },
});

export { expect } from '@playwright/test';
