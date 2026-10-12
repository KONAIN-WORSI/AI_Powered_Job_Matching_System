import { Card } from '../../components/common/Card'
import { ResumeUpload as ResumeUploadField } from '../../components/resumes/ResumeUpload'

export default function ResumeUploadPage() {
  return (
    <Card>
      <p className="eyebrow">Your profile</p>
      <h1>Upload a resume</h1>
      <ResumeUploadField />
      <p className="muted">Uploads are not sent to the API until the backend endpoint is implemented.</p>
    </Card>
  )
}
