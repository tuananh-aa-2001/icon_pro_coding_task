import { useMemo } from 'react'
import { Ticket } from '../types'

export type SortField = 'date' | 'name' | 'company'
export type SortDirection = 'asc' | 'desc'

export const useTicketSearchSort = (
  tickets: Ticket[],
  searchQuery: string,
  sortField: SortField,
  sortDirection: SortDirection
) => {
  return useMemo(() => {
    let filtered = tickets

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = tickets.filter(ticket => 
        ticket.name.toLowerCase().includes(query) ||
        ticket.surname.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query) ||
        `${ticket.name} ${ticket.surname}`.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'name':
          comparison = `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
          break
        case 'company':
          comparison = a.company.localeCompare(b.company)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [tickets, searchQuery, sortField, sortDirection])
}

export const useSortHandlers = (
  sortField: SortField,
  setSortField: (field: SortField) => void,
  currentDirection: SortDirection,
  setSortDirection: (direction: SortDirection) => void
) => {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(currentDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Change field and default to desc for date, asc for others
      setSortField(field)
      setSortDirection(field === 'date' ? 'desc' : 'asc')
    }
  }

  return { handleSort }
}
