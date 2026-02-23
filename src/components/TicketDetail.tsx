import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Paper,
  Typography,
  IconButton
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { Ticket } from '../types'
import { useTicketForm } from '../hooks'
import FormField from './FormField'

type Props = {
  ticket: Ticket
  onUpdate: (id: string, data: Omit<Ticket, 'id' | 'createdAt'>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const TicketDetail: React.FC<Props> = ({ ticket, onUpdate, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { form, errors, validate, clearErrors, handleChange, updateForm } = useTicketForm({
    name: ticket.name,
    surname: ticket.surname,
    company: ticket.company,
    email: ticket.email,
    description: ticket.description,
  })

  React.useEffect(() => {
    updateForm({
      name: ticket.name,
      surname: ticket.surname,
      company: ticket.company,
      email: ticket.email,
      description: ticket.description,
    })
  }, [ticket, updateForm])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    updateForm({
      name: ticket.name,
      surname: ticket.surname,
      company: ticket.company,
      email: ticket.email,
      description: ticket.description,
    })
    clearErrors()
  }

  const handleSave = (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!validate(form)) return
    
    onUpdate(ticket.id, {
      name: form.name.trim(),
      surname: form.surname.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      description: form.description.trim(),
    })
    setIsEditing(false)
    clearErrors()
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete(ticket.id)
    onClose()
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h2">
          Ticket Details
        </Typography>
        <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Dialog
        open={showDeleteConfirm}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {isEditing ? (
        <Box component="form" onSubmit={handleSave} noValidate>
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
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Name: {ticket.name} {ticket.surname}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Company: {ticket.company}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              Email: {ticket.email}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Description:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {ticket.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleEdit} variant="contained" color="primary">
              Edit
            </Button>
            <Button onClick={handleDelete} variant="outlined" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  )
}

export default TicketDetail
