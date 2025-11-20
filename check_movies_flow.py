#!/usr/bin/env python3
"""Automated check of /movies page and opening a movie detail.
Runs with Playwright (async). Assumes backend and frontend are running.
"""
import asyncio
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        # Go to movies page
        await page.goto(f"{BASE_URL}/movies")
        await page.wait_for_load_state("networkidle")
        # Wait a bit for movies to render
        await page.wait_for_timeout(3000)
        # Check that at least one movie card is present
        movie_cards = page.locator('[data-test-id="movie-card"]')
        count = await movie_cards.count()
        if count == 0:
            print("❌ No movies found on /movies page")
        else:
            print(f"✅ Found {count} movies on /movies page")
            # Click the first movie card
            await movie_cards.first.click()
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(2000)
            # Verify that title element exists
            title = page.locator('h1')
            if await title.count() > 0:
                txt = await title.text_content()
                print(f"✅ Movie detail page opened, title: {txt}")
            else:
                print("❌ Movie title not found on detail page")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
