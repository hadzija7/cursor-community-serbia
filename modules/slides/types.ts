export interface Slide {
  id: number
  title: string
  content: React.ReactNode | string
  notes?: string
  /** When 'large', uses bigger heading for title slide (e.g. slide 1) */
  titleSize?: 'large' | 'normal'
}
