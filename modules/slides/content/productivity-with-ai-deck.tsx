import PromptBlock from '@/modules/slides/components/PromptBlock'
import { Slide } from '@/modules/slides/types'

export const productivityWithAiDeck: Slide[] = [
  {
    id: 1,
    title: 'Productivity with AI & Cursor',
    titleSize: 'large',
    content: (
      <div className="space-y-6">
        <p className="text-cursor-text-muted text-xl md:text-2xl">
          Learning. Execution. Examples. Understanding. Moving forward.
        </p>
        <p className="text-cursor-text-faint text-base md:text-lg">A practical guide</p>
      </div>
    ),
  },
  // --- Learning ---
  {
    id: 2,
    title: 'Learning',
    content: (
      <div className="space-y-6">
        <p>
          <strong>Who knows Stack Overflow?</strong> A platform where people share problems and collaborate to solve them.
        </p>
        <p>
          <strong>GPT</strong> changed the way we look for information. Information is easily accessible now.
        </p>
        <p className="text-cursor-text-muted">Knowledge is becoming less scarce.</p>
      </div>
    ),
  },
  // --- Execution, Productivity, Automation ---
  {
    id: 3,
    title: 'Execution, Productivity & Automation',
    content: (
      <div className="space-y-6">
        <p>
          <strong>Cursor, Claude, Codex</strong> — and the ecosystem of AI tools.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>LLM reasoning + access to tools</li>
          <li>Increase productivity by automating repetitive tasks</li>
          <li>Give an agent a task → it executes autonomously</li>
          <li>Spawn agents on event or timer → Cursor automations</li>
        </ul>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Demo: Cursor, Automations & Cloud Agents',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>Check Cursor interface</li>
          <li>Check automations and cloud agents</li>
        </ul>
      </div>
    ),
  },
  // --- Examples ---
  {
    id: 5,
    title: 'Why Cursor? Why Build?',
    content: (
      <div className="space-y-6">
        <p>
          <strong>Why use Cursor?</strong> To build things.
        </p>
        <p>
          <strong>Why build things?</strong> To solve problems.
        </p>
        <p>Solve problems for others → make money.</p>
        <p className="text-cursor-text-muted">Building your own product.</p>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Selling to People vs. Selling to Agents',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Selling to people</strong> → build UI
          </li>
          <li>
            <strong>Selling to agents</strong> → since most agents are LLMs, explain well with words how your product can be used. Provide APIs so agents can execute your functionality.
          </li>
          <li>
            <strong>Since most users are using agents</strong> → you want to sell to agents.
          </li>
        </ul>
        <p>
          <strong>MCPs</strong> — wrappers around AI, with descriptions so agents can decide when to invoke.
        </p>
        <p>
          <strong>Skills</strong> — explain how to leverage APIs.
        </p>
        <p>
          <strong>Plugins</strong> — if you&apos;re building a product and want users to interface through Cursor (LLM-first UI), submit a plugin to the Cursor marketplace.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: 'Paradigm Shift',
    content: (
      <div className="space-y-6">
        <p>New way of interacting with software: <strong>we explain the problem and AI solves it.</strong></p>
        <p className="text-cursor-text-muted">Much easier than understanding complex interfaces.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Design:</strong> Instead of learning Figma → use Cursor + Pencil.dev
          </li>
          <li>
            <strong>Video editing:</strong> Instead of Photoshop → use Cursor + Remotion
          </li>
          <li>
            <strong>Version control MCP (GitHub)</strong> — don&apos;t need to understand all the commands anymore.
          </li>
          <li>
            <strong>This presentation was built with Cursor.</strong> 🎯
          </li>
        </ul>
      </div>
    ),
  },
  // --- Understanding how LLMs work ---
  {
    id: 8,
    title: 'Understanding How LLMs Work',
    content: (
      <div className="space-y-6">
        <p>How to have better performing agents?</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cursor cheatsheet</strong> — shortcuts and tips
          </li>
          <li>
            Agents will use <code className="bg-cursor-surface px-1.5 py-0.5 rounded text-sm">AGENTS.md</code> to orient, then follow the specs and workflows (project-scaffold)
          </li>
          <li>
            <strong>Model routers</strong> — select the best underlying model for your task
          </li>
        </ul>
      </div>
    ),
  },
  // --- Moving forward ---
  {
    id: 9,
    title: 'Moving Forward',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cost vs. efficiency</strong>
          </li>
          <li>
            <strong>Security, reliability</strong>
          </li>
          <li>
            <strong>Human identity, purpose</strong>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 10,
    title: 'Questions?',
    content: (
      <div className="space-y-6">
        <p className="text-2xl">cursor.com</p>
      </div>
    ),
  },
]

export const totalProductivityWithAiSlides = productivityWithAiDeck.length
