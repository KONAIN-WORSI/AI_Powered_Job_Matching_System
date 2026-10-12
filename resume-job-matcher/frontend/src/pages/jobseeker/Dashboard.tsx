import { Card } from '../../components/common/Card'
import { Sidebar } from '../../components/layout/Sidebar'

export default function Dashboard() {
  return (
    <Card>
      <p className="eyebrow">Job seeker</p>
      <h1>Find work that fits your skills.</h1>
      <p className="muted">Upload a resume to start building your personalized job matches.</p>
      <Sidebar />
    </Card>
  )
}
