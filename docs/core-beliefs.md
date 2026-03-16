# Core Beliefs

Agent-first operating principles for Cursor Community Serbia.

## On Specifications

- Specs are the source of truth for design intent.
- Specs are living documents — update them when code changes.
- Every spec must be verifiable (linked to tests or manual checks).
- When specs and code conflict, fix the code or update the spec with rationale.

## On Planning

- Create a plan before implementing complex or multi-system work.
- Plans are self-contained — a novice should be able to execute from the plan alone.
- Plans are living — track progress, surprises, and decisions as you go.
- If touching 2+ systems or 5+ files, create or update a plan in `docs/plans/active/`.

## On Quality

- Verification over trust — demonstrate that behavior matches intent.
- Grades in `docs/quality.md` reflect reality; update after each phase.
- Fix the system, not the symptom — address root causes.
- Observable outcomes over subjective judgement.

## On Context

- Context is scarce — keep docs slim and pointer-based.
- The repository is the memory — write important decisions to disk.
- Stale docs are dangerous — update or remove when things change.
- AGENTS.md is the map; rules enforce behavior.

## On Implementation

- Depth-first — finish one system before starting another.
- Small, verifiable steps — each change should be testable.
- Idempotent and safe — changes should be reversible.
- Read the spec before coding — specs live in `specs/`.

## On Simplicity

- Design for removal — avoid unnecessary abstraction.
- Document selectively — only what agents and humans need.
- Start simple — add complexity only when justified.
