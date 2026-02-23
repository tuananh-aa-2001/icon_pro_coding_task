import React from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { Ticket } from '../types'
import { useTicketForm } from '../hooks'
import FormField from './FormField'

type Props = {
  onAdd: (data: Omit<Ticket, 'id' | 'createdAt'>) => void
}

const TicketForm: React.FC<Props> = ({ onAdd }) => {
  const { form, errors, validate, handleChange, resetForm } = useTicketForm()

  const submit = (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!validate(form)) return
    onAdd({
      name: form.name.trim(),
      surname: form.surname.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      description: form.description.trim(),
    })
    resetForm()
  }

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Support Ticket
      </Typography>
      <Box component="form" onSubmit={submit} noValidate>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <FormField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
          </Box>
          <Box>
            <FormField
              label="Surname"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              error={errors.surname}
            />
          </Box>
          <Box>
            <FormField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              error={errors.company}
            />
          </Box>
          <Box>
            <FormField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <FormField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              error={errors.description}
              type="textarea"
              rows={6}
            />
          </Box>
          <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 1, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: 120 }}
            >
              Submit Ticket
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default TicketForm
