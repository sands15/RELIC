# Developer Vault Guidance

## Ownership

This vault is the user's reusable cross-project development memory. Project
repositories own requirements, current state, architecture, implementation,
and verification evidence. This vault holds concise personal outcomes,
reusable learning, confirmed decisions, and links to those original sources.
See [[Decisions/2026-08-28-record-ownership]]. Use Markdown directly for ordinary
retrieval and editing; the Obsidian UI is not required.

## Retrieve and apply before deciding

- Start at `00_HOME.md` and the relevant `Projects/<project>.md` hub. Follow the
  latest confirmed applicable review and linked learning or decision relevant
  to the task; search task keywords when links are insufficient. Read matching
  sections progressively, never the whole vault or unrelated notes by default.
- Check date, confirmation, scope, and exact original source. Hubs and old Daily
  entries help retrieval; verify material current-state claims in the project
  before relying on them. Preserve unresolved or stale-source gaps.
- Link an applicable prior rule to the actual decision, preservation constraint,
  or validation it changes in the project's existing task record. Answer-only
  work stays in chat; do not create a task record or duplicate acceptance table.
  Give a reason for relevant but inapplicable items rather than inventing work.
- Distinguish retrieved/read, applied, verified, and user-experienced improvement.
  A note, installed instruction, or guidance edit does not prove later stages.
  [[Reviews/2026-W40]] provides the confirmed application and evidence criteria.

## Capture at verified checkpoints

- First record the verified result and its limits in the existing project
  task/worklog. Include the final revision or artifact, check environment,
  evidence level, remaining gap, and next action there. Do not wait for the
  whole experiment to finish: a blocked or stopped task can have a verified
  partial result without passing the experiment.
- Use one canonical `Daily/YYYY-MM-DD.md` per occurrence date in KST. Keep a
  concise outcome, reusable lesson or actually applied prior rule, exact project
  source document and section, evidence limit, and next checkpoint. Append once
  by that exact project-source reference, update an existing item for a
  correction, and retain independent same-day outcomes. If discovered later,
  use the occurrence date and state the discovery date when useful.
- Keep detailed project state and evidence in the project. Use project-relative
  source paths and vault-name Obsidian URIs; never local absolute paths. Update
  `Projects/<project>.md` only when navigation, learning links, or the personal
  next checkpoint changes. Promote to `Learnings/` or `Decisions/` only for a
  durable cross-project use not already owned by an existing note.
- Ordinary verified factual Daily capture needs no new human-confirmation gate.
  Publish review or decision notes only after human confirmation. `status: draft`
  or `confirmed: false` remains local-only and must not be linked from a
  published note. Do not auto-confirm a draft or publish an unconfirmed decision
  through a Daily summary.
- At a handoff or stop, reconcile eligible checkpoints with Daily entries and
  exact source links. Explain missing capture, unresolved source, or a publication
  blocker in the existing task record. Skip trivial questions, commands, retries,
  temporary errors, and work with no durable verified change.

## Preservation and publication

- Preserve user-owned Inbox content, existing notes, drafts, unrelated dirty
  work, YAML frontmatter, and Obsidian links. Do not delete or promote Inbox
  items without review or silently change confirmation status.
- This vault is published in the public `sands15/RELIC` repository. Treat every
  saved note as public. Never store credentials, secrets, private data,
  transcripts, audio, screenshots, logs, runtime artifacts, or raw memory
  contents; never copy an Evelyn runtime-memory note here.
- Before an allowed manual publication, run
  `../tools/Sync-DeveloperVault.ps1 -RefreshNavigation -Check` from this vault.
  This updates only the recent Daily home link and validates public content;
  it does not commit or push. `-Check` is read-only and rejects a stale recent
  Daily link. Ordinary existing sync updates that link before validation and
  publication of eligible Markdown; it grants no new publication authority.
- Report public-check results and actual commit/push separately. Check success
  does not prove publication, later retrieval, or improved user experience.
  Do not add hooks, services, plugins, schedules, or model changes for this loop.
