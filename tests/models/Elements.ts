import { Page, Locator } from '@playwright/test';

export type Theme = 'light' | 'dark';

export interface ElementConfig {
  name: string;
  locator: (page: Page) => Locator;
  /** Expected visible text, checked with toContainText. */
  text?: string;
  /** Expected attribute, checked with toHaveAttribute. */
  attribute?: {
    type: string;
    value: string;
  };
}
