[CmdletBinding()]
param(
    [switch]$Watch,
    [switch]$Check,
    [switch]$SelfTest,
    [ValidateRange(2, 60)]
    [int]$PollSeconds = 2,
    [ValidateRange(4, 120)]
    [int]$DebounceSeconds = 8
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script:RepoRoot = Split-Path -Parent $PSScriptRoot
$script:VaultRoot = Join-Path $script:RepoRoot 'developer-vault'
$script:MarkdownPathspecs = @(
    ':(top,glob)developer-vault/*.md',
    ':(top,glob)developer-vault/**/*.md'
)
$script:BlockedPatterns = [ordered]@{
    'local absolute path' = '(?i)(?:\b[A-Z]:[\\/]|file:///?[A-Z]:/|obsidian://open\?path=)'
    'email address' = '(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b'
    'private key' = '(?i)-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'
    'credential assignment' = '(?i)\b(?:api[_-]?key|secret|token|password|passwd)\s*[:=]\s*["''`]?[A-Za-z0-9_./+=-]{8,}'
    'GitHub token' = '(?i)\bgh[pousr]_[A-Za-z0-9]{20,}\b'
    'OpenAI-style key' = '(?i)\bsk-[A-Za-z0-9_-]{16,}\b'
    'bearer authorization' = '(?i)\bAuthorization\s*:\s*Bearer\s+\S+'
    'AWS access key' = '\bAKIA[0-9A-Z]{16}\b'
    'URL credential' = '(?i)https?://[^/\s:@]+:[^/\s@]+@'
    'non-public visibility' = '(?i)\bvisibility\s*:\s*(?:private|internal|secret)\b'
}
$script:AllowedSettings = @(
    'developer-vault/.obsidian/app.json',
    'developer-vault/.obsidian/appearance.json',
    'developer-vault/.obsidian/community-plugins.json',
    'developer-vault/.obsidian/core-plugins.json',
    'developer-vault/.obsidian/daily-notes.json',
    'developer-vault/.obsidian/templates.json'
)

function Invoke-Git {
    param([Parameter(Mandatory)][string[]]$Arguments)

    $output = @(& git -C $script:RepoRoot @Arguments 2>&1)
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed:`n$($output -join [Environment]::NewLine)"
    }
    return $output
}

function Get-BlockedRule {
    param([Parameter(Mandatory)][string]$Text)

    foreach ($entry in $script:BlockedPatterns.GetEnumerator()) {
        if ($Text -match $entry.Value) {
            return $entry.Key
        }
    }
    return $null
}

function Test-AllowedTrackedPath {
    param([Parameter(Mandatory)][string]$Path)

    $normalized = $Path.Replace('\', '/')
    return $normalized.StartsWith('developer-vault/', [System.StringComparison]::OrdinalIgnoreCase) -and (
        $normalized.EndsWith('.md', [System.StringComparison]::OrdinalIgnoreCase) -or
        $normalized -in $script:AllowedSettings
    )
}

function Test-PublicVault {
    $errors = [System.Collections.Generic.List[string]]::new()
    $required = @('00_HOME.md', 'AGENTS.md', 'Projects\Evelyn.md', 'Templates\Daily.md')

    foreach ($relativePath in $required) {
        if (-not (Test-Path -LiteralPath (Join-Path $script:VaultRoot $relativePath))) {
            $errors.Add("missing required file: $relativePath")
        }
    }

    $obsidianRoot = (Join-Path $script:VaultRoot '.obsidian') + '\'
    $trashRoot = (Join-Path $script:VaultRoot '.trash') + '\'
    $markdownFiles = @(Get-ChildItem -LiteralPath $script:VaultRoot -Recurse -File -Filter '*.md' | Where-Object {
        -not $_.FullName.StartsWith($obsidianRoot, [System.StringComparison]::OrdinalIgnoreCase) -and
        -not $_.FullName.StartsWith($trashRoot, [System.StringComparison]::OrdinalIgnoreCase)
    })
    $noteKeys = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($file in $markdownFiles) {
        $relative = $file.FullName.Substring($script:VaultRoot.Length + 1).Replace('\', '/')
        [void]$noteKeys.Add($relative.Substring(0, $relative.Length - 3))
        [void]$noteKeys.Add([System.IO.Path]::GetFileNameWithoutExtension($file.Name))
    }

    foreach ($file in $markdownFiles) {
        $relative = $file.FullName.Substring($script:VaultRoot.Length + 1).Replace('\', '/')
        $content = Get-Content -LiteralPath $file.FullName -Raw
        $blockedRule = Get-BlockedRule -Text $content
        if ($blockedRule) {
            $errors.Add("${relative}: blocked $blockedRule")
        }

        foreach ($match in [regex]::Matches($content, '\[\[([^\]|#]+)')) {
            $target = $match.Groups[1].Value.Trim().Replace('\', '/')
            if ($target.EndsWith('.md', [System.StringComparison]::OrdinalIgnoreCase)) {
                $target = $target.Substring(0, $target.Length - 3)
            }
            if (-not $noteKeys.Contains($target) -and -not $noteKeys.Contains([System.IO.Path]::GetFileName($target))) {
                $errors.Add("${relative}: broken wiki link $target")
            }
        }
    }

    foreach ($trackedPath in @(Invoke-Git -Arguments @('ls-files', '--', 'developer-vault'))) {
        if (-not (Test-AllowedTrackedPath -Path $trackedPath)) {
            $errors.Add("tracked file is outside the public allowlist: $trackedPath")
        }
    }
    foreach ($stageLine in @(Invoke-Git -Arguments @('ls-files', '--stage', '--', 'developer-vault'))) {
        if ($stageLine -match '^120000\s') {
            $errors.Add('tracked symlink is not allowed in developer-vault')
        }
    }

    if ($errors.Count -gt 0) {
        throw "Developer Vault public check failed:`n- $($errors -join "`n- ")"
    }
}

function Test-StagedVault {
    $arguments = @('diff', '--cached', '--name-only', '--diff-filter=ACMR', '--') + $script:MarkdownPathspecs
    foreach ($path in @(Invoke-Git -Arguments $arguments)) {
        if (-not (Test-AllowedTrackedPath -Path $path)) {
            throw "Staged path is outside the public allowlist: $path"
        }
        $content = (@(& git -C $script:RepoRoot show ":$path" 2>&1) -join "`n")
        if ($LASTEXITCODE -ne 0) {
            throw "Could not inspect staged file: $path"
        }
        $blockedRule = Get-BlockedRule -Text $content
        if ($blockedRule) {
            throw "Staged file has blocked ${blockedRule}: $path"
        }
    }
}

function Test-OutgoingVault {
    foreach ($commit in @(Invoke-Git -Arguments @('rev-list', 'origin/main..HEAD'))) {
        if (-not $commit) { continue }
        $parentOutput = @(Invoke-Git -Arguments @('rev-list', '--parents', '-n', '1', $commit))
        $parents = ($parentOutput[0] -split '\s+').Count - 1
        if ($parents -gt 1) {
            throw "Outgoing merge commit is not allowed: $commit"
        }
        foreach ($path in @(Invoke-Git -Arguments @('diff-tree', '--no-commit-id', '--name-only', '-r', $commit))) {
            if (-not (Test-AllowedTrackedPath -Path $path)) {
                throw "Outgoing commit $commit contains a blocked path: $path"
            }

            $objectName = "${commit}:$path"
            & git -C $script:RepoRoot cat-file -e $objectName 2>$null
            if ($LASTEXITCODE -ne 0) { continue }

            $treeEntry = @(Invoke-Git -Arguments @('ls-tree', $commit, '--', $path))
            if ($treeEntry.Count -gt 0 -and $treeEntry[0] -match '^120000\s') {
                throw "Outgoing commit $commit contains a symlink: $path"
            }

            $content = (@(& git -C $script:RepoRoot show $objectName 2>&1) -join "`n")
            if ($LASTEXITCODE -ne 0) {
                throw "Could not inspect outgoing file: $objectName"
            }
            $blockedRule = Get-BlockedRule -Text $content
            if ($blockedRule) {
                throw "Outgoing commit $commit has blocked $blockedRule in $path"
            }
        }
    }
}

function Get-VaultStatus {
    return @(Invoke-Git -Arguments (@('-c', 'core.quotepath=false', 'status', '--porcelain=v1', '--untracked-files=all', '--') + $script:MarkdownPathspecs))
}

function Get-MarkdownFingerprint {
    $markdownStatus = @(Get-VaultStatus) | Where-Object { $_ -match '\.md"?$' }
    if ($markdownStatus.Count -eq 0) { return $null }

    $stamps = @(Get-ChildItem -LiteralPath $script:VaultRoot -Recurse -File -Filter '*.md' | Where-Object {
        $_.FullName -notmatch '[\\/]\.obsidian[\\/]' -and $_.FullName -notmatch '[\\/]\.trash[\\/]'
    } | ForEach-Object {
        "$($_.FullName.Substring($script:VaultRoot.Length + 1))|$($_.Length)|$($_.LastWriteTimeUtc.Ticks)"
    })
    return ((@($markdownStatus | Sort-Object) + @($stamps | Sort-Object)) -join "`n")
}

function Invoke-VaultSync {
    param([Parameter(Mandatory)][string]$Reason)

    $syncMutex = [System.Threading.Mutex]::new($false, 'Local\RELICDeveloperVaultSync')
    if (-not $syncMutex.WaitOne(0)) {
        $syncMutex.Dispose()
        return
    }

    try {
        Test-PublicVault
        [void](Invoke-Git -Arguments (@('add', '-A', '--') + $script:MarkdownPathspecs))
        Test-PublicVault
        Test-StagedVault
        $pathspecs = $script:MarkdownPathspecs
        & git -C $script:RepoRoot diff --quiet -- @pathspecs
        if ($LASTEXITCODE -ne 0) {
            throw 'Markdown changed during validation; retry after the save finishes.'
        }
        $staged = @(Invoke-Git -Arguments (@('diff', '--cached', '--name-only', '--') + $script:MarkdownPathspecs))
        if ($staged.Count -gt 0) {
            $message = "docs: sync developer vault ($Reason) $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            [void](Invoke-Git -Arguments (@('commit', '--only', '-m', $message, '--') + $script:MarkdownPathspecs))
        }

        $aheadOutput = @(Invoke-Git -Arguments @('rev-list', '--count', '@{upstream}..HEAD'))
        $ahead = [int]$aheadOutput[0]
        if ($ahead -gt 0) {
            Test-OutgoingVault
            [void](Invoke-Git -Arguments @('push', 'origin', 'HEAD:main'))
        }
    }
    finally {
        [void]$syncMutex.ReleaseMutex()
        $syncMutex.Dispose()
    }
}

if ($SelfTest) {
    if (Get-BlockedRule -Text 'safe project-relative source: docs/worklog/2026-08-28.md') {
        throw 'Safe sample was blocked.'
    }
    if (-not (Get-BlockedRule -Text 'password=not-a-real-secret')) {
        throw 'Credential sample was not blocked.'
    }
    Write-Output 'SELF_TEST_OK'
    exit 0
}

if ($Check) {
    Test-PublicVault
    Test-StagedVault
    Test-OutgoingVault
    Write-Output 'PUBLIC_VAULT_CHECK_OK'
    exit 0
}

if (-not $Watch) {
    Invoke-VaultSync -Reason 'daily'
    exit 0
}

$watchMutex = [System.Threading.Mutex]::new($false, 'Local\RELICDeveloperVaultWatcher')
if (-not $watchMutex.WaitOne(0)) {
    $watchMutex.Dispose()
    exit 0
}

try {
    Invoke-VaultSync -Reason 'startup'
    $lastFingerprint = $null
    $deadline = $null
    while ($true) {
        $fingerprint = Get-MarkdownFingerprint
        if ($null -eq $fingerprint) {
            $lastFingerprint = $null
            $deadline = $null
        }
        elseif ($fingerprint -ne $lastFingerprint) {
            $lastFingerprint = $fingerprint
            $deadline = (Get-Date).AddSeconds($DebounceSeconds)
        }
        elseif ($null -ne $deadline -and (Get-Date) -ge $deadline) {
            Invoke-VaultSync -Reason 'auto'
            $lastFingerprint = $null
            $deadline = $null
        }
        Start-Sleep -Seconds $PollSeconds
    }
}
finally {
    [void]$watchMutex.ReleaseMutex()
    $watchMutex.Dispose()
}
