import React, { useState } from 'react'
import { Ticket } from '../types'
import { useFormValidation } from '../hooks'
import './TicketForm.css'

type Props = {
  onAdd: (data: Omit<Ticket, 'id' | 'createdAt'>) => void
}

const initialForm = {
  name: '',
  surname: '',
  company: '',
  email: '',
  description: '',
}

const TicketForm: React.FC<Props> = ({ onAdd }) => {
  const [form, setForm] = useState(initialForm)

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
    setForm(initialForm)
    clearErrors()
  }

  return (
    <form className="ticket-form" onSubmit={submit} noValidate>
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
        <button type="submit">Submit Ticket</button>
      </div>
    </form>
  )
}

export default TicketForm
