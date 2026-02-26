import { useMemo } from 'react'
import { Ticket } from '../types'
import { PriorityLevel } from '../types/dragDrop'
import { useTheme } from '@mui/material'

export const useTicketPriority = (tickets: Ticket[]) => {
  const theme = useTheme()

  const priorityColumns = useMemo(() => {
    const priorities: PriorityLevel[] = ['high', 'medium', 'low']
    
    return priorities.map((priority) => ({
      priority,
      title: priority.charAt(0).toUpperCase() + priority.slice(1) + ' Priority',
      icon: priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢',
      color: priority === 'high' 
        ? theme.palette.error.main 
        : priority === 'medium' 
          ? theme.palette.warning.main 
          : theme.palette.success.main,
      tickets: tickets.filter(ticket => ticket.priority === priority)
    }))
  }, [tickets, theme])

  return { priorityColumns }
}
