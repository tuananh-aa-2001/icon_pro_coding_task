import { useState, useCallback } from 'react'
import { Ticket } from '../types/ticket'
import { ExportOptions } from '../types/importExport'
import { exportTickets, generateDefaultFilename } from '../utils/exportUtils'

export const useTicketExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const exportTicketData = useCallback(async (
    tickets: Ticket[], 
    options: ExportOptions
  ) => {
    setIsExporting(true)
    setExportError(null)

    try {
      // Validate tickets
      if (tickets.length === 0) {
        throw new Error('No tickets to export')
      }

      // Set default filename if not provided
      const exportOptions: ExportOptions = {
        ...options,
        filename: options.filename || generateDefaultFilename(options.format)
      }

      // Perform export
      exportTickets(tickets, exportOptions)

      return {
        success: true,
        filename: exportOptions.filename,
        format: options.format,
        count: tickets.length
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed'
      setExportError(errorMessage)
      throw error
    } finally {
      setIsExporting(false)
    }
  }, [])

  const exportToCSV = useCallback(async (tickets: Ticket[], filename?: string) => {
    return exportTicketData(tickets, { 
      format: 'csv', 
      filename,
      includeMetadata: false 
    })
  }, [exportTicketData])

  const exportToJSON = useCallback(async (
    tickets: Ticket[], 
    filename?: string, 
    includeMetadata = true
  ) => {
    return exportTicketData(tickets, { 
      format: 'json', 
      filename,
      includeMetadata 
    })
  }, [exportTicketData])

  const clearError = useCallback(() => {
    setExportError(null)
  }, [])

  return {
    exportTicketData,
    exportToCSV,
    exportToJSON,
    isExporting,
    exportError,
    clearError
  }
}
