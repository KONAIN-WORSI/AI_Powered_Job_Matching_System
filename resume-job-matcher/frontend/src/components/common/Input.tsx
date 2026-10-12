import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label htmlFor={inputId}>
      {label}
      <input id={inputId} {...props} />
    </label>
  )
}
