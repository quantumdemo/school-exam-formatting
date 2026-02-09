const { test, expect } = require('@playwright/test');

test('footer has correct attribution, dynamic year, and whatsapp link', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/index.html');

  const footerAttribution = page.locator('.contact-section');
  await expect(footerAttribution).toContainText('Afeez Alimi Olalekan');

  const yearElement = page.locator('#currentYear');
  const currentYear = new Date().getFullYear().toString();
  await expect(yearElement).toHaveText(currentYear);

  const waLink = page.locator('a[href="https://wa.me/2348140020576"]').first();
  await expect(waLink).toBeVisible();
  await expect(waLink).toContainText('08140020576');

  // Verify the new small link in the bottom footer
  const bottomWaLink = page.locator('.border-t.border-gray-800 a[href="https://wa.me/2348140020576"]');
  await expect(bottomWaLink).toBeVisible();
});
