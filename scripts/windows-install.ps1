param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('max', 'tg')]
    [string] $Tool
)

$ErrorActionPreference = 'Stop'
$testRoot = Join-Path $env:RUNNER_TEMP "WireCat install $Tool"
$prefix = Join-Path $testRoot 'npm prefix'
$package = "@wirecat/$Tool-cli"
$env:CI = 'true'
foreach ($name in @('CONFIG', 'STATE', 'CACHE')) {
    [Environment]::SetEnvironmentVariable("$($Tool.ToUpper())_${name}_DIR", (Join-Path $testRoot $name), 'Process')
}
$env:MESSAGING_STORE = Join-Path $testRoot 'messages.db'

# Use the current published version, fixed for every invocation in this job.
$versionOutput = & npm.cmd view $package version
if ($LASTEXITCODE -ne 0) { throw 'Could not resolve the published version' }
$version = "$versionOutput".Trim()
$spec = "${package}@$version"
Write-Output "Checking $spec on Node $(& node --version)"
if (Get-Command $Tool -ErrorAction SilentlyContinue) { throw 'Expected CLI to be absent from PATH' }
$installer = Join-Path $PSScriptRoot '../public/install.ps1'
$ready = & $installer -Tool $Tool -Prefix $prefix -PackageSpec $spec -Agent all -Json
if ($LASTEXITCODE -ne 0) { throw 'Windows installer failed' }
$ready = ($ready -join "`n") | ConvertFrom-Json
if ($ready.tool -ne $Tool -or $ready.written.Count -ne 2) { throw 'Installer did not install agent instructions' }
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (-not $userPath.Contains($prefix)) { throw 'Installer did not persist user PATH' }
$directVersion = & $Tool --version
if ($LASTEXITCODE -ne 0 -or "$directVersion".Trim() -ne $version) { throw 'Bare CLI command is not ready' }
if (Test-Path (Join-Path $prefix "$Tool.ps1")) { throw 'Generated PowerShell shim still shadows the command launcher' }

$shim = Join-Path $prefix "$Tool.cmd"
$installedVersion = & $shim --version
if ($LASTEXITCODE -ne 0 -or "$installedVersion".Trim() -ne $version) { throw 'Installed CLI version does not match npm' }
& $shim --help
if ($LASTEXITCODE -ne 0) { throw 'Installed CLI help failed' }
foreach ($command in @('doctor', 'commands')) {
    $json = & $shim $command --json
    if ($LASTEXITCODE -ne 0) { throw "Installed CLI failed: $command" }
    $result = ($json -join "`n") | ConvertFrom-Json
    if ($null -eq $result) { throw "Installed CLI returned no JSON: $command" }
}

# Create only an empty test database; migration exercises SQLite without logging in.
[System.IO.File]::WriteAllBytes($env:MESSAGING_STORE, [byte[]]@())
& $shim store migrate --json
if ($LASTEXITCODE -ne 0) { throw 'Store migration failed' }
$storeJson = & $shim store info --json
if ($LASTEXITCODE -ne 0) { throw 'Store info failed' }
$store = ($storeJson -join "`n") | ConvertFrom-Json
if ($store.error -or -not $store.exists -or $store.schema.version -lt 1 -or -not $store.schema.writable) {
    throw "SQLite store is unusable: $storeJson"
}
if ([System.IO.Path]::GetFullPath($store.path) -ne [System.IO.Path]::GetFullPath($env:MESSAGING_STORE)) {
    throw 'CLI opened a store outside the test directory'
}

# GitHub-hosted runners have disposable home directories; no account session is present.
$skillJson = & $shim skill install --json
if ($LASTEXITCODE -ne 0) { throw 'Skill installation failed' }
$skill = ($skillJson -join "`n") | ConvertFrom-Json
if ($skill.version -ne $version -or $skill.written.Count -ne 2) { throw 'Skill installation result is incomplete' }
$skillContents = @{}
foreach ($file in $skill.written) {
    $content = Get-Content -LiteralPath $file -Raw -Encoding UTF8
    if ($content -notmatch "(?m)^name: $Tool-cli\r?$" -or $content.Length -lt 100) { throw "Invalid skill: $file" }
    $skillContents[$file] = $content
}
& $shim skill install --json
if ($LASTEXITCODE -ne 0) { throw 'Repeated skill installation failed' }
foreach ($file in $skillContents.Keys) {
    if ((Get-Content -LiteralPath $file -Raw -Encoding UTF8) -cne $skillContents[$file]) {
        throw "Repeated installation changed the skill: $file"
    }
}

# Simulate a newly opened terminal with only persistent PATH values.
$powershell = (Get-Command powershell.exe).Source
$env:Path = [Environment]::ExpandEnvironmentVariables("$([Environment]::GetEnvironmentVariable('Path', 'Machine'));$userPath")
& $powershell -NoProfile -ExecutionPolicy Restricted -Command "$Tool --version; if (`$LASTEXITCODE -ne 0) { exit 1 }; $Tool skill show | Out-Null; if (`$LASTEXITCODE -ne 0) { exit 1 }"
if ($LASTEXITCODE -ne 0) { throw 'Fresh restricted PowerShell cannot run the installed command' }
Write-Output "PASS: $spec persistent/current PATH, bare launch, automatic skills, JSON and SQLite"
