param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('max', 'tg')]
    [string] $Tool
)

$ErrorActionPreference = 'Stop'
$testRoot = Join-Path $env:RUNNER_TEMP "WireCat install $Tool"
$prefix = Join-Path $testRoot 'npm prefix'
$package = "@leemour/$Tool-cli"
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
& npm.cmd install --global --prefix $prefix $spec
if ($LASTEXITCODE -ne 0) { throw 'Global installation failed' }

# A fresh custom prefix reproduces a successful install without a PATH entry.
if (Get-Command $Tool -ErrorAction SilentlyContinue) { throw 'Expected CLI to be absent from PATH' }
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

# The landing page's fallback works even while the global prefix is absent from PATH.
$execVersion = & npm.cmd exec --yes "--package=$spec" -- $Tool --version
if ($LASTEXITCODE -ne 0 -or "$execVersion".Trim() -ne $version) { throw 'npm exec without global PATH failed' }

$env:Path = "$prefix;$env:Path"
& "$Tool.cmd" --version
if ($LASTEXITCODE -ne 0) { throw 'CLI failed after adding the prefix to this shell PATH' }
