#!/usr/bin/env python3
"""
Complete Settings Tab GUI Test
Tests all settings tabs and fields in the browser
"""

import os
import sys
import time
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from playwright.sync_api import sync_playwright, expect

# Configuration
BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
TEST_USER_EMAIL = "user1@iwm.com"
TEST_USER_PASSWORD = "rmrnn0077"

class SettingsGUITester:
    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=False)
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        self.results = []

    def login(self):
        """Login to the application"""
        print("\n🔐 Logging in...")
        self.page.goto(f"{BASE_URL}/login")
        self.page.fill('input[type="email"]', TEST_USER_EMAIL)
        self.page.fill('input[type="password"]', TEST_USER_PASSWORD)
        self.page.click('button[type="submit"]')
        self.page.wait_for_url(f"{BASE_URL}/dashboard", timeout=10000)
        print("✅ Login successful")

    def navigate_to_settings(self):
        """Navigate to profile settings"""
        print("\n📍 Navigating to settings...")
        self.page.goto(f"{BASE_URL}/profile/user1?section=settings")
        self.page.wait_for_selector('[role="tablist"]', timeout=5000)
        print("✅ Settings page loaded")

    def test_profile_tab(self):
        """Test Profile tab"""
        print("\n📝 Testing Profile Tab...")
        try:
            # Click Profile tab
            self.page.click('button:has-text("Profile")')
            time.sleep(1)
            
            # Check fields exist
            self.page.fill('input[name="fullName"]', "John Doe Updated")
            self.page.fill('input[name="username"]', "user1")
            self.page.fill('textarea[name="bio"]', "Updated bio")
            
            # Save
            self.page.click('button:has-text("Save Changes")')
            time.sleep(2)
            
            # Check success message
            success = self.page.is_visible('text=Profile settings saved')
            self.results.append(("Profile Tab", success))
            print(f"{'✅' if success else '❌'} Profile tab test")
            return success
        except Exception as e:
            print(f"❌ Profile tab error: {e}")
            self.results.append(("Profile Tab", False))
            return False

    def test_account_tab(self):
        """Test Account tab"""
        print("\n📝 Testing Account Tab...")
        try:
            # Click Account tab
            self.page.click('button:has-text("Account")')
            time.sleep(1)
            
            # Check fields exist
            self.page.fill('input[name="name"]', "John Doe")
            self.page.fill('input[name="email"]', "user1@iwm.com")
            self.page.fill('input[name="phone"]', "+1-555-0123")
            
            # Save account info
            self.page.click('button:has-text("Save Account Info")')
            time.sleep(2)
            
            # Check success message
            success = self.page.is_visible('text=Account settings saved')
            self.results.append(("Account Tab", success))
            print(f"{'✅' if success else '❌'} Account tab test")
            return success
        except Exception as e:
            print(f"❌ Account tab error: {e}")
            self.results.append(("Account Tab", False))
            return False

    def test_preferences_tab(self):
        """Test Preferences tab"""
        print("\n📝 Testing Preferences Tab...")
        try:
            # Click Preferences tab
            self.page.click('button:has-text("Preferences")')
            time.sleep(1)
            
            # Check language select
            self.page.select_option('select', "en")
            
            # Check region select
            self.page.select_option('select', "us")
            
            # Save
            self.page.click('button:has-text("Save Preferences")')
            time.sleep(2)
            
            # Check success message
            success = self.page.is_visible('text=Preferences saved')
            self.results.append(("Preferences Tab", success))
            print(f"{'✅' if success else '❌'} Preferences tab test")
            return success
        except Exception as e:
            print(f"❌ Preferences tab error: {e}")
            self.results.append(("Preferences Tab", False))
            return False

    def test_display_tab(self):
        """Test Display tab"""
        print("\n📝 Testing Display Tab...")
        try:
            # Click Display tab
            self.page.click('button:has-text("Display")')
            time.sleep(1)
            
            # Check theme select
            self.page.select_option('select', "dark")
            
            # Save
            self.page.click('button:has-text("Save Display Settings")')
            time.sleep(2)
            
            # Check success message
            success = self.page.is_visible('text=Display settings saved')
            self.results.append(("Display Tab", success))
            print(f"{'✅' if success else '❌'} Display tab test")
            return success
        except Exception as e:
            print(f"❌ Display tab error: {e}")
            self.results.append(("Display Tab", False))
            return False

    def test_privacy_tab(self):
        """Test Privacy tab"""
        print("\n📝 Testing Privacy Tab...")
        try:
            # Click Privacy tab
            self.page.click('button:has-text("Privacy")')
            time.sleep(1)
            
            # Check profile visibility select
            self.page.select_option('select', "public")
            
            # Save
            self.page.click('button:has-text("Save Privacy Settings")')
            time.sleep(2)
            
            # Check success message
            success = self.page.is_visible('text=Privacy settings saved')
            self.results.append(("Privacy Tab", success))
            print(f"{'✅' if success else '❌'} Privacy tab test")
            return success
        except Exception as e:
            print(f"❌ Privacy tab error: {e}")
            self.results.append(("Privacy Tab", False))
            return False

    def run_all_tests(self):
        """Run all GUI tests"""
        print("=" * 60)
        print("SETTINGS TAB COMPLETE GUI TEST")
        print("=" * 60)

        try:
            self.login()
            self.navigate_to_settings()
            
            self.test_profile_tab()
            self.test_account_tab()
            self.test_preferences_tab()
            self.test_display_tab()
            self.test_privacy_tab()
            
            self.print_summary()
        except Exception as e:
            print(f"❌ Test error: {e}")
        finally:
            self.cleanup()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("GUI TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for _, success in self.results if success)
        total = len(self.results)
        
        print(f"\n✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        print("\nDetailed Results:")
        for tab, success in self.results:
            status = "✅" if success else "❌"
            print(f"{status} {tab}")

    def cleanup(self):
        """Cleanup resources"""
        self.context.close()
        self.browser.close()
        self.playwright.stop()

if __name__ == "__main__":
    tester = SettingsGUITester()
    tester.run_all_tests()

