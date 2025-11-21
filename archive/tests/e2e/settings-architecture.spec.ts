import { test, expect, Page } from '@playwright/test'

// Helper function to setup authenticated session
async function setupAuthenticatedSession(page: Page) {
  // Navigate to home first to establish domain context
  await page.goto('/')
  
  // Set auth token in cookies
  await page.context().addCookies([
    {
      name: 'access_token',
      value: 'test_jwt_token_' + Date.now(),
      domain: 'localhost',
      path: '/',
    },
  ])
  
  // Set user data in localStorage
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'test_jwt_token')
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      fullName: 'Test User',
      avatarUrl: null,
    }))
  })
}

test.describe('Epic E-2: Frontend Settings Architecture - GUI Tests', () => {
  test.describe('E-2.1: Route Protection & Middleware', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/settings')
      await expect(page).toHaveURL(/\/login.*redirect.*settings/)
    })

    test('should allow authenticated users to access /settings', async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await expect(page).toHaveURL('/settings')
      await page.waitForLoadState('networkidle')
    })

    test('should render settings page with correct DOM structure', async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')

      // Check for tabs using button selector (shadcn/ui uses buttons for tabs)
      const tabButtons = await page.locator('button[role="tab"]').count()
      expect(tabButtons).toBeGreaterThan(0)

      // Take screenshot for debugging
      await page.screenshot({ path: 'test-artifacts/settings-page-structure.png' })
    })
  })

  test.describe('E-2.6: Settings Page Structure & Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
    })

    test('should render settings page with tabs', async ({ page }) => {
      const tabButtons = await page.locator('button[role="tab"]').count()
      expect(tabButtons).toBeGreaterThan(0)
    })

    test('should have Profile tab visible', async ({ page }) => {
      const profileTab = page.locator('button[role="tab"]:has-text("Profile")')
      await expect(profileTab).toBeVisible()
    })

    test('should have Account tab visible', async ({ page }) => {
      const accountTab = page.locator('button[role="tab"]:has-text("Account")')
      await expect(accountTab).toBeVisible()
    })

    test('should have Notifications tab visible', async ({ page }) => {
      const notifyTab = page.locator('button[role="tab"]:has-text("Notify")')
      await expect(notifyTab).toBeVisible()
    })

    test('should switch tabs when clicked', async ({ page }) => {
      const accountTab = page.locator('button[role="tab"]:has-text("Account")')
      await accountTab.click()
      await page.waitForTimeout(500)
      await expect(accountTab).toHaveAttribute('data-state', 'active')
    })
  })

  test.describe('E-2.4 & E-2.5: Profile Settings Tab', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
      const profileTab = page.locator('button[role="tab"]:has-text("Profile")')
      await profileTab.click()
      await page.waitForTimeout(500)
    })

    test('should render profile form fields', async ({ page }) => {
      const labels = await page.locator('label').count()
      expect(labels).toBeGreaterThan(0)
    })

    test('should have username input field', async ({ page }) => {
      const usernameInput = page.locator('input[name="username"]')
      await expect(usernameInput).toBeVisible()
    })

    test('should have email input field', async ({ page }) => {
      const emailInput = page.locator('input[name="email"]')
      await expect(emailInput).toBeVisible()
    })

    test('should have save button', async ({ page }) => {
      const saveButton = page.locator('button:has-text("Save")')
      await expect(saveButton).toBeVisible()
    })

    test('should track form dirty state', async ({ page }) => {
      const usernameInput = page.locator('input[name="username"]')
      const saveButton = page.locator('button:has-text("Save")')
      const isDisabled = await saveButton.isDisabled()
      await usernameInput.fill('newusername')
      await page.waitForTimeout(300)
      const isEnabledAfter = await saveButton.isEnabled()
      expect(isEnabledAfter).toBe(true)
    })
  })

  test.describe('E-2.6: Account Settings Tab', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
      const accountTab = page.locator('button[role="tab"]:has-text("Account")')
      await accountTab.click()
      await page.waitForTimeout(500)
    })

    test('should render account settings form', async ({ page }) => {
      const formLabels = await page.locator('label').count()
      expect(formLabels).toBeGreaterThan(0)
    })

    test('should have save button in account tab', async ({ page }) => {
      const saveButton = page.locator('button:has-text("Save")')
      await expect(saveButton).toBeVisible()
    })
  })

  test.describe('E-2.6: Preferences Settings Tab', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
      const prefsTab = page.locator('button[role="tab"]:has-text("Prefs")')
      await prefsTab.click()
      await page.waitForTimeout(500)
    })

    test('should render preferences form', async ({ page }) => {
      const formLabels = await page.locator('label').count()
      expect(formLabels).toBeGreaterThan(0)
    })

    test('should have language selector', async ({ page }) => {
      // shadcn/ui Select uses button with role="combobox", not native select
      const selects = await page.locator('button[role="combobox"]').count()
      expect(selects).toBeGreaterThan(0)
    })
  })

  test.describe('E-2.7: Notifications Preferences Tab', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
      const notifyTab = page.locator('button[role="tab"]:has-text("Notify")')
      await notifyTab.click()
      await page.waitForTimeout(500)
    })

    test('should render notification preferences', async ({ page }) => {
      const formLabels = await page.locator('label').count()
      expect(formLabels).toBeGreaterThan(0)
    })

    test('should have checkboxes for notification channels', async ({ page }) => {
      // shadcn/ui Checkbox uses button with role="checkbox", not native input
      const checkboxes = await page.locator('button[role="checkbox"]').count()
      expect(checkboxes).toBeGreaterThan(0)
    })

    test('should have email frequency selector', async ({ page }) => {
      // shadcn/ui Select uses button with role="combobox", not native select
      const selects = await page.locator('button[role="combobox"]').count()
      expect(selects).toBeGreaterThan(0)
    })
  })

  test.describe('E-2.3: Shared Components & Hooks', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
    })

    test('should display form field labels', async ({ page }) => {
      const labels = await page.locator('label').count()
      expect(labels).toBeGreaterThan(0)
    })

    test('should have input fields with proper types', async ({ page }) => {
      const inputs = await page.locator('input').count()
      expect(inputs).toBeGreaterThan(0)
    })

    test('should have no console errors on page load', async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      const tabs = await page.locator('[role="tab"]').all()
      for (const tab of tabs) {
        await tab.click()
        await page.waitForTimeout(300)
      }
      expect(errors.length).toBe(0)
    })
  })

  test.describe('E-2.2: Validation & Type Safety', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
      const profileTab = page.locator('button[role="tab"]:has-text("Profile")')
      await profileTab.click()
      await page.waitForTimeout(500)
    })

    test('should have form inputs with proper attributes', async ({ page }) => {
      const inputs = await page.locator('input').all()
      expect(inputs.length).toBeGreaterThan(0)
      for (const input of inputs) {
        const type = await input.getAttribute('type')
        // Allow null for checkboxes/radios that don't have explicit type attribute
        expect(['text', 'email', 'password', 'number', 'tel', 'url', 'file', 'checkbox', 'radio', null]).toContain(type)
      }
    })

    test('should have accessible form structure', async ({ page }) => {
      const labels = await page.locator('label').count()
      expect(labels).toBeGreaterThan(0)
    })
  })

  test.describe('Cross-Tab Navigation & State Management', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedSession(page)
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
    })

    test('should navigate between tabs without errors', async ({ page }) => {
      const tabs = await page.locator('button[role="tab"]').all()
      for (const tab of tabs) {
        await tab.click()
        await page.waitForTimeout(300)
        const isActive = await tab.getAttribute('data-state')
        expect(isActive).toBe('active')
      }
    })

    test('should maintain page structure across tab switches', async ({ page }) => {
      const tabs = await page.locator('button[role="tab"]').all()
      for (let i = 0; i < 2; i++) {
        for (const tab of tabs) {
          await tab.click()
          await page.waitForTimeout(300)
          const tabpanels = await page.locator('[role="tabpanel"]').count()
          expect(tabpanels).toBeGreaterThan(0)
        }
      }
    })

    test('should have all required UI elements on each tab', async ({ page }) => {
      const tabs = await page.locator('button[role="tab"]').all()
      for (const tab of tabs) {
        await tab.click()
        await page.waitForTimeout(300)
        const formElements = await page.locator('input, select, textarea, button').count()
        expect(formElements).toBeGreaterThan(0)
      }
    })
  })
})

