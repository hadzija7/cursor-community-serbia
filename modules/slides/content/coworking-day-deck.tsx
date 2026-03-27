import { Slide } from '@/modules/slides/types'

export const coworkingDayDeck: Slide[] = [
  {
    id: 1,
    title: 'Cursor Coworking Day',
    titleSize: 'large',
    content: (
      <div className="space-y-6">
        <p className="text-cursor-text-muted text-xl md:text-2xl">
          Warm up, build together, share what you ship.
        </p>
        <p className="text-cursor-text-faint text-base md:text-lg">Cursor Community Serbia</p>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Cursor basics & interface',
    content: (
      <div className="space-y-5">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Sidebar</strong> — files, search, Git, extensions
          </li>
          <li>
            <strong>Editor</strong> — tabs, splits, inline diffs when the agent edits code
          </li>
          <li>
            <strong>Agent / Chat</strong> — plan and execute tasks across the repo
          </li>
          <li>
            <strong>Terminal</strong> — run commands where the agent can see output
          </li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          Use <code className="bg-cursor-surface px-1.5 py-0.5 rounded">@</code> to pull in files, folders,
          docs, or the whole codebase so the model has the right context.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Tips & tricks',
    content: (
      <div className="space-y-5">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Project rules</strong> — <code className="bg-cursor-surface px-1 rounded text-sm">.cursor/rules</code>,{' '}
            <code className="bg-cursor-surface px-1 rounded text-sm">AGENTS.md</code> for how agents should work in this repo
          </li>
          <li>
            <strong>Composer / multi-file edits</strong> — one instruction, coordinated changes
          </li>
          <li>
            <strong>MCP</strong> — connect tools (browser, GitHub, databases) the agent can call safely
          </li>
          <li>
            <strong>Plans & checkpoints</strong> — break a big task into steps; review before running destructive commands
          </li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          Prefer explicit context (@file, @folder) over huge pasted blobs — smaller, sharper prompts often work better.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Brainstorming — what should we build today?',
    content: (
      <div className="space-y-5">
        <p>
          <strong>~30 minutes</strong> — share ideas in the room: what do you want to ship or explore before show-and-tell?
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Problems you want to solve, tools you want to try, or spikes worth a few hours</li>
          <li>Short pitches OK — we&apos;ll cluster themes and people can pair or solo</li>
          <li>No wrong answers — the goal is a shared menu of builds, not a perfect plan</li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          Capture themes on a board or shared doc if you have one — then pick something small enough to demo.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Build idea: plugins for Cursor',
    content: (
      <div className="space-y-5">
        <p>
          Plugins extend the editor with new capabilities — often via{' '}
          <strong>MCP servers</strong> that expose tools with clear descriptions for the model.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Wrap an API or internal service as a tool the agent can invoke</li>
          <li>Reuse community MCP servers before writing your own</li>
          <li>Document expected arguments and failure modes so calls stay reliable</li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          Today&apos;s stretch goal: sketch a plugin that solves one pain in your real workflow.
        </p>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Build idea: agent memory + graphs',
    content: (
      <div className="space-y-5">
        <p>
          Long-running agents need <strong>durable memory</strong> beyond the current chat window — decisions,
          conventions, and facts that should survive the next session.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Structured memory</strong> — specs, ADRs, <code className="bg-cursor-surface px-1 rounded text-sm">AGENTS.md</code>, annotated docs in-repo
          </li>
          <li>
            <strong>Graphs</strong> — entities (services, people, tickets) and relationships; query structure, let the LLM reason over summaries
          </li>
          <li>
            <strong>Combine</strong> — graph for &quot;what connects to what&quot; + retrieval for &quot;what did we write about it&quot;
          </li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          Experiment: model a tiny domain (e.g. your app modules) as nodes and edges, then ask the agent questions across it.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: 'Build idea: personal knowledge — Obsidian + Cursor',
    content: (
      <div className="space-y-5">
        <p>
          <strong>PKM on disk:</strong> keep notes, links, and structure in{' '}
          <strong>Obsidian</strong> (wikilinks, graph, daily notes). Open the same vault folder in{' '}
          <strong>Cursor</strong> and use the agent on Markdown — refactor notes, draft summaries, extract tasks, keep{' '}
          <code className="bg-cursor-surface px-1 rounded text-sm">AGENTS.md</code> / rules so edits match how you think.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Vault = single source of truth; Cursor = batch edits, codegen for plugins/skills, semantic search across files</li>
          <li>Skills or small scripts in the vault can encode repeatable workflows (e.g. meeting → note template)</li>
          <li>Good day-one experiment: one folder of notes + &quot;tidy and link these five files&quot; with @folder context</li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          You don&apos;t need a perfect system — align naming, one index note, and let the agent help maintain links and structure.
        </p>
      </div>
    ),
  },
  {
    id: 8,
    title: 'Your build & show-and-tell',
    content: (
      <div className="space-y-5">
        <p>
          <strong>Pick something small</strong> — a script, a UI fix, a skill, a design pass, or a spike on memory/graphs.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Time-box: aim for a demo, not perfection</li>
          <li>End of day: <strong>quick presentations</strong> — what you built, what blocked you, what you&apos;d try next</li>
        </ul>
        <p className="text-cursor-text-muted text-sm md:text-base">
          Questions? Pair up — the room is the best model context you have.
        </p>
      </div>
    ),
  },
]

export const totalCoworkingDaySlides = coworkingDayDeck.length
