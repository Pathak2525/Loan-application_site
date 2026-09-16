import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('loan-application-draft'));
  await page.reload();
});

test('shows validation error when no loan type is selected', async ({ page }) => {
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByText(/select a loan type/i)).toBeVisible();
});

test('completes the personal loan happy path through to verification', async ({ page }) => {
  // Step 1: loan type
  await page.getByText('Personal loan').click();
  await page.getByRole('button', { name: /continue/i }).click();

  // Step 2: personal details
  await page.getByLabel('Full name').fill('Aarav Sharma');
  await page.getByLabel('Date of birth').fill('1992-05-10');
  await page.getByLabel('Gender').selectOption('male');
  await page.getByLabel('PAN number').fill('ABCDE1234F');
  await page.getByLabel('Aadhaar number').fill('123456789012');
  await page.getByRole('button', { name: /continue/i }).click();

  // Step 3: contact details
  await page.getByLabel('Email address').fill('aarav.sharma@example.com');
  await page.getByLabel('Mobile number').fill('9876543210');
  await page.getByRole('button', { name: /continue/i }).click();

  // Step 4: address
  await page.getByLabel('PIN code').fill('110001');
  await page.getByLabel('Address line 1').fill('12 MG Road');
  await page.getByLabel('City').fill('New Delhi');
  await page.getByLabel('State').fill('Delhi');
  await page.getByLabel('Residence type').selectOption('owned');
  await page.getByRole('button', { name: /continue/i }).click();

  // Step 5: employment
  await page.getByLabel('Employment type').selectOption('salaried');
  await page.getByLabel('Employer name').fill('Acme Pvt Ltd');
  await page.getByLabel('Monthly income (₹)').fill('80000');
  await page.getByLabel('Years in current job/business').fill('3');
  await page.getByRole('button', { name: /continue/i }).click();

  // Step 6: loan details — expect a live EMI estimate to appear
  await page.getByLabel('Loan amount (₹)').fill('500000');
  await page.getByLabel('Tenure (months)').fill('36');
  await page.getByLabel('Purpose of loan').fill('Wedding expenses');
  await expect(page.getByText(/estimated monthly emi/i)).toBeVisible();
  await page.getByRole('button', { name: /continue/i }).click();

  // Step 7: documents step should now be visible
  await expect(page.getByText(/upload your documents/i)).toBeVisible();
});

test('progress is restored after a page reload (auto-save)', async ({ page }) => {
  await page.getByText('Home loan').click();
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByText(/tell us about yourself/i)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/tell us about yourself/i)).toBeVisible();
});
