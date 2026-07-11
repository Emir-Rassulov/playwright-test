import { Page, Locator, expect, test } from '@playwright/test';
import { ElementConfig, Theme } from '../models/Elements';

export class MainPage {
  private static readonly BASE_URL = 'https://playwright.dev/';
  private static readonly THEME_BUTTON_NAME = 'Switch between dark and light';

  readonly page: Page;
  readonly themeButton: Locator;
  readonly elements: ElementConfig[];

  constructor(page: Page) {
    this.page = page;
    this.themeButton = page.getByRole('button', { name: MainPage.THEME_BUTTON_NAME });
    this.elements = this.buildElements();
  }

  private buildElements(): ElementConfig[] {
    return [...this.buildNavElements(), ...this.buildHeroElements()];
  }

  private buildNavElements(): ElementConfig[] {
    return [
      {
        name: 'Playwright logo',
        locator: (page) => page.getByRole('link', { name: 'Playwright logo Playwright' }),
        text: 'Playwright',
        attribute: { type: 'href', value: '/' },
      },
      {
        name: 'Docs',
        locator: (page) => page.getByRole('link', { name: 'Docs' }),
        text: 'Docs',
        attribute: { type: 'href', value: '/docs/intro' },
      },
      {
        name: 'MCP',
        locator: (page) => page.getByRole('link', { name: 'MCP', exact: true }),
        text: 'MCP',
      },
      {
        name: 'CLI',
        locator: (page) => page.getByRole('link', { name: 'CLI', exact: true }),
        text: 'CLI',
      },
      {
        name: 'API',
        locator: (page) => page.getByRole('link', { name: 'API' }),
        text: 'API',
        attribute: { type: 'href', value: '/docs/api/class-playwright' },
      },
      {
        name: 'Node.js',
        locator: (page) => page.getByRole('button', { name: 'Node.js' }),
        text: 'Node.js',
      },
      {
        name: 'GitHub repository',
        locator: (page) => page.getByRole('link', { name: 'GitHub repository' }),
        attribute: { type: 'href', value: 'https://github.com/microsoft/playwright' },
      },
      {
        name: 'Discord server',
        locator: (page) => page.getByRole('link', { name: 'Discord server' }),
        attribute: { type: 'href', value: 'https://aka.ms/playwright/discord' },
      },
      {
        name: 'Theme Switch',
        locator: (page) => page.getByRole('button', { name: MainPage.THEME_BUTTON_NAME }),
      },
      {
        name: 'Search',
        locator: (page) => page.getByRole('button', { name: 'Search (Meta+k)' }),
      },
    ];
  }

  private buildHeroElements(): ElementConfig[] {
    return [
      {
        name: 'Page Heading',
        locator: (page) => page.getByRole('heading', { name: 'Playwright enables reliable' }),
        text: 'Playwright enables reliable web automation for testing, scripting, and AI agents.',
      },
      {
        name: 'Get Started Button',
        locator: (page) => page.getByRole('link', { name: 'Get started' }),
        text: 'Get started',
        attribute: { type: 'href', value: '/docs/intro' },
      },
    ];
  }

  async openMainPage(): Promise<void> {
    await this.page.goto(MainPage.BASE_URL);
  }

  /** Verifies that all navbar/hero elements are visible. */
  async checkElementsVisibility(): Promise<void> {
    for (const { locator, name } of this.elements) {
      await test.step(`Verify "${name}" is visible`, async () => {
        await expect.soft(locator(this.page)).toBeVisible();
      });
    }
  }

  /** Verifies text for elements that have it defined. */
  async checkElementsText(): Promise<void> {
    for (const { locator, name, text } of this.elements) {
      if (!text) continue;

      await test.step(`Verify "${name}" text`, async () => {
        await expect.soft(locator(this.page)).toContainText(text);
      });
    }
  }

  /** Verifies attributes for elements that have them defined. */
  async checkElementsAttributes(): Promise<void> {
    for (const { locator, name, attribute } of this.elements) {
      if (!attribute) continue;

      await test.step(`Verify "${name}" attribute`, async () => {
        await expect.soft(locator(this.page)).toHaveAttribute(attribute.type, attribute.value);
      });
    }
  }

  async getCurrentTheme(): Promise<string | null> {
    return this.page.locator('html').getAttribute('data-theme');
  }

  private async setTheme(theme: Theme): Promise<void> {
    if ((await this.getCurrentTheme()) === theme) return;

    await expect(async () => {
      await this.themeButton.click();
      expect(await this.getCurrentTheme()).toBe(theme);
    }).toPass({ timeout: 10_000 });
  }

  /** Switches the theme and verifies the data-theme attribute was applied. */
  async checkTheme(theme: Theme): Promise<void> {
    await test.step(`Verify switching to "${theme}" theme`, async () => {
      await this.setTheme(theme);
      await expect(this.page.locator('html')).toHaveAttribute('data-theme', theme);
    });
  }

  /** Takes and compares a visual snapshot of the page in the given theme. */
  async checkVisualSnapshot(theme: Theme): Promise<void> {
    await test.step(`Verify visual snapshot in "${theme}" theme`, async () => {
      await expect(this.page).toHaveScreenshot(`${theme}-mode.png`, {
        animations: 'disabled',
        maxDiffPixels: 100,
      });
    });
  }
}
