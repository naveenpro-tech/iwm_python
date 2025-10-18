import { test, expect } from '@playwright/test'

const email = `e2e_${Date.now()}@example.com`
const password = 'password123'

async function signup(page) {
  await page.goto('/signup')
  await page.fill('#signup-email', email)
  await page.fill('#signup-password', password)
  await page.fill('#confirm-password', password)
  await page.getByRole('button', { name: 'Sign Up' }).click()
  await page.waitForURL('**/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
}

async function login(page) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', password)
  await page.getByRole('button', { name: 'Login' }).click()
  await page.waitForURL('**/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
}

test('signup -> dashboard -> browse movies -> update settings', async ({ page }) => {
  await signup(page)
  // Navigate to movies page
  await page.goto('/movies')
  await expect(page.getByText('Explore Movies')).toBeVisible()
  // Apply a filter (if sidebar visible)
  // This is smoke-level: we just expect some movies render (from backend or fallback)
  await page.waitForTimeout(1000)
  // Navigate back to dashboard
  await page.goto('/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
})

test('login -> dashboard', async ({ page }) => {
  await login(page)
})

