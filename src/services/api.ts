import axios from 'axios'
import { Ticket } from '../types'

const API_BASE_URL = (window as any).REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock data for development (since we don't have a real ticket API)
const mockTickets: Ticket[] = [
  {
    id: '1',
    name: 'John',
    surname: 'Doe',
    company: 'Tech Corp',
    email: 'john.doe@techcorp.com',
    description: 'Issue with login functionality',
    priority: 'high',
    createdAt: new Date('2024-01-15T10:30:00').toISOString(),
  },
  {
    id: '2',
    name: 'Jane',
    surname: 'Smith',
    company: 'Design Studio',
    email: 'jane.smith@designstudio.com',
    description: 'Feature request for dark mode',
    priority: 'medium',
    createdAt: new Date('2024-01-16T14:20:00').toISOString(),
  },
  {
    id: '3',
    name: 'Mike',
    surname: 'Johnson',
    company: 'Startup Inc',
    email: 'mike.johnson@startupinc.com',
    description: 'Bug report in mobile view',
    priority: 'high',
    createdAt: new Date('2024-01-17T09:15:00').toISOString(),
  },
  {
    id: '4',
    name: 'Sarah',
    surname: 'Williams',
    company: 'Enterprise Co',
    email: 'sarah.williams@enterprise.com',
    description: 'Performance optimization suggestion',
    priority: 'low',
    createdAt: new Date('2024-01-18T16:45:00').toISOString(),
  },
  {
    id: '5',
    name: 'Tom',
    surname: 'Brown',
    company: 'Digital Agency',
    email: 'tom.brown@digitalagency.com',
    description: 'Integration with third-party service',
    priority: 'medium',
    createdAt: new Date('2024-01-19T11:30:00').toISOString(),
  },
]

export const ticketApi = {
  // Get all tickets
  getTickets: async (): Promise<Ticket[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return mock data (in real app, this would be: api.get('/tickets'))
    return mockTickets
  },


  createTicket: async (ticket: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      createdAt: new Date().toISOString(),
      priority: 'medium', // Default priority for new tickets
    }
    
    // In real app, this would be: api.post('/tickets', ticket)
    mockTickets.push(newTicket)
    return newTicket
  },

 
  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('API: Updating ticket', { id, updates })
    
    const ticketIndex = mockTickets.findIndex(t => t.id === id)
    if (ticketIndex === -1) {
      throw new Error('Ticket not found')
    }
    
    mockTickets[ticketIndex] = { ...mockTickets[ticketIndex], ...updates }
    console.log('API: Updated ticket result:', mockTickets[ticketIndex])
    return mockTickets[ticketIndex]
  },

  // Update ticket priority
  updateTicketPriority: async (id: string, newPriority: string): Promise<Ticket> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    console.log('API: Updating ticket priority', { id, newPriority })
    
    const ticketIndex = mockTickets.findIndex(t => t.id === id)
    if (ticketIndex === -1) {
      throw new Error('Ticket not found')
    }
    
    mockTickets[ticketIndex] = { 
      ...mockTickets[ticketIndex], 
      priority: newPriority as any 
    }
    console.log('API: Updated ticket priority result:', mockTickets[ticketIndex])
    return mockTickets[ticketIndex]
  },

  // Delete a ticket
  deleteTicket: async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const ticketIndex = mockTickets.findIndex(t => t.id === id)
    if (ticketIndex === -1) {
      throw new Error('Ticket not found')
    }
    
    mockTickets.splice(ticketIndex, 1)
    // In real app, this would be: api.delete(`/tickets/${id}`)
  },
}

export default api
