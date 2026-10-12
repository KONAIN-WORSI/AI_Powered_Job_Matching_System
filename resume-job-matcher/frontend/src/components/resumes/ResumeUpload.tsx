import { useState, type ChangeEvent } from 'react'

export function ResumeUpload() {
  const [filename, setFilename] = useState('')

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFilename(event.target.files?.[0]?.name ?? '')
  }

  return (
    <label>
      Choose a PDF or DOCX resume
      <input accept=".pdf,.docx" onChange={handleChange} type="file" />
      {filename && <span>{filename}</span>}
    </label>
  )
}
