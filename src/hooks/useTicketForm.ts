import { useState, useCallback } from 'react'
import { useFormValidation } from './index'

export const initialTicketForm = {
  name: '',
  surname: '',
  company: '',
  email: '',
  description: '',
}

export const useTicketForm = (initialData = initialTicketForm) => {
  const [form, setForm] = useState(initialData)

  const { errors, validate, clearErrors } = useFormValidation<typeof initialTicketForm>({
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

  const resetForm = () => {
    setForm(initialTicketForm)
    clearErrors()
  }

  const updateForm = useCallback((data: Partial<typeof initialTicketForm>) => {
    setForm((s) => ({ ...s, ...data }))
  }, [])

  return {
    form,
    errors,
    validate,
    clearErrors,
    handleChange,
    resetForm,
    updateForm,
  }
}
