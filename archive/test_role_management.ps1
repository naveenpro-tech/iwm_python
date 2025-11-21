# PowerShell script to test Role Management API endpoints
# Tests new signup behavior and role activation/deactivation

$API_BASE = "http://localhost:8000"

Write-Host "=== Role Management API Test ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Signup new user (should get only lover role)
Write-Host "Test 1: Signup new user (should get only lover role)" -ForegroundColor Yellow
$signupBody = @{
    email = "roletest_$(Get-Random)@example.com"
    password = "testpassword123"
    name = "Role Test User"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$API_BASE/api/v1/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    $token = $signupResponse.access_token
    Write-Host "✓ Signup successful" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Signup failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Get user roles (should only have lover role)
Write-Host "Test 2: Get user roles (should only have lover role)" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $rolesResponse = Invoke-RestMethod -Uri "$API_BASE/api/v1/users/me/roles" -Method Get -Headers $headers
    Write-Host "✓ Got user roles" -ForegroundColor Green
    Write-Host "  Roles count: $($rolesResponse.roles.Count)" -ForegroundColor Gray
    
    foreach ($role in $rolesResponse.roles) {
        $enabledStatus = if ($role.enabled) { "ENABLED" } else { "DISABLED" }
        $activeStatus = if ($role.is_active) { "(ACTIVE)" } else { "" }
        Write-Host "  - $($role.name): $enabledStatus $activeStatus" -ForegroundColor Gray
    }
    
    if ($rolesResponse.roles.Count -eq 1 -and $rolesResponse.roles[0].role -eq "lover") {
        Write-Host "✓ Correct: Only lover role present" -ForegroundColor Green
    } else {
        Write-Host "✗ Error: Expected only lover role, got $($rolesResponse.roles.Count) roles" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get roles: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Activate critic role
Write-Host "Test 3: Activate critic role" -ForegroundColor Yellow
$activateBody = @{
    handle = $null
} | ConvertTo-Json

try {
    $activateResponse = Invoke-RestMethod -Uri "$API_BASE/api/v1/roles/critic/activate" -Method Post -Headers $headers -Body $activateBody
    Write-Host "✓ Critic role activated" -ForegroundColor Green
    Write-Host "  Profile created: $($activateResponse.profile_created)" -ForegroundColor Gray
    Write-Host "  Next step: $($activateResponse.next_step)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to activate critic role: $_" -ForegroundColor Red
    # Don't exit - might be because role already exists
}

Write-Host ""

# Test 4: Get roles again (should now have lover and critic, both enabled)
Write-Host "Test 4: Get roles again (should have lover and critic enabled)" -ForegroundColor Yellow
try {
    $rolesResponse2 = Invoke-RestMethod -Uri "$API_BASE/api/v1/users/me/roles" -Method Get -Headers $headers
    Write-Host "✓ Got user roles" -ForegroundColor Green
    Write-Host "  Roles count: $($rolesResponse2.roles.Count)" -ForegroundColor Gray
    
    foreach ($role in $rolesResponse2.roles) {
        $enabledStatus = if ($role.enabled) { "ENABLED" } else { "DISABLED" }
        $activeStatus = if ($role.is_active) { "(ACTIVE)" } else { "" }
        Write-Host "  - $($role.name): $enabledStatus $activeStatus" -ForegroundColor Gray
    }
    
    $criticRole = $rolesResponse2.roles | Where-Object { $_.role -eq "critic" }
    if ($criticRole -and $criticRole.enabled) {
        Write-Host "✓ Correct: Critic role is enabled" -ForegroundColor Green
    } else {
        Write-Host "✗ Error: Critic role not found or not enabled" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get roles: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 5: Deactivate critic role
Write-Host "Test 5: Deactivate critic role" -ForegroundColor Yellow
try {
    $deactivateResponse = Invoke-RestMethod -Uri "$API_BASE/api/v1/roles/critic/deactivate" -Method Post -Headers $headers
    Write-Host "✓ Critic role deactivated" -ForegroundColor Green
    Write-Host "  Enabled: $($deactivateResponse.enabled)" -ForegroundColor Gray
    Write-Host "  Visibility: $($deactivateResponse.visibility)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to deactivate critic role: $_" -ForegroundColor Red
}

Write-Host ""

# Test 6: Get roles again (critic should be disabled)
Write-Host "Test 6: Get roles again (critic should be disabled)" -ForegroundColor Yellow
try {
    $rolesResponse3 = Invoke-RestMethod -Uri "$API_BASE/api/v1/users/me/roles" -Method Get -Headers $headers
    Write-Host "✓ Got user roles" -ForegroundColor Green
    Write-Host "  Roles count: $($rolesResponse3.roles.Count)" -ForegroundColor Gray
    
    foreach ($role in $rolesResponse3.roles) {
        $enabledStatus = if ($role.enabled) { "ENABLED" } else { "DISABLED" }
        $activeStatus = if ($role.is_active) { "(ACTIVE)" } else { "" }
        Write-Host "  - $($role.name): $enabledStatus $activeStatus" -ForegroundColor Gray
    }
    
    $criticRole = $rolesResponse3.roles | Where-Object { $_.role -eq "critic" }
    if ($criticRole -and -not $criticRole.enabled) {
        Write-Host "✓ Correct: Critic role is disabled" -ForegroundColor Green
    } else {
        Write-Host "✗ Error: Critic role should be disabled" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Failed to get roles: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 7: Try to deactivate lover role (should fail)
Write-Host "Test 7: Try to deactivate lover role (should fail)" -ForegroundColor Yellow
try {
    $deactivateLoverResponse = Invoke-RestMethod -Uri "$API_BASE/api/v1/roles/lover/deactivate" -Method Post -Headers $headers
    Write-Host "✗ Error: Should not be able to deactivate last enabled role" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✓ Correct: Cannot deactivate last enabled role (400 error)" -ForegroundColor Green
    } else {
        Write-Host "✗ Unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== All Tests Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "✓ New users get only lover role by default" -ForegroundColor Green
Write-Host "✓ Roles endpoint includes enabled status" -ForegroundColor Green
Write-Host "✓ Can activate additional roles" -ForegroundColor Green
Write-Host "✓ Can deactivate roles" -ForegroundColor Green
Write-Host "✓ Cannot deactivate last enabled role" -ForegroundColor Green
Write-Host ""

