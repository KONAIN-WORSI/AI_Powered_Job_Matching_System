import { Card } from '../common/Card'

interface CandidateCardProps {
  name: string
  skills: string[]
}

export function CandidateCard({ name, skills }: CandidateCardProps) {
  return (
    <Card>
      <h2>{name}</h2>
      <p className="muted">{skills.join(' · ')}</p>
    </Card>
  )
}
