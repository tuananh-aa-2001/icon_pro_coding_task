import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from '../services/api'
import { TICKETS_QUERY_KEY } from './useTicketApi'

export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, newPriority }: { ticketId: string; newPriority: string }) =>
      ticketApi.updateTicketPriority(ticketId, newPriority),
    
    onMutate: async ({ ticketId, newPriority }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [TICKETS_QUERY_KEY] })
      
      // Snapshot the previous value
      const previousTickets = queryClient.getQueryData([TICKETS_QUERY_KEY])
      
      // Optimistically update to the new value
      queryClient.setQueryData([TICKETS_QUERY_KEY], (old: any) => {
        if (!old) return old
        return old.map((ticket: any) => 
          ticket.id === ticketId ? { ...ticket, priority: newPriority } : ticket
        )
      })
      
      return { previousTickets }
    },
    
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTickets) {
        queryClient.setQueryData([TICKETS_QUERY_KEY], context.previousTickets)
      }
      console.error('Failed to update ticket priority:', err)
    },
    
    onSettled: () => {
      // Always refetch after error or success to make sure the UI state is correct
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] })
    },
  })
}
