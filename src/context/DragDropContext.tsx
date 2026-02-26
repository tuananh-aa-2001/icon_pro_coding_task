import React, { createContext, useContext, useState, useCallback } from 'react'
import { Ticket } from '../types/ticket'
import { PriorityLevel, DragContextType } from '../types/dragDrop'

const DragDropContext = createContext<DragContextType | undefined>(undefined)

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null)
  const [draggedOverPriority, setDraggedOverPriority] = useState<PriorityLevel | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const startDragging = useCallback((ticket: Ticket) => {
    setDraggedTicket(ticket)
    setIsDragging(true)
  }, [])

  const stopDragging = useCallback(() => {
    setDraggedTicket(null)
    setDraggedOverPriority(null)
    setIsDragging(false)
  }, [])

  const setDraggedOver = useCallback((priority: PriorityLevel | null) => {
    setDraggedOverPriority(priority)
  }, [])

  const value: DragContextType = {
    draggedTicket,
    draggedOverPriority,
    isDragging,
    startDragging,
    stopDragging,
    setDraggedOver,
  }

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  )
}

export const useDragDrop = (): DragContextType => {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider')
  }
  return context
}
