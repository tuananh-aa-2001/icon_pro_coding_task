import Papa from 'papaparse'
import { Ticket } from '../types/ticket'
import { ExportFormat, ExportOptions, JsonExportData } from '../types/importExport'

export const exportToCSV = (tickets: Ticket[], options: ExportOptions): void => {
  const csvData = tickets.map(ticket => ({
    id: ticket.id,
    name: ticket.name,
    surname: ticket.surname,
    company: ticket.company,
    email: ticket.email,
    description: ticket.description,
    priority: ticket.priority,
    createdAt: ticket.createdAt
  }))

  const csv = Papa.unparse(csvData, {
    header: true,
    quotes: true,
    quoteChar: '"',
    escapeChar: '"'
  })

  downloadFile(csv, `${options.filename || 'tickets'}.csv`, 'text/csv')
}

export const exportToJSON = (tickets: Ticket[], options: ExportOptions): void => {
  const priorityDistribution = tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const jsonData: JsonExportData = {
    tickets,
    exportDate: new Date().toISOString(),
    version: '1.0',
    metadata: options.includeMetadata ? {
      totalTickets: tickets.length,
      priorityDistribution
    } : undefined
  }

  const jsonString = JSON.stringify(jsonData, null, 2)
  downloadFile(jsonString, `${options.filename || 'tickets'}.json`, 'application/json')
}

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export const exportTickets = (tickets: Ticket[], options: ExportOptions): void => {
  switch (options.format) {
    case 'csv':
      exportToCSV(tickets, options)
      break
    case 'json':
      exportToJSON(tickets, options)
      break
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

export const generateDefaultFilename = (format: ExportFormat): string => {
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return `tickets_${timestamp}.${format}`
}
