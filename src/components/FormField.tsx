import React from 'react'
import { TextField } from '@mui/material'

type Props = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  type?: 'input' | 'textarea'
  rows?: number
}

const FormField: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'input',
  rows = 6,
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      multiline={type === 'textarea'}
      rows={type === 'textarea' ? rows : undefined}
      fullWidth
      variant="outlined"
      margin="normal"
    />
  )
}

export default FormField
