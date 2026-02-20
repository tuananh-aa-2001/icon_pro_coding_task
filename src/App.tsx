import { useState } from 'react'
import './App.css'
import TicketForm from './components/TicketForm'
import TicketList from './components/TicketList'
import { useTickets } from './hooks'
import type { View } from './types'

function App() {
  const [view, setView] = useState<View>('form')
  const { tickets, addTicket } = useTickets()

  const handleAdd: Parameters<typeof TicketForm>[0]['onAdd'] = (data) => {
    addTicket(data)
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
        ) : (
          <TicketList tickets={tickets} />
        )}
      </main>
    </div>
  )
}

export default App
