import React, { memo, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material'
import { PriorityLevel, PriorityColumn as PriorityColumnType } from '../types/dragDrop'
import { useDragDrop } from '../context/DragDropContext'
import { TicketCard } from './TicketCard'

interface PriorityColumnProps {
  column: PriorityColumnType
  onTicketClick: (ticket: any) => void
  onTicketDrop: (ticketId: string, fromPriority: PriorityLevel, toPriority: PriorityLevel) => void
}

const PriorityColumnComponent: React.FC<PriorityColumnProps> = ({ 
  column, 
  onTicketClick,
  onTicketDrop
}) => {
  const theme = useTheme()
  const { draggedOverPriority, setDraggedOver, draggedTicket, stopDragging } = useDragDrop()

  const isDraggedOver = draggedOverPriority === column.priority

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOver(column.priority)
  }, [column.priority, setDraggedOver])

  const handleDragLeave = useCallback(() => {
    setDraggedOver(null)
  }, [setDraggedOver])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOver(null)
    
    if (draggedTicket && draggedTicket.priority !== column.priority) {
      onTicketDrop(draggedTicket.id, draggedTicket.priority, column.priority)
    }
    stopDragging()
  }, [draggedTicket, column.priority, onTicketDrop, stopDragging, setDraggedOver])

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main
      case 'medium':
        return theme.palette.warning.main
      case 'low':
        return theme.palette.success.main
      default:
        return theme.palette.grey[500]
    }
  }

  return (
    <Paper
      sx={{
        minHeight: 400,
        p: 2,
        mr: 2,
        borderRadius: 2,
        border: `2px dashed ${alpha(getPriorityColor(column.priority), 0.3)}`,
        backgroundColor: isDraggedOver 
          ? alpha(getPriorityColor(column.priority), 0.1)
          : 'transparent',
        transition: 'all 0.2s ease',
        cursor: isDraggedOver ? 'copy' : 'default',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {column.icon}
          </Typography>
          <Typography variant="h6" component="div" sx={{ 
            fontSize: '1.1rem', 
            fontWeight: 600,
            color: getPriorityColor(column.priority)
          }}>
            {column.title}
          </Typography>
          <Typography variant="body2" sx={{ 
            fontSize: '0.875rem', 
            color: 'text.secondary',
            ml: 'auto'
          }}>
            {column.tickets.length} ticket{column.tickets.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        
        <Box sx={{ 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          pt: 1,
          minHeight: 300
        }}>
          {column.tickets.map((ticket, index) => (
            <Box key={ticket.id} sx={{ mb: 1 }}>
              <TicketCard 
                ticket={ticket} 
                ticketNumber={index + 1}
                onClick={() => onTicketClick(ticket)}
                draggable
              />
            </Box>
          ))}
          
          {column.tickets.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8, 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}>
              No tickets in this priority level
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

export const PriorityColumn = memo(PriorityColumnComponent)
