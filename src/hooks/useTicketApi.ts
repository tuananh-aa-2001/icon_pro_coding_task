import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { ticketApi } from '../services/api'
import { Ticket } from '../types'

// Constants
export const TICKETS_QUERY_KEY = 'tickets' as const
const STALE_TIME = 5 * 60 * 1000 // 5 minutes

// Types
type MutationContext = {
  previousTickets: Ticket[]
}

// Shared optimistic update utilities
const createOptimisticUpdate = (
  queryClient: QueryClient,
  queryKey: typeof TICKETS_QUERY_KEY
) => ({
  // Cancel outgoing queries and snapshot previous state
  prepareOptimisticUpdate: async () => {
    await queryClient.cancelQueries({ queryKey: [queryKey] })
    return queryClient.getQueryData([queryKey]) as Ticket[] | undefined
  },

  // Rollback on error
  rollbackOnError: (context: MutationContext) => {
    if (context?.previousTickets) {
      queryClient.setQueryData([queryKey], context.previousTickets)
    }
  },

  // Invalidate and refetch
  invalidateAndRefetch: () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  },

  // Log error
  logError: (action: string, error: unknown) => {
    console.error(`Failed to ${action} ticket:`, error)
  },

  // Log success
  logSuccess: (action: string, data?: any) => {
    console.log(`Mutation: ${action} successful`, data)
  },
})

// Hook to fetch all tickets
export const useTickets = () => {
  return useQuery({
    queryKey: [TICKETS_QUERY_KEY],
    queryFn: ticketApi.getTickets,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  })
}

// Hook to create a new ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  const optimisticUtils = createOptimisticUpdate(queryClient, TICKETS_QUERY_KEY)

  return useMutation({
    mutationFn: ticketApi.createTicket,
    onMutate: async (newTicket) => {
      const previousTickets = await optimisticUtils.prepareOptimisticUpdate()
      
      // Create optimistic ticket
      const optimisticTicket: Ticket = {
        ...newTicket,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      
      // Update cache with optimistic ticket
      queryClient.setQueryData([TICKETS_QUERY_KEY], (old: Ticket[] = []) => 
        [optimisticTicket, ...old]
      )
      
      return { previousTickets: previousTickets || [] }
    },
    onError: (error, _variables, context) => {
      optimisticUtils.rollbackOnError(context as MutationContext)
      optimisticUtils.logError('create', error)
    },
    onSettled: optimisticUtils.invalidateAndRefetch,
    onSuccess: (data) => {
      optimisticUtils.logSuccess('create', data)
    },
  })
}

// Hook to update a ticket
export const useUpdateTicket = () => {
  const queryClient = useQueryClient()
  const optimisticUtils = createOptimisticUpdate(queryClient, TICKETS_QUERY_KEY)

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Ticket> }) =>
      ticketApi.updateTicket(id, updates),
    onMutate: async ({ id, updates }) => {
      const previousTickets = await optimisticUtils.prepareOptimisticUpdate()
      
      // Update cache with optimistic changes
      queryClient.setQueryData([TICKETS_QUERY_KEY], (old: Ticket[] = []) => 
        old.map(ticket => 
          ticket.id === id ? { ...ticket, ...updates } : ticket
        )
      )
      
      return { previousTickets: previousTickets || [] }
    },
    onError: (error, _variables, context) => {
      optimisticUtils.rollbackOnError(context as MutationContext)
      optimisticUtils.logError('update', error)
    },
    onSettled: optimisticUtils.invalidateAndRefetch,
    onSuccess: (data) => {
      optimisticUtils.logSuccess('update', data)
    },
  })
}

// Hook to delete a ticket
export const useDeleteTicket = () => {
  const queryClient = useQueryClient()
  const optimisticUtils = createOptimisticUpdate(queryClient, TICKETS_QUERY_KEY)

  return useMutation({
    mutationFn: ticketApi.deleteTicket,
    onMutate: async (deletedTicketId) => {
      const previousTickets = await optimisticUtils.prepareOptimisticUpdate()
      
      // Remove ticket from cache optimistically
      queryClient.setQueryData([TICKETS_QUERY_KEY], (old: Ticket[] = []) => 
        old.filter(ticket => ticket.id !== deletedTicketId)
      )
      
      return { previousTickets: previousTickets || [] }
    },
    onError: (error, _variables, context) => {
      optimisticUtils.rollbackOnError(context as MutationContext)
      optimisticUtils.logError('delete', error)
    },
    onSettled: optimisticUtils.invalidateAndRefetch,
    onSuccess: () => {
      optimisticUtils.logSuccess('delete')
    },
  })
}
