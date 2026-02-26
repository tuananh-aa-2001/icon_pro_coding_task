import React from 'react'
import { Box, Typography } from '@mui/material'
import { PriorityLevel } from '../types/dragDrop'
import { Ticket } from '../types'
import { PriorityColumn } from './PriorityColumn'
import { useDragDrop } from '../context/DragDropContext'
import { useTicketPriority } from '../hooks/useTicketPriority'

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
  const { draggedTicket, stopDragging } = useDragDrop()
  const { priorityColumns } = useTicketPriority(tickets)

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
            <PriorityColumn 
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
