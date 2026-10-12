import type { Job } from '../../types/job'
import { JobCard } from './JobCard'

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  return <div>{jobs.map((job) => <JobCard job={job} key={job.id} />)}</div>
}
