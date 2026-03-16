import PromptBlock from '@/modules/slides/components/PromptBlock'
import { Slide } from '@/modules/slides/types'

export const productivityWithAiDeck: Slide[] = [
  {
    id: 1,
    title: 'Productivity with AI & Cursor',
    content: (
      <div className="space-y-6">
        <p className="text-cursor-text-muted text-xl md:text-2xl">Be more productive at work. Learn faster. A practical guide.</p>
        <p className="text-cursor-text-faint text-base md:text-lg">From AI evolution to working smarter with Cursor</p>
      </div>
    ),
  },
  {
    id: 2,
    title: 'A Quick Look at AI Evolution',
    content: (
      <div className="space-y-6">
        <p>
          <strong>AI has evolved fast.</strong> From early experiments to tools that understand and generate text, answer
          questions, and assist with real tasks.
        </p>
        <p className="text-cursor-text-muted">
          Think of it like having a very fast assistant who&apos;s read a lot and can help whenever you ask.
        </p>
        <p>
          You&apos;ve probably seen it: <strong>ChatGPT</strong>, Google Assistant, Grammarly, Smart Reply in Gmail.
        </p>
        <p className="text-cursor-text-muted">No coding needed.</p>
      </div>
    ),
  },
  {
    id: 3,
    title: 'AI in Everyday Life',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>Writing emails and reports</li>
          <li>Summarising documents</li>
          <li>Suggesting text (autocomplete)</li>
          <li>Answering questions quickly</li>
          <li>Helping with study and learning</li>
        </ul>
        <p>
          <strong>Main idea:</strong> AI speeds up repetitive work so you can focus on thinking and deciding.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: 'How AI Helps You Be More Productive',
    content: (
      <div className="space-y-6">
        <p>Before: blank page → you write everything from scratch.</p>
        <p>With AI: you get a first draft → you edit and improve.</p>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Everyday Productivity',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Email / report:</strong> AI drafts, you adjust and personalise.
          </li>
          <li>
            <strong>Long document:</strong> AI summarises; you read the summary.
          </li>
          <li>
            <strong>Ideas / planning:</strong> AI structures and groups; you refine.
          </li>
          <li>
            <strong>Exam prep:</strong> AI explains topics or gives practice questions.
          </li>
          <li>
            <strong>Cover letters:</strong> AI adapts one base text for each job.
          </li>
        </ul>
        <p className="text-cursor-text-muted">You still decide what goes out the door.</p>
      </div>
    ),
  },
  {
    id: 6,
    title: 'How AI Helps You Learn Faster',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>&quot;Explain like I&apos;m X&quot;</strong> — adjust the level to you.
          </li>
          <li>
            <strong>Ask while you work</strong> — no need to switch to Google.
          </li>
          <li>
            <strong>Practice questions</strong> — &quot;Give me 5 questions on this topic.&quot;
          </li>
          <li>
            <strong>Clarify jargon</strong> — &quot;What does this mean in simple words?&quot;
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 7,
    title: 'Cursor: AI While You Work',
    content: (
      <div className="space-y-6">
        <p>Cursor is an AI-powered editor that sits inside your workflow.</p>
        <p className="text-cursor-text-muted">Chat with AI while you write, code, or plan — with full context of your files.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Chat panel always available</li>
          <li>AI sees your files and context</li>
          <li>Ask &quot;explain this&quot; or &quot;improve this&quot;</li>
          <li>Works for text, code, and docs</li>
        </ul>
      </div>
    ),
  },
  {
    id: 8,
    title: 'What You Can Do with Cursor',
    content: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Draft content</strong> — emails, reports, essays
          </li>
          <li>
            <strong>Summarise</strong> — long docs, meeting notes
          </li>
          <li>
            <strong>Explain</strong> — code, concepts, assignments
          </li>
          <li>
            <strong>Refactor</strong> — make text or code clearer
          </li>
          <li>
            <strong>Plan</strong> — structure projects and ideas
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 9,
    title: 'Live Demo',
    content: (
      <div className="space-y-6">
        <PromptBlock prompt="Summarise this in 3 bullet points." />
        <div className="space-y-2 text-cursor-text-muted text-sm">
          <p>Also try:</p>
          <p>&quot;Make this easier to understand.&quot;</p>
          <p>&quot;Explain what this means in simple words.&quot;</p>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    title: 'Getting Started',
    content: (
      <div className="space-y-6">
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Try ChatGPT</strong> for a few everyday tasks
          </li>
          <li>
            <strong>Use AI once this week</strong> — email, summary, study help
          </li>
          <li>
            <strong>Try Cursor</strong> if you work with text or code
          </li>
        </ol>
        <p>
          <strong>Tip:</strong> Be specific when you ask. The better your prompt, the better the result.
        </p>
      </div>
    ),
  },
  {
    id: 11,
    title: 'One Tip for Better Results',
    content: (
      <div className="space-y-6">
        <p>
          <strong>Be specific.</strong>
        </p>
        <p>Instead of: &quot;Make this better.&quot;</p>
        <p>Try: &quot;Make this shorter and easier for beginners to read.&quot;</p>
      </div>
    ),
  },
  {
    id: 12,
    title: 'Questions?',
    content: (
      <div className="space-y-6">
        <p className="text-2xl">cursor.com</p>
      </div>
    ),
  },
]

export const totalProductivityWithAiSlides = productivityWithAiDeck.length
