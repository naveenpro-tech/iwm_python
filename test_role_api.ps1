# Test Role API Endpoints

$baseUrl = "http://localhost:8000/api/v1"

# Test 1: Create a new user via signup
Write-Host "=== Test 1: Signup ===" -ForegroundColor Green
$signupBody = @{
    email = "roletest2_$(Get-Random)@example.com"
    password = "TestPassword123"
    name = "Role Test User 2"
} | ConvertTo-Json

$signupResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/signup" `
    -Method POST `
    -ContentType "application/json" `
    -Body $signupBody

$signupData = $signupResponse.Content | ConvertFrom-Json
$token = $signupData.access_token
Write-Host "Signup successful! Token: $($token.Substring(0, 50))..."
Write-Host ""

# Test 2: Get user roles
Write-Host "=== Test 2: Get User Roles ===" -ForegroundColor Green
$rolesResponse = Invoke-WebRequest -Uri "$baseUrl/users/me/roles" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

$rolesData = $rolesResponse.Content | ConvertFrom-Json
Write-Host "Roles Response:"
Write-Host ($rolesData | ConvertTo-Json -Depth 10)
Write-Host ""

# Test 3: Get active role
Write-Host "=== Test 3: Get Active Role ===" -ForegroundColor Green
$activeRoleResponse = Invoke-WebRequest -Uri "$baseUrl/users/me/active-role" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

$activeRoleData = $activeRoleResponse.Content | ConvertFrom-Json
Write-Host "Active Role Response:"
Write-Host ($activeRoleData | ConvertTo-Json -Depth 10)
Write-Host ""

# Test 4: Try to switch to invalid role (should fail)
Write-Host "=== Test 4: Try Invalid Role (Should Fail) ===" -ForegroundColor Yellow
try {
    $invalidRoleBody = @{ role = "critic" } | ConvertTo-Json
    $invalidRoleResponse = Invoke-WebRequest -Uri "$baseUrl/users/me/active-role" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        } `
        -Body $invalidRoleBody
} catch {
    Write-Host "Expected error: $($_.Exception.Response.StatusCode)"
    Write-Host ($_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10)
}
Write-Host ""

Write-Host "=== All Tests Complete ===" -ForegroundColor Green

