import { Ticket } from './ticket'

export type PriorityLevel = 'high' | 'medium' | 'low'

export interface DragItem {
  id: string
  type: 'ticket'
  ticket: Ticket
}

export interface DropResult {
  ticketId: string
  fromPriority: PriorityLevel
  toPriority: PriorityLevel
}

export interface DragContextType {
  draggedTicket: Ticket | null
  draggedOverPriority: PriorityLevel | null
  isDragging: boolean
  startDragging: (ticket: Ticket) => void
  stopDragging: () => void
  setDraggedOver: (priority: PriorityLevel | null) => void
}

export interface PriorityColumn {
  priority: PriorityLevel
  tickets: Ticket[]
  title: string
  color: string
  icon: string
}
