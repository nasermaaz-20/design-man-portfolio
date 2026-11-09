import { test, expect } from '@playwright/test';

async function ready(page, path = '/') {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#intro-screen')).toBeHidden();
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
}

test('cold opening finishes, remembers the session, and renders the correct hero asset', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await ready(page);
  await expect(page.locator('h1')).toContainText('stand out.');
  await expect.poll(() => page.locator('[data-hero-image]').evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  const src = await page.locator('[data-hero-image]').evaluate((image) => image.currentSrc);
  expect(src.includes('hero-bg-mo')).toBe(testInfo.project.name === 'mobile');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('design-man:intro:v1'))).toBe('seen');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#intro-screen')).toBeHidden();
  await expect.poll(() => page.locator('.hero-line').last().evaluate((el) => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
  await page.screenshot({ path: testInfo.outputPath('hero.png') });
  expect(errors).toEqual([]);
});

test('skip works while hero and fonts are unavailable', async ({ page }) => {
  await page.route(/hero-bg.*\.jpg/, () => {});
  await page.route('**/fonts.googleapis.com/**', (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('#intro-screen')).toBeHidden();
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('timeout releases the page even when a hero request never settles', async ({ page }) => {
  await page.route(/hero-bg.*\.jpg/, () => {});
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#intro-screen')).toBeHidden({ timeout: 4500 });
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
  expect(await page.evaluate(() => window.__designIntro.reason)).toBe('timeout');
});

test('deep links and live reduced-motion changes keep content usable', async ({ page }) => {
  await ready(page, '/#process');
  await expect(page.locator('#intro-screen')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('#process [data-reveal]').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.locator('.custom-cursor')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#contact h2').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.locator('#contact')).toHaveCount(1);
});

test('project dialog traps focus, survives repeated use, and returns to the selected card', async ({ page }) => {
  await ready(page, '/#work');
  const trigger = page.getByRole('button', { name: 'View TrapNet project' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'TrapNet' });
  await expect(dialog).toBeVisible();
  const close = page.getByRole('button', { name: 'Close project details' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('.project-image-bridge')).toHaveCount(0);
  await trigger.click();
  await close.click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#site-content')).not.toHaveAttribute('inert');
});

test('scroll reveals every section without overflow and updates the process rail', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await ready(page, '/#work');
  const stats = page.locator('section').filter({ hasText: 'Happy Clients' });
  const counter = stats.locator('[aria-hidden="true"]').first();
  await expect(counter).toHaveText('50+');
  await page.locator('#work h2').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#work [data-reveal]').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await page.locator('.project-image-shell').first().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.project-image-shell').first().evaluate((el) => {
    const clip = getComputedStyle(el).clipPath;
    return clip === 'none' || (clip.match(/[\d.]+/g) || []).every((value) => Number(value) === 0);
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('work.png') });
  for (const id of ['about', 'services', 'process', 'contact']) {
    const section = page.locator(`#${id}`);
    const target = section.locator('[data-reveal]:not([data-reveal="line"]):not([data-reveal="image"])').first();
    await target.scrollIntoViewIfNeeded();
    await expect.poll(() => target.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.locator('#process [data-reveal]').first().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#process [data-reveal]').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect.poll(async () => Number(await page.locator('.process-grid').evaluate((el) => getComputedStyle(el).getPropertyValue('--process-progress')))).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath('process.png') });
  await stats.scrollIntoViewIfNeeded();
  await expect(counter).toHaveText('50+');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect.poll(() => page.locator('.page-progress').evaluate((el) => getComputedStyle(el).transform)).toMatch(/matrix\(1, 0, 0, 1, 0, 0\)/);
  expect(errors).toEqual([]);
});

test('mobile navigation supports escape and anchor selection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await ready(page);
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Contact' }).click();
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect.poll(() => page.locator('#contact').evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(200);
});
