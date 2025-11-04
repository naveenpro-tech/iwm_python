# Rebranding Script: Replace "Siddu" platform branding with "Movie Madders"
# This script ONLY replaces platform branding, NOT user/character references

Write-Host "Starting rebranding: Siddu platform → Movie Madders platform" -ForegroundColor Cyan
Write-Host "Note: Keeping 'Siddu Kumar', 'Siddu's Picks', 'SidduScore', etc. (user/character references)" -ForegroundColor Yellow
Write-Host ""

$replacements = @{
    "Siddu Global Entertainment Hub" = "Movie Madders"
    "Siddu platform" = "Movie Madders platform"
    "Siddu Admin" = "Movie Madders Admin"
    "Siddu Verse" = "Movie Madders Verse"
    "Siddu Talent Community" = "Movie Madders Talent Community"
}

$files = @(
    # Admin pages
    "app\admin\analytics\custom-reports\page.tsx",
    "app\admin\analytics\page.tsx",
    "app\admin\analytics\reports\content-performance\page.tsx",
    "app\admin\analytics\reports\page.tsx",
    "app\admin\analytics\reports\system-performance\page.tsx",
    "app\admin\analytics\reports\user-engagement\page.tsx",
    "app\admin\cricket\api\page.tsx",
    "app\admin\cricket\matches\[id]\live-score\page.tsx",
    "app\admin\cricket\matches\page.tsx",
    "app\admin\cricket\page.tsx",
    "app\admin\movies\[id]\page.tsx",
    "app\admin\users\page.tsx",
    
    # Public pages
    "app\movies\[id]\layout.tsx",
    "app\quiz\[id]\take\page.tsx",
    "app\scene-explorer\page.tsx",
    "app\talent-hub\page.tsx",
    
    # Components
    "app\pulse\enhanced\page.tsx",
    "app\movies\[id]\review\create\page.tsx",
    "components\admin\system\system-settings.tsx",
    "components\talent-hub\profile\view\tabs\profile-overview.tsx",
    
    # Documentation
    "docs\fixes\COMPREHENSIVE_BUG_FIX_REPORT.md",
    "docs\fixes\DETAILED_BUG_REPORT.md",
    "docs\archive\NEXT_STEPS_AND_RECOMMENDATIONS.md",
    "docs\archive\EXECUTIVE_SUMMARY.md",
    "docs\testing\CURRENT_STATUS_GUI_TESTING.md",
    "docs\testing\E2E_TESTING_FINAL_COMPREHENSIVE_REPORT.md",
    "docs\testing\FINAL_ROLE_MANAGEMENT_TEST_REPORT.md",
    "docs\testing\ROLE_MANAGEMENT_COMPLETE_TEST_SUMMARY.md",
    "docs\testing\TEST_DELIVERABLES_CHECKLIST.md",
    "docs\mobile\MOBILE_MVP_AUDIT_SUMMARY.md",
    "docs\setup\DATABASE_RESET_AND_SEED_STATUS.md",
    "test-artifacts\gui-testing\BUGS_FOUND_AND_FIXED.md",
    "test-artifacts\gui-testing\FINAL_IMPLEMENTATION_REPORT.md",
    "test-artifacts\gui-testing\GUI_TEST_RESULTS.md",
    "test-artifacts\gui-testing\TESTING_SUMMARY.md"
)

$updatedCount = 0
$errorCount = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw -ErrorAction Stop
            $originalContent = $content
            
            foreach ($old in $replacements.Keys) {
                $new = $replacements[$old]
                $content = $content -replace [regex]::Escape($old), $new
            }
            
            if ($content -ne $originalContent) {
                Set-Content $file $content -NoNewline -ErrorAction Stop
                Write-Host "✓ Updated: $file" -ForegroundColor Green
                $updatedCount++
            } else {
                Write-Host "- Skipped (no changes): $file" -ForegroundColor Gray
            }
        } catch {
            Write-Host "✗ Error updating $file : $_" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "⚠ File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Rebranding complete!" -ForegroundColor Cyan
Write-Host "Files updated: $updatedCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes with: git diff" -ForegroundColor White
Write-Host "2. Test build: bun run build" -ForegroundColor White
Write-Host "3. Commit changes: git add -A" -ForegroundColor White
Write-Host "4. git commit -m `"rebrand: Replace Siddu platform branding with Movie Madders`"" -ForegroundColor White

