import React, { useState, useEffect } from 'react'
import { Ticket } from '../types'
import { useFormValidation } from '../hooks'
import './TicketDetail.css'

type Props = {
  ticket: Ticket
  onUpdate: (id: string, data: Omit<Ticket, 'id' | 'createdAt'>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const initialForm = {
  name: '',
  surname: '',
  company: '',
  email: '',
  description: '',
}

const TicketDetail: React.FC<Props> = ({ ticket, onUpdate, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [form, setForm] = useState({
    name: ticket.name,
    surname: ticket.surname,
    company: ticket.company,
    email: ticket.email,
    description: ticket.description,
  })

  useEffect(() => {
    setForm({
      name: ticket.name,
      surname: ticket.surname,
      company: ticket.company,
      email: ticket.email,
      description: ticket.description,
    })
  }, [ticket])

  const { errors, validate, clearErrors } = useFormValidation<typeof initialForm>({
    name: { required: true },
    surname: { required: true },
    company: { required: true },
    email: { required: true, isEmail: true },
    description: { required: true, minLength: 10 },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setForm({
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
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <h2>Ticket Details</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isEditing ? (
        <form className="ticket-edit-form" onSubmit={handleSave} noValidate>
          <div>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div>
            Surname
            <input name="surname" value={form.surname} onChange={handleChange} />
            {errors.surname && <div className="error">{errors.surname}</div>}
          </div>

          <div>
            Company
            <input name="company" value={form.company} onChange={handleChange} />
            {errors.company && <div className="error">{errors.company}</div>}
          </div>

          <div>
            Email
            <input name="email" value={form.email} onChange={handleChange} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="full">
            Description
            <textarea
              name="description"
              rows={6}
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && <div className="error">{errors.description}</div>}
          </div>

          <div className="actions full">
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      ) : (
        <div className="ticket-view">
          <div className="ticket-info">
            <div className="field-row">
              <div>
                Name: {ticket.name} {ticket.surname}
              </div>
              <div>
                Company: {ticket.company}
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              Email: {ticket.email}
            </div>
            <div style={{ marginTop: 8 }}>
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </div>
            <div style={{ marginTop: 8 }}>
              Description:
              <p>{ticket.description}</p>
            </div>
          </div>

          <div className="ticket-actions">
            <button className="edit-btn" onClick={handleEdit}>Edit</button>
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketDetail
