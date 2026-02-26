import { Ticket } from './ticket'

export type ExportFormat = 'csv' | 'json'

export interface ExportOptions {
  format: ExportFormat
  includeMetadata?: boolean
  filename?: string
}

export interface ImportResult {
  success: boolean
  tickets: Ticket[]
  errors: ImportError[]
  totalProcessed: number
  duplicates: number
}

export interface ImportError {
  row?: number
  field?: string
  message: string
  value?: any
}

export interface ImportOptions {
  format: ExportFormat
  handleDuplicates: 'skip' | 'overwrite' | 'merge'
  validateOnly?: boolean
}

export interface JsonExportData {
  tickets: Ticket[]
  exportDate: string
  version: string
  metadata?: {
    totalTickets: number
    priorityDistribution: Record<string, number>
  }
}

export interface CsvRow {
  id?: string
  name: string
  surname: string
  company: string
  email: string
  description: string
  priority: string
  createdAt?: string
}

export interface FileUploadState {
  isUploading: boolean
  progress: number
  error: string | null
  fileName: string | null
  fileSize: number | null
}

export interface ImportPreview {
  tickets: Ticket[]
  errors: ImportError[]
  totalRows: number
  validRows: number
  invalidRows: number
}
