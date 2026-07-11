import { test, expect, Page, Locator } from '@playwright/test';

const BASE_URL = 'https://playwright.dev/';

const THEMES = ['light', 'dark'] as const;

const THEME_BUTTON_NAME = 'Switch between dark and light';

interface Elements {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

const elements: Elements[] = [
  {
    locator: (page: Page): Locator =>
      page.getByRole('link', { name: 'Playwright logo Playwright' }),
    name: 'Playwright logo',
    text: 'Playwright',
    attribute: { type: 'href', value: '/' },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
    name: 'Docs',
    text: 'Docs',
    attribute: { type: 'href', value: '/docs/intro' },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'MCP', exact: true }),
    name: 'MCP',
    text: 'MCP',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'CLI', exact: true }),
    name: 'CLI',
    text: 'CLI',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'API' }),
    name: 'API',
    text: 'API',
    attribute: { type: 'href', value: '/docs/api/class-playwright' },
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
    name: 'Node.js',
    text: 'Node.js',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
    name: 'GitHub repository',
    attribute: { type: 'href', value: 'https://github.com/microsoft/playwright' },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
    name: 'Discord server',
    attribute: { type: 'href', value: 'https://aka.ms/playwright/discord' },
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: THEME_BUTTON_NAME }),
    name: 'Theme Switch',
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Meta+k)' }),
    name: 'Search',
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('heading', { name: 'Playwright enables reliable' }),
    name: 'Page Heading',
    text: 'Playwright enables reliable web automation for testing, scripting, and AI agents.',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Get started' }),
    name: 'Get Started Button',
    text: 'Get started',
    attribute: { type: 'href', value: '/docs/intro' },
  },
];

// ---------------- Helpers ----------------

const themeButton = (page: Page) => page.getByRole('button', { name: THEME_BUTTON_NAME });

const getCurrentTheme = async (page: Page): Promise<string | null> =>
  page.locator('html').getAttribute('data-theme');

/**
 * Switches the site to the given theme via a real click on the
 * toggle button, retrying the click if it doesn't take.
 *
 * Two things previously made this flaky:
 *
 * 1. Mixing `page.emulateMedia({ colorScheme })` with a manual click.
 *    If the app also listens to prefers-color-scheme, emulateMedia
 *    can flip the theme on its own, racing with our click and
 *    landing in a different final state depending on timing/cache/
 *    network speed between runs. Fix: only the click drives the
 *    theme now — a single source of truth.
 *
 * 2. The button's click handler is only wired up after React
 *    hydrates. A click fired too early (before hydration finishes)
 *    can land on the button without actually toggling anything.
 *    Fix: `expect(...).toPass()` retries the click + check as a
 *    unit until it succeeds, instead of guessing a fixed
 *    `waitForTimeout` delay.
 */
const ensureTheme = async (page: Page, theme: (typeof THEMES)[number]) => {
  if ((await getCurrentTheme(page)) === theme) return;

  await expect(async () => {
    await themeButton(page).click();
    expect(await getCurrentTheme(page)).toBe(theme);
  }).toPass({ timeout: 10_000 });
};

// ---------------- Tests ----------------

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Verify elements are visible', async ({ page }) => {
    for (const { name, locator } of elements) {
      await test.step(`Verify "${name}" is visible`, async () => {
        await expect.soft(locator(page)).toBeVisible();
      });
    }
  });

  test('Verify element text', async ({ page }) => {
    for (const { name, text, locator } of elements) {
      if (!text) continue;
      await test.step(`Verify "${name}" text`, async () => {
        await expect.soft(locator(page)).toContainText(text);
      });
    }
  });

  test('Verify element attributes', async ({ page }) => {
    for (const { name, attribute, locator } of elements) {
      if (!attribute) continue;
      await test.step(`Verify "${name}" attribute`, async () => {
        await expect.soft(locator(page)).toHaveAttribute(attribute.type, attribute.value);
      });
    }
  });

  test('Verify light theme switch', async ({ page }) => {
    await ensureTheme(page, 'light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

// ---------------- Visual Regression Tests ----------------

test.describe('Theme visual regression tests', () => {
  THEMES.forEach((theme) => {
    test(`Checking ${theme} mode styles`, async ({ page }) => {
      await page.goto(BASE_URL);

      await ensureTheme(page, theme);

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      await expect(page).toHaveScreenshot(`${theme}-mode.png`, {
        animations: 'disabled',
        maxDiffPixels: 100,
      });
    });
  });
});
