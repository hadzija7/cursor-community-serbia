export interface EducationResource {
  id: string
  title: string
  description: string
  href: string
  type: 'presentation' | 'article' | 'video' | 'guide'
}

export const educationResources: EducationResource[] = [
  {
    id: 'productivity-with-ai',
    title: 'Productivity with AI & Cursor',
    description:
      'Be more productive at work: a quick look at AI evolution, everyday productivity tips, and how to use Cursor.',
    href: '/education/productivity-with-ai',
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
