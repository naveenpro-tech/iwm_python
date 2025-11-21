import { test, expect } from "@playwright/test"

/**
 * Comprehensive Role Management Workflow Test
 * 
 * This test covers the complete user journey:
 * 1. Login
 * 2. Enable multiple roles (Critic, Talent, Industry)
 * 3. Verify role-specific tabs appear
 * 4. Fill in profile data for each role
 * 5. Save settings for each role
 * 6. Verify public profile pages display correct data
 * 7. Verify role-based routing works
 */

test.describe("Role Management - Full Workflow", () => {
  // Test data for profile information
  const testData = {
    username: "testuser",
    critic: {
      bio: "Professional film critic with 10+ years of experience in cinema analysis.",
      twitter: "https://twitter.com/testcritic",
      website: "https://filmcritic.example.com",
      reviewStyle: "analytical",
    },
    talent: {
      stageName: "Test Talent Star",
      bio: "Award-winning actor with diverse portfolio in film and theater.",
      headshot: "https://example.com/headshot.jpg",
      demoReel: "https://youtube.com/watch?v=demo123",
      agentName: "Jane Smith",
      agentEmail: "jane@talentag.com",
    },
    industry: {
      companyName: "Test Studios Inc.",
      jobTitle: "Executive Producer",
      bio: "Experienced producer specializing in independent films and documentaries.",
      linkedin: "https://linkedin.com/in/testpro",
      website: "https://teststudios.com",
    },
  }

  test.beforeEach(async ({ page }) => {
    // Step 1: Login to the application
    await page.goto("/login")
    
    // Fill in login credentials
    await page.fill('input[type="email"]', "test@example.com")
    await page.fill('input[type="password"]', "testpassword123")
    
    // Submit login form
    await page.click('button[type="submit"]')
    
    // Wait for redirect to home page
    await page.waitForURL("/", { timeout: 10000 })
    
    // Verify login successful
    await expect(page.locator('text="Welcome"').or(page.locator('[data-testid="user-menu"]'))).toBeVisible({ timeout: 5000 })
  })

  test("Complete role management workflow - Enable, Configure, and Verify", async ({ page }) => {
    // Step 2: Navigate to Settings → Roles tab
    await page.goto("/settings")
    await page.waitForSelector('text="Manage Your Roles"', { timeout: 10000 })
    
    // Click on Roles tab
    await page.click('button[value="roles"]')
    await page.waitForSelector('text="Manage Your Roles"')
    
    // Verify all 4 roles are displayed
    await expect(page.locator('text="Movie Lover"')).toBeVisible()
    await expect(page.locator('text="Critic"')).toBeVisible()
    await expect(page.locator('text="Talent"')).toBeVisible()
    await expect(page.locator('text="Industry Professional"')).toBeVisible()

    // Step 3: Enable Critic role
    console.log("Enabling Critic role...")
    const criticSwitch = page.locator('#role-critic')
    const criticChecked = await criticSwitch.isChecked()
    
    if (!criticChecked) {
      await criticSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1500) // Wait for UI to update
    }

    // Step 4: Verify Critic tab appears
    await expect(page.locator('button[value="critic"]')).toBeVisible()
    console.log("✓ Critic tab appeared")

    // Step 5: Enable Talent role
    console.log("Enabling Talent role...")
    await page.click('button[value="roles"]') // Go back to Roles tab
    const talentSwitch = page.locator('#role-talent')
    const talentChecked = await talentSwitch.isChecked()
    
    if (!talentChecked) {
      await talentSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1500)
    }

    // Step 6: Verify Talent tab appears
    await expect(page.locator('button[value="talent"]')).toBeVisible()
    console.log("✓ Talent tab appeared")

    // Step 7: Enable Industry Professional role
    console.log("Enabling Industry Professional role...")
    await page.click('button[value="roles"]') // Go back to Roles tab
    const industrySwitch = page.locator('#role-industry')
    const industryChecked = await industrySwitch.isChecked()
    
    if (!industryChecked) {
      await industrySwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1500)
    }

    // Step 8: Verify Industry tab appears
    await expect(page.locator('button[value="industry"]')).toBeVisible()
    console.log("✓ Industry tab appeared")

    // Step 9: Fill in Critic profile data
    console.log("Filling Critic profile data...")
    await page.click('button[value="critic"]')
    await page.waitForSelector('text="Critic Profile Settings"', { timeout: 5000 })
    
    // Fill Critic bio
    const criticBioField = page.locator('textarea[name="bio"]').or(page.locator('textarea').first())
    await criticBioField.fill(testData.critic.bio)
    
    // Fill Critic social links (if fields exist)
    const criticTwitterField = page.locator('input[name="twitter"]').or(page.locator('input[placeholder*="twitter" i]'))
    if (await criticTwitterField.count() > 0) {
      await criticTwitterField.first().fill(testData.critic.twitter)
    }
    
    const criticWebsiteField = page.locator('input[name="website"]').or(page.locator('input[placeholder*="website" i]'))
    if (await criticWebsiteField.count() > 0) {
      await criticWebsiteField.first().fill(testData.critic.website)
    }
    
    // Save Critic settings
    const criticSaveButton = page.locator('button:has-text("Save")').first()
    await criticSaveButton.click()
    await expect(page.locator('text="Settings saved"').or(page.locator('text="Profile updated"'))).toBeVisible({ timeout: 5000 })
    console.log("✓ Critic profile saved")
    
    await page.waitForTimeout(1000)

    // Step 10: Fill in Talent profile data
    console.log("Filling Talent profile data...")
    await page.click('button[value="talent"]')
    await page.waitForSelector('text="Talent Profile Settings"', { timeout: 5000 })
    
    // Fill Talent stage name
    const stageNameField = page.locator('input[name="stageName"]').or(page.locator('input[placeholder*="stage name" i]'))
    if (await stageNameField.count() > 0) {
      await stageNameField.first().fill(testData.talent.stageName)
    }
    
    // Fill Talent bio
    const talentBioField = page.locator('textarea[name="bio"]').or(page.locator('textarea').first())
    await talentBioField.fill(testData.talent.bio)
    
    // Fill Talent demo reel
    const demoReelField = page.locator('input[name="demoReel"]').or(page.locator('input[placeholder*="demo" i]'))
    if (await demoReelField.count() > 0) {
      await demoReelField.first().fill(testData.talent.demoReel)
    }
    
    // Fill agent info
    const agentNameField = page.locator('input[name="agentName"]').or(page.locator('input[placeholder*="agent" i]'))
    if (await agentNameField.count() > 0) {
      await agentNameField.first().fill(testData.talent.agentName)
    }
    
    // Save Talent settings
    const talentSaveButton = page.locator('button:has-text("Save")').first()
    await talentSaveButton.click()
    await expect(page.locator('text="Settings saved"').or(page.locator('text="Profile updated"'))).toBeVisible({ timeout: 5000 })
    console.log("✓ Talent profile saved")
    
    await page.waitForTimeout(1000)

    // Step 11: Fill in Industry Professional profile data
    console.log("Filling Industry Professional profile data...")
    await page.click('button[value="industry"]')
    await page.waitForSelector('text="Industry Professional Settings"', { timeout: 5000 })
    
    // Fill company name
    const companyField = page.locator('input[name="companyName"]').or(page.locator('input[placeholder*="company" i]'))
    if (await companyField.count() > 0) {
      await companyField.first().fill(testData.industry.companyName)
    }
    
    // Fill job title
    const jobTitleField = page.locator('input[name="jobTitle"]').or(page.locator('input[placeholder*="title" i]'))
    if (await jobTitleField.count() > 0) {
      await jobTitleField.first().fill(testData.industry.jobTitle)
    }
    
    // Fill Industry bio
    const industryBioField = page.locator('textarea[name="bio"]').or(page.locator('textarea').first())
    await industryBioField.fill(testData.industry.bio)
    
    // Fill LinkedIn
    const linkedinField = page.locator('input[name="linkedin"]').or(page.locator('input[placeholder*="linkedin" i]'))
    if (await linkedinField.count() > 0) {
      await linkedinField.first().fill(testData.industry.linkedin)
    }
    
    // Save Industry settings
    const industrySaveButton = page.locator('button:has-text("Save")').first()
    await industrySaveButton.click()
    await expect(page.locator('text="Settings saved"').or(page.locator('text="Profile updated"'))).toBeVisible({ timeout: 5000 })
    console.log("✓ Industry profile saved")
    
    await page.waitForTimeout(1000)

    // Step 12: Get current user's username for profile verification
    // Try to extract username from URL or profile dropdown
    let username = testData.username
    
    // Try to get username from profile dropdown or navbar
    const profileLink = page.locator('a[href*="/profile/"]').first()
    if (await profileLink.count() > 0) {
      const href = await profileLink.getAttribute('href')
      if (href) {
        const match = href.match(/\/profile\/([^\/]+)/)
        if (match) {
          username = match[1]
        }
      }
    }

    console.log(`Using username: ${username}`)

    // Step 13: Verify Critic public profile page
    console.log("Verifying Critic public profile...")
    await page.goto(`/profile/${username}/critic`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Verify Critic profile displays
    await expect(page.locator('text="Critic"').or(page.locator('text="⭐"'))).toBeVisible({ timeout: 5000 })
    
    // Verify bio is displayed (check for partial text)
    const criticBioText = testData.critic.bio.substring(0, 30)
    await expect(page.locator(`text="${criticBioText}"`).or(page.locator('text="Professional film critic"'))).toBeVisible({ timeout: 5000 })
    console.log("✓ Critic profile verified")

    // Step 14: Verify Talent public profile page
    console.log("Verifying Talent public profile...")
    await page.goto(`/profile/${username}/talent`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Verify Talent profile displays
    await expect(page.locator('text="Talent"').or(page.locator('text="🎭"'))).toBeVisible({ timeout: 5000 })
    
    // Verify stage name or bio is displayed
    await expect(
      page.locator(`text="${testData.talent.stageName}"`).or(page.locator('text="Award-winning actor"'))
    ).toBeVisible({ timeout: 5000 })
    console.log("✓ Talent profile verified")

    // Step 15: Verify Industry Professional public profile page
    console.log("Verifying Industry Professional public profile...")
    await page.goto(`/profile/${username}/industry`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Verify Industry profile displays
    await expect(page.locator('text="Industry"').or(page.locator('text="💼"'))).toBeVisible({ timeout: 5000 })
    
    // Verify company name or job title is displayed
    await expect(
      page.locator(`text="${testData.industry.companyName}"`).or(page.locator(`text="${testData.industry.jobTitle}"`))
    ).toBeVisible({ timeout: 5000 })
    console.log("✓ Industry profile verified")

    // Step 16: Verify role-based routing works correctly
    console.log("Verifying role-based routing...")
    
    // Navigate to base profile (should show default role or role selector)
    await page.goto(`/profile/${username}`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Should display user profile
    await expect(page.locator(`text="${username}"`).or(page.locator('text="Profile"'))).toBeVisible({ timeout: 5000 })
    console.log("✓ Base profile route verified")

    // Final verification: All role tabs still visible in settings
    await page.goto("/settings")
    await expect(page.locator('button[value="critic"]')).toBeVisible()
    await expect(page.locator('button[value="talent"]')).toBeVisible()
    await expect(page.locator('button[value="industry"]')).toBeVisible()
    console.log("✓ All role tabs still visible")

    console.log("\n✅ Complete workflow test passed!")
  })

  test("Verify role data persistence after page reload", async ({ page }) => {
    // Navigate to settings
    await page.goto("/settings")
    
    // Enable Critic role if not already enabled
    await page.click('button[value="roles"]')
    const criticSwitch = page.locator('#role-critic')
    const isChecked = await criticSwitch.isChecked()
    
    if (!isChecked) {
      await criticSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1500)
    }
    
    // Fill in some data
    await page.click('button[value="critic"]')
    await page.waitForSelector('text="Critic Profile Settings"', { timeout: 5000 })
    
    const testBio = "Test bio for persistence check"
    const bioField = page.locator('textarea[name="bio"]').or(page.locator('textarea').first())
    await bioField.fill(testBio)
    
    // Save
    await page.locator('button:has-text("Save")').first().click()
    await expect(page.locator('text="Settings saved"').or(page.locator('text="Profile updated"'))).toBeVisible({ timeout: 5000 })
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Navigate back to Critic tab
    await page.click('button[value="critic"]')
    await page.waitForSelector('text="Critic Profile Settings"', { timeout: 5000 })
    
    // Verify data is still there
    const bioValue = await bioField.inputValue()
    expect(bioValue).toBe(testBio)
    
    console.log("✓ Role data persisted after page reload")
  })
})

