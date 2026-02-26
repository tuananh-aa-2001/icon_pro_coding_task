// App Constants
export const APP_NAME = 'Ticket Management System'
export const APP_VERSION = '1.0.0'

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const SUPPORTED_FILE_TYPES = ['.csv', '.json']
export const SUPPORTED_MIME_TYPES = ['text/csv', 'application/json']

// API Constants
export const API_DELAY = {
  DEFAULT: 300,
  BULK_IMPORT: 500,
  BULK_UPDATE: 400,
} as const

// Cache Constants
export const CACHE_STALE_TIME = 5 * 60 * 1000 // 5 minutes
export const CACHE_RETRY = 2

// Priority Levels
export const PRIORITY_LEVELS = ['high', 'medium', 'low'] as const
export type PriorityLevel = typeof PRIORITY_LEVELS[number]

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMPANY_LENGTH: 100,
  MAX_NAME_LENGTH: 50,
} as const

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  GRID_BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 900,
    LG: 1200,
    XL: 1536,
  },
} as const

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds 10MB limit`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a CSV or JSON file',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  VALIDATION_ERROR: 'Please check your input and try again',
  IMPORT_FAILED: 'Failed to import tickets. Please try again',
  EXPORT_FAILED: 'Failed to export tickets. Please try again',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  TICKET_CREATED: 'Ticket created successfully',
  TICKET_UPDATED: 'Ticket updated successfully',
  TICKET_DELETED: 'Ticket deleted successfully',
  IMPORT_COMPLETED: 'Tickets imported successfully',
  EXPORT_COMPLETED: 'Tickets exported successfully',
} as const
