export interface EducationResource {
  id: string
  title: string
  description: string
  href: string
  type: 'presentation' | 'article' | 'video' | 'guide'
}

export const educationResources: EducationResource[] = [
  {
    id: 'ai-in-business',
    title: 'AI in Business',
    description: 'Beginner-friendly guide: how AI helps you be more productive, learn faster, and get started with Cursor.',
    href: '/education/ai-in-business.html',
    type: 'presentation',
  },
  {
    id: 'cursor-cheat-sheet',
    title: 'Cursor Cheat Sheet',
    description: 'Quick reference for Cursor shortcuts, commands, and tips. Available in English.',
    href: '/education/cursor-cheat-sheet-en.pdf',
    type: 'guide',
  },
]
