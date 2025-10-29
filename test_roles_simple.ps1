$API_URL = "http://localhost:8000/api/v1"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "testuser_$timestamp@example.com"
$password = "TestPassword123!"
$name = "Test User $timestamp"

Write-Host "Creating new user: $email"

$signupBody = @{
    email = $email
    password = $password
    name = $name
} | ConvertTo-Json

$signupResponse = Invoke-WebRequest -Uri "$API_URL/auth/signup" -Method Post -Headers @{"Content-Type" = "application/json"} -Body $signupBody
$signupData = $signupResponse.Content | ConvertFrom-Json
$token = $signupData.access_token

Write-Host "Signup successful!"
Write-Host "Token: $($token.Substring(0, 50))..."

Write-Host "Fetching user roles..."
$rolesResponse = Invoke-WebRequest -Uri "$API_URL/users/me/roles" -Method Get -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
$rolesData = $rolesResponse.Content | ConvertFrom-Json

Write-Host "Roles Response:"
$rolesData | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "Total roles: $($rolesData.roles.Count)"
Write-Host "Active role: $($rolesData.active_role)"

