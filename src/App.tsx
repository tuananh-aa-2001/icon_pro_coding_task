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
import { Upload as UploadIcon } from '@mui/icons-material'
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext'
import { DragDropProvider } from './context/DragDropContext'
import { createAppTheme } from './theme/theme'
import TicketForm from './components/TicketForm'
import PriorityTicketList from './components/PriorityTicketList'
import TicketDetail from './components/TicketDetail'
import ThemeToggle from './components/ThemeToggle'
import ExportButton from './components/ExportButton'
import ImportDialog from './components/ImportDialog'
import { useTicketsApi, useCreateTicket, useUpdateTicket, useDeleteTicket } from './hooks'
import { useBulkImportTickets } from './hooks/useTicketImport'
import type { View } from './types'
import type { Ticket } from './types'
import { ImportOptions } from './types/importExport'

function AppContent() {
  const [view, setView] = useState<View>('form')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const { mode } = useTheme()
  
  // TanStack Query hooks
  const { data: tickets = [], isLoading, error } = useTicketsApi()
  const createTicketMutation = useCreateTicket()
  const updateTicketMutation = useUpdateTicket()
  const deleteTicketMutation = useDeleteTicket()
  const bulkImportMutation = useBulkImportTickets()

  const handleTicketDrop = async (ticketId: string, fromPriority: string, toPriority: string) => {
    try {
      // Update ticket priority via API
      await updateTicketMutation.mutateAsync({
        id: ticketId,
        updates: { priority: toPriority as any }
      })
      console.log(`Ticket ${ticketId} moved from ${fromPriority} to ${toPriority} priority`)
    } catch (error) {
      console.error('Failed to update ticket priority:', error)
    }
  }

  const handleImport = async (importedTickets: Ticket[], options: ImportOptions) => {
    try {
      // Convert tickets to the format expected by the API
      const ticketsToImport = importedTickets.map(({ id, createdAt, ...ticket }) => ticket)
      
      await bulkImportMutation.mutateAsync({
        tickets: ticketsToImport,
        options
      })
      
      setShowImportDialog(false)
    } catch (error) {
      console.error('Failed to import tickets:', error)
      throw error
    }
  }

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
      <AppBar position="static" sx={{ 
        mb: 4,
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ticket Management System
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              onClick={() => setView('form')}
              sx={{ 
                backgroundColor: view === 'form' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderColor: 'rgba(255,255,255,0.7)'
                }
              }}
              size="small"
              variant="outlined"
            >
              Create Ticket
            </Button>
            <Button 
              color="inherit" 
              onClick={() => setView('list')}
              sx={{ 
                backgroundColor: view === 'list' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderColor: 'rgba(255,255,255,0.7)'
                }
              }}
              size="small"
              variant="outlined"
            >
              Ticket List
            </Button>
            <ExportButton tickets={tickets} size="small" />
            <Button 
              variant="contained"
              onClick={() => setShowImportDialog(true)}
              startIcon={<UploadIcon />}
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Import
            </Button>
            <ThemeToggle />
          </Box>
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
              <PriorityTicketList 
                tickets={tickets} 
                onTicketClick={handleTicketClick}
                onTicketDrop={handleTicketDrop}
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

      <ImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImport}
        existingTickets={tickets}
      />
    </ThemeProvider>
  )
}

// Main App component with theme provider
function App() {
  return (
    <AppThemeProvider>
      <DragDropProvider>
        <AppContent />
      </DragDropProvider>
    </AppThemeProvider>
  )
}

export default App
