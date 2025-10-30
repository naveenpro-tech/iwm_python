"""
Test to check if environment variables are loaded in the browser
"""
import asyncio
from playwright.async_api import async_playwright

async def test_env():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        await page.goto("http://localhost:3001/login")
        await page.wait_for_load_state("networkidle")
        
        # Check environment variables in browser
        result = await page.evaluate("""
            () => {
                return {
                    NEXT_PUBLIC_ENABLE_BACKEND: process.env.NEXT_PUBLIC_ENABLE_BACKEND,
                    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
                    windowEnv: window.__ENV__,
                    allProcessEnv: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC'))
                }
            }
        """)
        
        print("\n" + "="*80)
        print("🔍 ENVIRONMENT VARIABLES IN BROWSER")
        print("="*80)
        print(f"\nNEXT_PUBLIC_ENABLE_BACKEND: {result['NEXT_PUBLIC_ENABLE_BACKEND']}")
        print(f"NEXT_PUBLIC_API_BASE_URL: {result['NEXT_PUBLIC_API_BASE_URL']}")
        print(f"window.__ENV__: {result['windowEnv']}")
        print(f"\nAll NEXT_PUBLIC_* env vars: {result['allProcessEnv']}")
        print("="*80 + "\n")
        
        await asyncio.sleep(3)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_env())

