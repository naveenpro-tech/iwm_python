import { test, expect } from '@playwright/test'

const BACKEND_BASE = process.env.E2E_BACKEND_URL ?? 'http://localhost:8000'
const FRONTEND_BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

const TEST_EMAIL = 'user1@iwm.com'
const TEST_PASSWORD = 'rmrnn0077'
const TEST_USERNAME = 'user1'

async function loginViaApiAndSeedStorage(page) {
  const res = await page.request.post(`${BACKEND_BASE}/api/v1/auth/login`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  })
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  const token = json.access_token
  await page.addInitScript((t) => {
    localStorage.setItem('access_token', t)
    document.cookie = `access_token=${t}; path=/; SameSite=Lax`
  }, token)
}

test.describe('Playlists - create and list', () => {
  test('create playlist from profile and see it listed', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await loginViaApiAndSeedStorage(page)

    await page.goto(`${FRONTEND_BASE}/profile/${TEST_USERNAME}?section=playlists`)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-artifacts/playlists/01-profile.png' })

    // Wait for playlists UI to be ready
    const firstCreateCta = page.getByRole('button', { name: /Create Your First Playlist/i })
    const createButtonTop = page.getByRole('button', { name: /^(Create Playlist|Create)$/i })
    try {
      await expect(firstCreateCta).toBeVisible({ timeout: 10_000 })
      await page.screenshot({ path: 'test-artifacts/playlists/02-empty-state.png' })
      await firstCreateCta.click()
    } catch {
      await expect(createButtonTop).toBeVisible({ timeout: 10_000 })
      await page.screenshot({ path: 'test-artifacts/playlists/02-tab-playlists.png' })
      await createButtonTop.click()
    }

    // Empty state or list should render
    const createButton = page.getByRole('button', { name: /Create Playlist/i })
    await expect(createButton).toBeVisible()
    await page.screenshot({ path: 'test-artifacts/playlists/03-empty-or-list.png' })
    await createButton.click()

    // Modal appears
    await expect(page.getByText('Create New Playlist')).toBeVisible()
    await page.screenshot({ path: 'test-artifacts/playlists/04-modal-open.png' })

    // Fill and submit
    const title = `E2E Playlist ${Date.now()}`
    await page.fill('#title', title)
    await page.fill('#description', 'Playlist created by Playwright test')
    await page.screenshot({ path: 'test-artifacts/playlists/05-form-filled.png' })
    await page.getByRole('button', { name: 'Create Playlist' }).click()
    await page.screenshot({ path: 'test-artifacts/playlists/06-after-submit.png' })

    // Expect card visible with title
    await expect(page.getByText(title)).toBeVisible({ timeout: 10_000 })
    await page.screenshot({ path: 'test-artifacts/playlists/07-created-visible.png' })

    // Refresh to verify persistence
    await page.reload()
    await page.getByRole('button', { name: 'Playlists' }).click()
    await page.screenshot({ path: 'test-artifacts/playlists/08-after-reload-before-assert.png' })
    await expect(page.getByText(title)).toBeVisible({ timeout: 10_000 })
    await page.screenshot({ path: 'test-artifacts/playlists/09-after-reload-asserted.png' })

    // Final overview screenshot
    await page.screenshot({ path: 'test-artifacts/playlists/10-final.png', fullPage: true })

    // Assert no console errors
    expect(consoleErrors, 'console errors').toEqual([])
  })
})

