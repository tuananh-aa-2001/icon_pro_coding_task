import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from '../services/api'
import { TICKETS_QUERY_KEY } from './useTicketApi'
import { Ticket } from '../types/ticket'
import { ImportOptions } from '../types/importExport'

export const useBulkImportTickets = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tickets, options }: { 
      tickets: Omit<Ticket, 'id' | 'createdAt'>[] 
      options: ImportOptions 
    }) => {
      // Handle duplicates based on options
      let ticketsToImport = tickets
      
      if (options.handleDuplicates === 'skip') {
        // In a real app, you'd check for existing emails/names
        // For now, we'll import all
        ticketsToImport = tickets
      } else if (options.handleDuplicates === 'overwrite') {
        // In a real app, you'd find and update existing tickets
        // For now, we'll import all as new
        ticketsToImport = tickets
      }
      
      return ticketApi.bulkImportTickets(ticketsToImport)
    },
    
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [TICKETS_QUERY_KEY] })
      
      // Snapshot the previous value
      const previousTickets = queryClient.getQueryData([TICKETS_QUERY_KEY])
      
      return { previousTickets }
    },
    
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTickets) {
        queryClient.setQueryData([TICKETS_QUERY_KEY], context.previousTickets)
      }
      console.error('Failed to import tickets:', err)
    },
    
    onSuccess: (importedTickets) => {
      console.log(`Successfully imported ${importedTickets.length} tickets`)
    },
    
    onSettled: () => {
      // Always refetch after error or success to make sure the UI state is correct
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] })
    },
  })
}

export const useBulkUpdateTickets = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: { id: string; data: Partial<Ticket> }[]) =>
      ticketApi.bulkUpdateTickets(updates),
    
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [TICKETS_QUERY_KEY] })
      
      // Snapshot the previous value
      const previousTickets = queryClient.getQueryData([TICKETS_QUERY_KEY])
      
      // Optimistically update to the new value
      queryClient.setQueryData([TICKETS_QUERY_KEY], (old: any) => {
        if (!old) return old
        return old.map((ticket: Ticket) => {
          const update = updates.find(u => u.id === ticket.id)
          return update ? { ...ticket, ...update.data } : ticket
        })
      })
      
      return { previousTickets }
    },
    
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTickets) {
        queryClient.setQueryData([TICKETS_QUERY_KEY], context.previousTickets)
      }
      console.error('Failed to update tickets:', err)
    },
    
    onSuccess: (updatedTickets) => {
      console.log(`Successfully updated ${updatedTickets.length} tickets`)
    },
    
    onSettled: () => {
      // Always refetch after error or success to make sure the UI state is correct
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] })
    },
  })
}
