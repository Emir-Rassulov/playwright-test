import { test, expect, Page, Locator } from '@playwright/test';

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
    attribute: {
      type: 'href',
      value: '/',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
    name: 'Docs',
    text: 'Docs',
    attribute: {
      type: 'href',
      value: '/docs/intro',
    },
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
    attribute: {
      type: 'href',
      value: '/docs/api/class-playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
    name: 'Node.js',
    text: 'Node.js',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
    name: 'GitHub repository',
    attribute: {
      type: 'href',
      value: 'https://github.com/microsoft/playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
    name: 'Discord server',
    attribute: {
      type: 'href',
      value: 'https://aka.ms/playwright/discord',
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('button', { name: 'Switch between dark and light' }),
    name: 'Switch between dark and light',
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Meta+k)' }),
    name: 'Search',
  },
];

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('Verify navigation elements are displayed', async ({ page }) => {
    for (const { name, locator } of elements) {
      await test.step(`Verify "${name}" is visible`, async () => {
        await expect.soft(locator(page)).toBeVisible();
      });
    }
  });

  test('Verify navigation element text', async ({ page }) => {
    for (const { name, text, locator } of elements) {
      if (!text) continue;

      await test.step(`Verify "${name}" text`, async () => {
        await expect.soft(locator(page)).toContainText(text);
      });
    }
  });

  test('Verify navigation element attributes', async ({ page }) => {
    for (const { name, attribute, locator } of elements) {
      if (!attribute) continue;

      await test.step(`Verify "${name}" attribute`, async () => {
        await expect.soft(locator(page)).toHaveAttribute(attribute.type, attribute.value);
      });
    }
  });

  test('Verify light theme switch', async ({ page }) => {
    await page.getByLabel('Switch between dark and light').click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('Verify page heading', async ({ page }) => {
    const heading: Locator = page.getByRole('heading', {
      name: 'Playwright enables reliable',
    });

    await expect(heading).toBeVisible();

    await expect(heading).toContainText(
      'Playwright enables reliable web automation for testing, scripting, and AI agents.',
    );
  });

  test('Verify Get Started button', async ({ page }) => {
    const getStarted: Locator = page.getByRole('link', {
      name: 'Get started',
    });

    await expect.soft(getStarted).toBeVisible();

    await expect.soft(getStarted).toContainText('Get started');

    await expect.soft(getStarted).toHaveAttribute('href', '/docs/intro');
  });
});
