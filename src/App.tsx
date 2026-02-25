import { useState } from 'react'
import { 
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CircularProgress,
  Alert
} from '@mui/material'
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext'
import { createAppTheme } from './theme/theme'
import TicketForm from './components/TicketForm'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'
import ThemeToggle from './components/ThemeToggle'
import { useTicketsApi, useCreateTicket, useUpdateTicket, useDeleteTicket } from './hooks'
import type { View } from './types'
import type { Ticket } from './types'

function AppContent() {
  const [view, setView] = useState<View>('form')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const { mode } = useTheme()
  
  // TanStack Query hooks
  const { data: tickets = [], isLoading, error } = useTicketsApi()
  const createTicketMutation = useCreateTicket()
  const updateTicketMutation = useUpdateTicket()
  const deleteTicketMutation = useDeleteTicket()

  const handleAdd: Parameters<typeof TicketForm>[0]['onAdd'] = (data) => {
    createTicketMutation.mutate(data, {
      onSuccess: () => {
        // Navigate to list view after successful creation
        setView('list')
        // Optionally scroll to top or highlight the new ticket
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setView('detail')
  }

  const handleUpdate = (id: string, data: Omit<Ticket, 'id' | 'createdAt'>) => {
    updateTicketMutation.mutate({
      id,
      updates: data
    }, {
      onSuccess: (updatedTicket) => {
        // Update the selectedTicket with the new data
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(updatedTicket)
        }
      }
    })
  }

  const handleDelete = (id: string) => {
    deleteTicketMutation.mutate(id)
    setView('list')
  }

  const handleBack = () => {
    setView('list')
  }

  if (error) {
    return (
      <ThemeProvider theme={createAppTheme(mode)}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load tickets. Please try again later.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ticket Management System
          </Typography>
          <ThemeToggle />
          <Button 
            color="inherit" 
            onClick={() => setView('form')}
            sx={{ 
              ml: 2,
              backgroundColor: view === 'form' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Create Ticket
          </Button>
          <Button 
            color="inherit" 
            onClick={() => setView('list')}
            sx={{ 
              ml: 2,
              backgroundColor: view === 'list' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Ticket List
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {view === 'form' && (
              <TicketForm onAdd={handleAdd} />
            )}
            {view === 'list' && (
              <TicketList 
                tickets={tickets} 
                onTicketClick={handleTicketClick}
              />
            )}
            {view === 'detail' && selectedTicket && (
                <TicketDetail
                  ticket={selectedTicket}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onClose={handleBack}
                />
              )}
          </>
        )}
      </Container>
    </ThemeProvider>
  )
}

// Main App component with theme provider
function App() {
  return (
    <AppThemeProvider>
      <AppContent />
    </AppThemeProvider>
  )
}

export default App
