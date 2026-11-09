import { test, expect } from '@playwright/test';

async function openViewer(page, suffix = '') {
  const response = await page.goto(`/portfolio/${suffix}`, { waitUntil: 'domcontentloaded' });
  expect(response.status()).toBe(200);
  await expect(page.locator('.pdf-paper[data-status="ready"]').first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeEnabled();
}

test('home features the portfolio after selected work without downloading the document or engine', async ({ page }, testInfo) => {
  const heavyRequests = [];
  page.on('request', (request) => {
    if (/\.pdf(?:\?|$)|pdf\.worker|\/pdf-[^/]+\.js/.test(request.url())) heavyRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#portfolio');
  await expect(page.locator('#intro-screen')).toBeHidden();
  await page.locator('#portfolio').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'The full picture.' })).toBeVisible();
  expect(await page.locator('#portfolio').evaluate((element) => element.previousElementSibling.id)).toBe('work');
  expect(await page.locator('#portfolio').evaluate((element) => element.nextElementSibling.id)).toBe('about');
  expect(await page.locator('.portfolio-cover img').evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator('#portfolio')).toContainText('31 pages');
  await expect(page.locator('#portfolio')).toContainText('6.9 MB');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('portfolio-feature.png') });
  expect(heavyRequests).toEqual([]);
  await page.getByRole('link', { name: 'View Portfolio', exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\//);
  await expect(page.locator('.pdf-paper[data-status="ready"]').first()).toBeVisible({ timeout: 15000 });
});

test('viewer supports direct loading, page navigation, zoom and returning to the work', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openViewer(page);
  await expect(page.locator('#intro-screen')).toHaveCount(0);
  await expect(page.locator('#page-number')).toHaveValue('1');
  await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeDisabled();
  await page.screenshot({ path: testInfo.outputPath('portfolio-viewer.png') });
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page.locator('#page-number')).toHaveValue('2');
  await expect(page.locator('[data-page]')).toHaveCount(1);
  await page.locator('#page-number').fill('19');
  await page.locator('#page-number').press('Enter');
  await page.locator('.viewer-stage').focus();
  await expect(page.locator('#pdf-page-19 .pdf-paper')).toHaveAttribute('data-status', 'ready');
  const originalWidth = await page.locator('#pdf-page-19').evaluate((element) => element.clientWidth);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.getByLabel('Zoom level')).toHaveText('125%');
  await expect.poll(() => page.locator('#pdf-page-19').evaluate((element) => element.clientWidth)).toBeGreaterThan(originalWidth);
  await page.getByRole('button', { name: 'Fit page', exact: true }).click();
  await expect(page.getByLabel('Zoom level')).toHaveText('100%');
  expect(await page.locator('.viewer-stage').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.locator('#page-number').fill('31');
  await page.locator('#page-number').press('Enter');
  await expect(page.locator('#pdf-page-31 .pdf-paper')).toHaveAttribute('data-status', 'ready');
  await expect(page.locator('#page-number')).toHaveValue('31');
  await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeDisabled();
  await expect(page.locator('#pdf-page-31 .textLayer')).toContainText('Yaman Balkesh');
  await expect(page.locator('#pdf-page-31 .pdf-links a')).toHaveCount(4);
  if (testInfo.project.name === 'desktop') {
    await page.locator('.viewer-stage').focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#page-number')).toHaveValue('30');
    await page.keyboard.press('Home');
    await expect(page.locator('#page-number')).toHaveValue('1');
    await page.getByRole('button', { name: 'Enter fullscreen' }).click();
    await expect(page.getByRole('button', { name: 'Exit fullscreen' })).toBeVisible();
    await page.getByRole('button', { name: 'Exit fullscreen' }).click();
  }
  await page.getByRole('link', { name: 'Back to work' }).click();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(page.locator('#intro-screen')).toBeHidden();
  expect(errors).toEqual([]);
});

test('deep page links survive refresh and remain usable at a narrow width', async ({ page }) => {
  await openViewer(page, '#page=24');
  await expect(page.locator('#pdf-page-24 .pdf-paper')).toHaveAttribute('data-status', 'ready');
  await expect(page.locator('#page-number')).toHaveValue('24');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#pdf-page-24 .pdf-paper')).toHaveAttribute('data-status', 'ready', { timeout: 15000 });
  await page.setViewportSize({ width: 320, height: 700 });
  await expect(page.locator('[data-page]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.viewer-toolbar').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('the entire page fits the screen until zoomed, including after resize and reset', async ({ page }, testInfo) => {
  await openViewer(page, '#page=16');
  const fits = () => page.locator('.viewer-stage').evaluate((stage) => {
    const paper = stage.querySelector('.pdf-paper').getBoundingClientRect();
    const bounds = stage.getBoundingClientRect();
    return stage.scrollHeight <= stage.clientHeight && stage.scrollWidth <= stage.clientWidth
      && paper.top >= bounds.top && paper.bottom <= bounds.bottom + 1
      && paper.left >= bounds.left && paper.right <= bounds.right + 1;
  });
  await expect.poll(fits).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('portfolio-fit-page.png') });
  for (const viewport of [{ width: 1920, height: 970 }, { width: 1366, height: 768 }, { width: 844, height: 390 }, { width: 320, height: 700 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(fits).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  }
  for (let index = 0; index < 6; index++) await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect.poll(() => page.locator('.viewer-stage').evaluate((stage) => stage.scrollWidth > stage.clientWidth || stage.scrollHeight > stage.clientHeight)).toBe(true);
  await page.locator('.viewer-stage').evaluate((stage) => stage.scrollTo({ left: 120, top: 120 }));
  await expect.poll(() => page.locator('.viewer-stage').evaluate((stage) => stage.scrollLeft + stage.scrollTop)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Fit page', exact: true }).click();
  await expect.poll(fits).toBe(true);
  await expect.poll(() => page.locator('.viewer-stage').evaluate((stage) => stage.scrollTop + stage.scrollLeft)).toBe(0);
});

test('a failed PDF request offers a working retry and an independent PDF link', async ({ page }) => {
  await page.route('**/*.pdf', (route) => route.abort());
  await page.goto('/portfolio/');
  await expect(page.getByRole('alert')).toContainText('couldn’t be opened');
  const fallback = page.getByRole('link', { name: 'Open PDF' });
  await expect(fallback).toHaveAttribute('href', /\.pdf$/);
  await expect(fallback).toHaveAttribute('target', '_blank');
  await page.unroute('**/*.pdf');
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('.pdf-paper[data-status="ready"]').first()).toBeVisible({ timeout: 15000 });
});
