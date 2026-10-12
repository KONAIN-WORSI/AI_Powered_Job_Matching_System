import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'

export default function NotFound() {
  return (
    <Card>
      <h1>Page not found</h1>
      <Link to="/">Return to the home page</Link>
    </Card>
  )
}
