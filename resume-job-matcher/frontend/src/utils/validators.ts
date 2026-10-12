const allowedResumeExtensions = new Set(['pdf', 'docx'])

export function isAllowedResumeFile(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return extension !== undefined && allowedResumeExtensions.has(extension)
}
