import type { Job } from '../../types/job'
import { Card } from '../common/Card'

interface JobCardProps {
  job: Job
  score?: number
}

export function JobCard({ job, score }: JobCardProps) {
  return (
    <Card>
      <h2>{job.title}</h2>
      <p className="muted">{job.company} · {job.location}</p>
      {score !== undefined && <p>{score}% match</p>}
      <a href={job.url} rel="noreferrer" target="_blank">View listing</a>
    </Card>
  )
}
