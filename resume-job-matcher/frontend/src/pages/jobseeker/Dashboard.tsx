import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'
import axios from 'axios'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { uploadResume } from '../../api/resumes'
import { useAuth } from '../../hooks/useAuth'
import './dashboard.css'

type IconName = 'grid' | 'file' | 'briefcase' | 'sparkle' | 'lock' | 'bell' | 'upload' | 'check' | 'arrow' | 'help' | 'logout'

interface ParsedResume {
  filename: string
  skills: string[]
  uploadedAt: string
  isPrimary: boolean
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, string> = {
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
    briefcase: 'M3 7h18v13H3z M8 7V4h8v3 M3 12h18 M10 12v2h4v-2',
    sparkle: 'm12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z M19 14l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14z',
    lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
    upload: 'M12 16V4 M7 9l5-5 5 5 M4 16v4h16v-4',
    check: 'm5 12 4 4L19 6',
    arrow: 'M7 17 17 7 M7 7h10v10',
    help: 'M12 18h.01 M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 5 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
    logout: 'M10 17l5-5-5-5 M15 12H3 M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6',
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

function getUploadError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: unknown; detail?: unknown } | undefined
    if (typeof data?.error === 'string') return data.error
    if (typeof data?.detail === 'string') return data.detail
    if (!error.response) return 'Could not reach the server. Check that the backend is running and try again.'
  }
  return 'We could not process that resume. Please try again.'
}

export default function Dashboard({ view = 'dashboard' }: { view?: 'dashboard' | 'resume' }) {
  const isResumePage = view === 'resume'
  const { logout } = useAuth()
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPrimary, setIsPrimary] = useState(true)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const email = localStorage.getItem('user_email') ?? ''
  const avatar = email ? email[0].toUpperCase() : 'J'

  function chooseFile(file?: File) {
    setError('')
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension !== 'pdf' && extension !== 'docx') {
      setSelectedFile(null)
      setError('Choose a PDF or DOCX file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null)
      setError('The file must be 10 MB or smaller.')
      return
    }
    setSelectedFile(file)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0])
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    chooseFile(event.dataTransfer.files[0])
  }

  function handleDropzoneKeyDown(event: KeyboardEvent<HTMLLabelElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      fileInput.current?.click()
    }
  }

  async function handleUpload() {
    if (!selectedFile) return

    setUploading(true)
    setError('')
    try {
      const response = await uploadResume(selectedFile, isPrimary)
      setParsedResume({
        filename: selectedFile.name,
        skills: response.payload.extracted_skills,
        uploadedAt: response.payload.created_at,
        isPrimary: response.payload.is_primary,
      })
      setSelectedFile(null)
    } catch (uploadError) {
      setError(getUploadError(uploadError))
    } finally {
      setUploading(false)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login', { state: { logoutError: true } })
    }
  }

  const uploadedDate = parsedResume
    ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(parsedResume.uploadedAt))
    : ''

  return (
    <div className="seeker-app">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="seeker-sidebar">
        <Link aria-label="Matchwise home" className="brand-lockup" to="/dashboard">
          <span className="brand-mark"><Icon name="sparkle" size={17} /></span>
          <span>matchwise</span>
        </Link>

        <div className="sidebar-label">Job seeker</div>
        <nav aria-label="Job seeker navigation" className="seeker-nav">
          <NavLink end to="/dashboard"><Icon name="grid" size={17} />Dashboard</NavLink>
          <NavLink to="/resume"><Icon name="file" size={17} />My Resume</NavLink>
          <NavLink to="/dashboard#matches"><Icon name="briefcase" size={17} />Matches</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <a className="help-link" href="mailto:support@matchwise.example"><Icon name="help" size={16} />Need help?</a>
          <div className="account-row">
            <span className="avatar">{avatar}</span>
            <span className="account-copy">
              <strong>{email || 'Job seeker'}</strong>
              <small>Job Seeker</small>
            </span>
            <button aria-label="Sign out" className="icon-button" disabled={uploading} onClick={handleLogout} title="Sign out" type="button">
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="seeker-main">
        <header className="seeker-topbar">
          <span className="topbar-caption">AI-powered job matching system</span>
          <div className="privacy-note"><Icon name="lock" size={14} />Your data stays private <span className="topbar-divider" /><button aria-label="Notifications" className="icon-button" type="button"><Icon name="bell" size={16} /></button></div>
        </header>

        <main className={`dashboard-content${isResumePage ? ' resume-page-content' : ''}`} id="main-content">
          <section className="welcome-row">
            <div>
              <p className="welcome-eyebrow">{isResumePage ? 'Your profile' : 'Job seeker dashboard'}</p>
              <h1 className="dashboard-heading">{isResumePage ? 'My resume' : 'Welcome back'}</h1>
              <p className="welcome-subtitle">{isResumePage ? 'Upload or replace your resume to keep your job seeker profile up to date.' : 'Your next great match starts with your resume.'}</p>
            </div>
            {!isResumePage && <div className="location-summary"><span>Location</span><strong>Nepal <small>(Default)</small></strong></div>}
          </section>

          {!isResumePage && <section aria-label="Resume and match overview" className="stat-grid">
            <article className="stat-card">
              <div className="stat-label">Recommended matches <span className="stat-icon"><Icon name="briefcase" size={16} /></span></div>
              <strong className="stat-value">—</strong>
              <p>Job matching is coming soon</p>
            </article>
            <article className="stat-card">
              <div className="stat-label">Your strongest match <span className="stat-icon"><Icon name="sparkle" size={16} /></span></div>
              <strong className="stat-value">—</strong>
              <p>Upload a resume to get started</p>
            </article>
            <article className="stat-card">
              <div className="stat-label">Skills identified <span className="stat-icon"><Icon name="check" size={16} /></span></div>
              <strong className="stat-value">{parsedResume?.skills.length ?? '—'}</strong>
              <p>{parsedResume ? 'Ready for smarter matching' : 'Extracted from your resume'}</p>
            </article>
          </section>}

          <div className="dashboard-columns">
            <div className="dashboard-primary">
              <section aria-labelledby="resume-heading" className="surface-card resume-card" id="resume">
                <div className="section-heading">
                  <div>
                    <h2 id="resume-heading">{isResumePage ? 'Resume file' : 'Your resume'}</h2>
                    <p>{isResumePage ? 'PDF or DOCX · Maximum file size 10 MB' : 'Upload a resume to build your job seeker profile.'}</p>
                  </div>
                  {parsedResume && <span className="parsed-badge"><Icon name="check" size={14} />{parsedResume.isPrimary ? 'Primary resume' : 'Resume parsed'}</span>}
                </div>

                <label
                  className={`upload-dropzone${dragging ? ' is-dragging' : ''}${uploading ? ' is-uploading' : ''}`}
                  htmlFor="resume-file"
                  onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
                  onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
                  onDragLeave={(event) => { event.preventDefault(); setDragging(false) }}
                  onDrop={handleDrop}
                  onKeyDown={handleDropzoneKeyDown}
                  tabIndex={0}
                >
                  <input
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="visually-hidden"
                    disabled={uploading}
                    id="resume-file"
                    onChange={handleFileChange}
                    ref={fileInput}
                    type="file"
                  />
                  <span className="upload-icon"><Icon name="upload" size={20} /></span>
                  <strong>{selectedFile ? selectedFile.name : parsedResume ? 'Drop a new resume to replace your current one' : 'Drag and drop your resume here'}</strong>
                  <span className="upload-help">{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload` : 'PDF or DOCX · Up to 10 MB'}</span>
                  {uploading && <span aria-live="polite" className="upload-progress">Uploading and analyzing your resume…</span>}
                  {!uploading && !selectedFile && <span className="file-picker-button">{parsedResume ? 'Replace Resume' : 'Choose a file'}</span>}
                </label>

                <label className="primary-resume-option">
                  <input
                    checked={isPrimary}
                    disabled={uploading}
                    onChange={(event) => setIsPrimary(event.target.checked)}
                    type="checkbox"
                  />
                  <span className="primary-resume-copy">
                    <strong>Set as my primary resume</strong>
                    <small>Making this primary replaces your current primary resume.</small>
                  </span>
                </label>

                {error && <p className="upload-error" role="alert">{error}</p>}
                {selectedFile && !uploading && (
                  <div className="upload-actions">
                    <button className="primary-button" disabled={uploading} onClick={handleUpload} type="button">Upload resume</button>
                    <button className="text-button" onClick={() => setSelectedFile(null)} type="button">Cancel</button>
                  </div>
                )}

                {parsedResume ? (
                  <div className="uploaded-file-row">
                    <span className="document-icon"><Icon name="file" size={17} /></span>
                    <span className="uploaded-file-copy"><strong>{parsedResume.filename}</strong><small>{parsedResume.skills.length} skills found · Uploaded {uploadedDate}{parsedResume.isPrimary ? ' · Primary resume' : ''}</small></span>
                    <span aria-label="Upload complete" className="complete-icon"><Icon name="check" size={15} /></span>
                  </div>
                ) : null}
              </section>

              <section aria-label="Privacy information" className="privacy-footnote"><Icon name="lock" size={14} /><span>Your resume is private and only used to find relevant opportunities.</span></section>
            </div>

            <aside className="dashboard-aside">
              <section aria-labelledby="skills-heading" className="surface-card insight-card">
                <h2 id="skills-heading">What we found</h2>
                {parsedResume && parsedResume.skills.length > 0 ? (
                  <>
                    <div className="candidate-summary">
                      <strong>{parsedResume.filename}</strong>
                      <span>Resume skills</span>
                    </div>
                    <div className="skill-divider" />
                    <h3>Key skills from your resume</h3>
                    <div className="skill-chips">
                      {parsedResume.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}
                    </div>
                    <a className="review-link" href="#resume">Review my resume <Icon name="arrow" size={13} /></a>
                  </>
                ) : (
                  <div className="insight-empty">
                    <span className="empty-icon"><Icon name="sparkle" size={18} /></span>
                    <p>Upload a resume and we’ll identify your skills here.</p>
                  </div>
                )}
              </section>

              {!isResumePage && <section aria-labelledby="matches-heading" className="surface-card matches-card" id="matches">
                <h2 id="matches-heading">Your matches are next</h2>
                <p>{parsedResume ? 'Your resume has been analyzed. Job matching will be available when the matching service is connected.' : 'Upload your resume first. We’ll use your skills to prepare relevant job matches.'}</p>
                <button className="primary-button matches-button" disabled type="button">Explore matches</button>
                <span className="coming-soon">Job matching is coming soon</span>
              </section>}
            </aside>
          </div>

          <footer className="dashboard-footer"><span>© 2026 Matchwise</span><span>Better matches. Brighter futures.</span></footer>
        </main>
      </div>
    </div>
  )
}
