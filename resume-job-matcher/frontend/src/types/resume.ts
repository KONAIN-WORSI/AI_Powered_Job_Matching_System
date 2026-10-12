export interface Resume {
  id: number
  filename: string
  status: 'uploaded' | 'processing' | 'ready' | 'failed'
  skills: string[]
}
