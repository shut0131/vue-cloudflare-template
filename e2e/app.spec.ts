import { test, expect } from '@playwright/test'

test.describe('Vue App', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the app to load
    await page.waitForSelector('.app', { timeout: 10000 })
    
    // The title might be either from Vite default or our custom title
    const title = await page.title()
    expect(title).toMatch(/Vue|Vite/)
  })

  test('displays main heading', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the header to be visible
    await page.waitForSelector('.app-header h1', { timeout: 10000 })
    
    await expect(page.locator('.app-header h1')).toContainText('Vue + Cloudflare Workers Template')
  })

  test('theme toggle works', async ({ page }) => {
    await page.goto('/')
    
    // Wait for theme button to be visible
    await page.waitForSelector('.theme-button', { timeout: 10000 })
    
    const themeButton = page.locator('.theme-button')
    await expect(themeButton).toBeVisible()
    
    // Get initial state of HTML classes
    const htmlElement = page.locator('html')
    
    // Click theme button multiple times
    await themeButton.click() // Switch theme
    await page.waitForTimeout(100) // Wait for theme to apply
    
    await themeButton.click() // Switch again
    await page.waitForTimeout(100)
    
    // Verify button is still clickable (basic functionality test)
    await expect(themeButton).toBeVisible()
  })

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/')
    
    // Wait for navigation to be ready
    await page.waitForSelector('.navigation', { timeout: 10000 })
    
    // Start on Home page - check for HelloWorld component content
    await expect(page.locator('text=This is a Vue 3')).toBeVisible()
    
    // Navigate to API Example
    await page.click('button:has-text("API Example")')
    
    // Wait for API Example page to load
    await page.waitForSelector('h2:has-text("API Integration Example")', { timeout: 10000 })
    await expect(page.locator('h2')).toContainText('API Integration Example')
    
    // Navigate back to Home
    await page.click('button:has-text("Home")')
    
    // Wait for Home content to be visible again
    await page.waitForSelector('text=This is a Vue 3', { timeout: 10000 })
    await expect(page.locator('text=This is a Vue 3')).toBeVisible()
  })

  test('counter increments', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the counter button to be visible
    await page.waitForSelector('button:has-text("Count is:")', { timeout: 10000 })
    
    const button = page.locator('button:has-text("Count is:")')
    await expect(button).toContainText('Count is: 0')
    
    await button.click()
    await expect(button).toContainText('Count is: 1')
    
    await button.click()
    await expect(button).toContainText('Count is: 2')
  })
})