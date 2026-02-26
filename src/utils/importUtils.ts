import Papa from 'papaparse'
import { Ticket } from '../types/ticket'
import { 
  ExportFormat, 
  ImportError, 
  ImportPreview 
} from '../types/importExport'
import { VALIDATION, PRIORITY_LEVELS } from '../constants'

export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email)
}

export const validatePriority = (priority: string): boolean => {
  return PRIORITY_LEVELS.includes(priority.toLowerCase() as any)
}

export const normalizePriority = (priority: string): string => {
  const normalized = priority.toLowerCase().trim()
  if (['high', 'medium', 'low'].includes(normalized)) {
    return normalized
  }
  return 'medium' // Default fallback
}

export const parseCSV = (file: File): Promise<ImportPreview> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const preview = processCSVData(results.data as any[])
          resolve(preview)
        } catch (error) {
          reject(error)
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`))
      }
    })
  })
}

export const processCSVData = (data: any[]): ImportPreview => {
  const tickets: Ticket[] = []
  const errors: ImportError[] = []

  data.forEach((row, index) => {
    const rowNum = index + 2 // Account for header row
    const ticketErrors: ImportError[] = []

    // Validate required fields
    if (!row.name || row.name.trim() === '') {
      ticketErrors.push({
        row: rowNum,
        field: 'name',
        message: 'Name is required',
        value: row.name
      })
    }

    if (!row.surname || row.surname.trim() === '') {
      ticketErrors.push({
        row: rowNum,
        field: 'surname',
        message: 'Surname is required',
        value: row.surname
      })
    }

    if (!row.company || row.company.trim() === '') {
      ticketErrors.push({
        row: rowNum,
        field: 'company',
        message: 'Company is required',
        value: row.company
      })
    }

    if (!row.email || row.email.trim() === '') {
      ticketErrors.push({
        row: rowNum,
        field: 'email',
        message: 'Email is required',
        value: row.email
      })
    } else if (!validateEmail(row.email)) {
      ticketErrors.push({
        row: rowNum,
        field: 'email',
        message: 'Invalid email format',
        value: row.email
      })
    }

    if (!row.description || row.description.trim() === '') {
      ticketErrors.push({
        row: rowNum,
        field: 'description',
        message: 'Description is required',
        value: row.description
      })
    }

    if (!row.priority || row.priority.trim() === '') {
      ticketErrors.push({
        row: rowNum,
        field: 'priority',
        message: 'Priority is required',
        value: row.priority
      })
    } else if (!validatePriority(row.priority)) {
      ticketErrors.push({
        row: rowNum,
        field: 'priority',
        message: 'Priority must be high, medium, or low',
        value: row.priority
      })
    }

    // If no validation errors, create ticket
    if (ticketErrors.length === 0) {
      const ticket: Ticket = {
        id: row.id || `imported-${Date.now()}-${index}`,
        name: row.name.trim(),
        surname: row.surname.trim(),
        company: row.company.trim(),
        email: row.email.trim(),
        description: row.description.trim(),
        priority: normalizePriority(row.priority) as any,
        createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString()
      }
      tickets.push(ticket)
    } else {
      errors.push(...ticketErrors)
    }
  })

  return {
    tickets,
    errors,
    totalRows: data.length,
    validRows: tickets.length,
    invalidRows: errors.length
  }
}

export const parseJSON = (file: File): Promise<ImportPreview> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const jsonData = JSON.parse(content)
        const preview = processJSONData(jsonData)
        resolve(preview)
      } catch (error) {
        reject(new Error(`JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

export const processJSONData = (jsonData: any): ImportPreview => {
  const tickets: Ticket[] = []
  const errors: ImportError[] = []

  // Check if it's the expected format
  if (!jsonData.tickets || !Array.isArray(jsonData.tickets)) {
    errors.push({
      message: 'Invalid JSON format: Expected object with "tickets" array'
    })
    return { tickets: [], errors, totalRows: 0, validRows: 0, invalidRows: 1 }
  }

  jsonData.tickets.forEach((ticketData: any, index: number) => {
    const ticketErrors: ImportError[] = []

    // Validate required fields
    const requiredFields = ['name', 'surname', 'company', 'email', 'description', 'priority']
    
    requiredFields.forEach(field => {
      if (!ticketData[field] || ticketData[field].toString().trim() === '') {
        ticketErrors.push({
          row: index + 1,
          field,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          value: ticketData[field]
        })
      }
    })

    // Email validation
    if (ticketData.email && !validateEmail(ticketData.email)) {
      ticketErrors.push({
        row: index + 1,
        field: 'email',
        message: 'Invalid email format',
        value: ticketData.email
      })
    }

    // Priority validation
    if (ticketData.priority && !validatePriority(ticketData.priority)) {
      ticketErrors.push({
        row: index + 1,
        field: 'priority',
        message: 'Priority must be high, medium, or low',
        value: ticketData.priority
      })
    }

    // If no validation errors, create ticket
    if (ticketErrors.length === 0) {
      const ticket: Ticket = {
        id: ticketData.id || `imported-${Date.now()}-${index}`,
        name: ticketData.name.trim(),
        surname: ticketData.surname.trim(),
        company: ticketData.company.trim(),
        email: ticketData.email.trim(),
        description: ticketData.description.trim(),
        priority: normalizePriority(ticketData.priority) as any,
        createdAt: ticketData.createdAt ? new Date(ticketData.createdAt).toISOString() : new Date().toISOString()
      }
      tickets.push(ticket)
    } else {
      errors.push(...ticketErrors)
    }
  })

  return {
    tickets,
    errors,
    totalRows: jsonData.tickets.length,
    validRows: tickets.length,
    invalidRows: errors.length
  }
}

export const importFromFile = async (file: File, format: ExportFormat): Promise<ImportPreview> => {
  switch (format) {
    case 'csv':
      return parseCSV(file)
    case 'json':
      return parseJSON(file)
    default:
      throw new Error(`Unsupported import format: ${format}`)
  }
}

export const detectFileFormat = (file: File): ExportFormat => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (extension === 'csv') return 'csv'
  if (extension === 'json') return 'json'
  
  // Try to detect by content type
  if (file.type === 'text/csv') return 'csv'
  if (file.type === 'application/json') return 'json'
  
  throw new Error('Unable to detect file format. Please use .csv or .json files.')
}
