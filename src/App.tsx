import { useState } from 'react'
import './App.css'
import TicketForm from './components/TicketForm'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'
import { useTickets } from './hooks'
import type { View } from './types'
import type { Ticket } from './types'

function App() {
  const [view, setView] = useState<View>('form')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const { tickets, addTicket, updateTicket, deleteTicket } = useTickets()

  const handleAdd: Parameters<typeof TicketForm>[0]['onAdd'] = (data) => {
    addTicket(data)
    setView('list')
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setView('detail')
  }

  const handleTicketUpdate = (id: string, data: Omit<Ticket, 'id' | 'createdAt'>) => {
    updateTicket(id, data)
    // Update selectedTicket with the new data to reflect changes immediately
    setSelectedTicket(prev => 
      prev?.id === id 
        ? { ...prev, ...data }
        : prev
    )
  }

  const handleTicketDelete = (id: string) => {
    deleteTicket(id)
  }

  const handleCloseDetail = () => {
    setSelectedTicket(null)
    setView('list')
  }

  return (
    <div className="app-root">
      <header className="top-menu">
        <h1 className="brand">Support Tickets</h1>
        <nav>
          <button
            className={view === 'form' ? 'active' : ''}
            onClick={() => setView('form')}
          >
            Create Ticket
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            Ticket List
          </button>
        </nav>
      </header>
      <main className="container">
        {view === 'form' ? (
          <TicketForm onAdd={handleAdd} />
        ) : view === 'list' ? (
          <TicketList tickets={tickets} onTicketClick={handleTicketClick} />
        ) : view === 'detail' && selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            onUpdate={handleTicketUpdate}
            onDelete={handleTicketDelete}
            onClose={handleCloseDetail}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
