# Developer Vault Guidance

## Scope

This vault is the user's cross-project personal development record. Project repositories remain the source of truth for requirements, implementation state, architecture, tests, and operational evidence.

## Capture

- Record only verified personal outcomes, reusable learning, personal workflow or tooling decisions, and the next personal development action.
- Use `Daily/YYYY-MM-DD.md` for concise session records.
- Update `Projects/<project>.md` only when the personal index, learning links, or personal next checkpoint changes.
- Promote an item to `Learnings/` or `Decisions/` only when it is durable beyond one task.
- Reference the project source instead of copying project state or evidence.
- Skip trivial questions, commands, retries, temporary errors, and work that produced no durable change.
- Publish review or decision notes only after user confirmation. Markdown with `status: draft` or `confirmed: false` remains local-only and must not be linked from a published note.

## Privacy

- Never store credentials, secrets, private data, transcripts, audio, screenshots, logs, runtime artifacts, or raw memory contents.
- Do not copy an Evelyn runtime-memory note into this vault.
- Preserve user-owned Inbox items. Do not delete or promote them without review.
- This vault is published in the public `sands15/RELIC` repository. Treat every saved note as public.
- Use project-relative source paths and vault-name Obsidian URIs. Never publish local absolute paths.
- Run `..\tools\Sync-DeveloperVault.ps1 -Check` before a manual commit or push.

## Working method

- Start at `00_HOME.md`; search only the relevant project or learning note.
- Keep notes concise and preserve YAML frontmatter and Obsidian links.
- Do not create a second copy of a project's current-state document.
