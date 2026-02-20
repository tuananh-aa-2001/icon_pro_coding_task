import { useState } from 'react'

// Custom hook for form validation

export interface ValidationRules {
    required?: boolean
    isEmail?: boolean
    minLength?: number
}

type FieldRules<T> = Partial<Record<keyof T, ValidationRules>>
type FieldErrors<T> = Partial<Record<keyof T, string>>

function validateField(value: string, rules: ValidationRules): string {
    if (rules.required && !value.trim()) {
        return 'Required'
    }

    if (rules.minLength !== undefined && value.trim().length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`
    }

    if (rules.isEmail && value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) {
            return 'Must be a valid email address'
        }
    }

    return ''
}

export function useFormValidation<T extends Record<string, string>>(
    rules: FieldRules<T>
) {
    const [errors, setErrors] = useState<FieldErrors<T>>({})

    const validate = (form: T): boolean => {
        const newErrors: FieldErrors<T> = {}

        for (const field in rules) {
            const fieldRules = rules[field as keyof T]
            if (!fieldRules) continue

            const error = validateField(String(form[field as keyof T] ?? ''), fieldRules)
            if (error) {
                newErrors[field as keyof T] = error
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const clearErrors = () => setErrors({})

    return { errors, validate, clearErrors }
}
