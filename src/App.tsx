import { useState } from 'react'
import { 
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material'
import { theme } from './theme/theme'
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Support Tickets
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={view === 'form' ? 'contained' : 'outlined'}
                onClick={() => setView('form')}
                sx={{ 
                  color: view === 'form' ? 'primary.contrastText' : 'primary.main',
                  bgcolor: view === 'form' ? 'primary.main' : 'transparent',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: view === 'form' ? 'primary.dark' : 'primary.light',
                    color: view === 'form' ? 'primary.contrastText' : 'primary.contrastText',
                  }
                }}
              >
                Create Ticket
              </Button>
              <Button
                variant={view === 'list' ? 'contained' : 'outlined'}
                onClick={() => setView('list')}
                sx={{ 
                  color: view === 'list' ? 'primary.contrastText' : 'primary.main',
                  bgcolor: view === 'list' ? 'primary.main' : 'transparent',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: view === 'list' ? 'primary.dark' : 'primary.light',
                    color: view === 'list' ? 'primary.contrastText' : 'primary.contrastText',
                  }
                }}
              >
                Ticket List
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
        <Container maxWidth="lg">
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
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
