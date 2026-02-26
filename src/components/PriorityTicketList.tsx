import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { PriorityLevel, PriorityColumn as PriorityColumnType } from '../types/dragDrop'
import { Ticket } from '../types'
import PriorityColumnComponent from './PriorityColumn'
import { useDragDrop } from '../context/DragDropContext'

interface PriorityTicketListProps {
  tickets: Ticket[]
  onTicketClick: (ticket: Ticket) => void
  onTicketDrop: (ticketId: string, fromPriority: PriorityLevel, toPriority: PriorityLevel) => void
}

const PriorityTicketList: React.FC<PriorityTicketListProps> = ({ 
  tickets, 
  onTicketClick,
  onTicketDrop 
}) => {
  const theme = useTheme()
  const { draggedTicket, stopDragging } = useDragDrop()

  // Group tickets by priority
  const groupTicketsByPriority = (tickets: Ticket[]): PriorityColumnType[] => {
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
  }

  const handleDrop = (e: React.DragEvent, targetPriority: PriorityLevel) => {
    e.preventDefault()
    
    if (draggedTicket) {
      const fromPriority = draggedTicket.priority
      onTicketDrop(draggedTicket.id, fromPriority, targetPriority)
      stopDragging()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const priorityColumns = groupTicketsByPriority(tickets)

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="div" sx={{ mb: 3, fontWeight: 600 }}>
        Ticket Prioritization Board
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 2,
        mb: 4
      }}>
        {priorityColumns.map((column) => (
          <Box
            key={column.priority}
            onDrop={(e) => handleDrop(e, column.priority)}
            onDragOver={handleDragOver}
            sx={{ minHeight: 500 }}
          >
            <PriorityColumnComponent 
              column={column}
              onTicketClick={onTicketClick}
              onTicketDrop={onTicketDrop}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default PriorityTicketList
