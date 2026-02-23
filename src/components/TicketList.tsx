import React, { useState, useMemo } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Container,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup
} from '@mui/material'
import { Search as SearchIcon, Sort as SortIcon } from '@mui/icons-material'
import { Ticket } from '../types'

type SortField = 'date' | 'name' | 'company'
type SortDirection = 'asc' | 'desc'

type Props = {
  tickets: Ticket[]
  onTicketClick: (ticket: Ticket) => void
}

const TicketList: React.FC<Props> = ({ tickets, onTicketClick }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = tickets.filter(ticket => 
        ticket.name.toLowerCase().includes(query) ||
        ticket.surname.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query) ||
        `${ticket.name} ${ticket.surname}`.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'name':
          comparison = `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
          break
        case 'company':
          comparison = a.company.localeCompare(b.company)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [tickets, searchQuery, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // Change field and default to desc for date, asc for others
      setSortField(field)
      setSortDirection(field === 'date' ? 'desc' : 'asc')
    }
  }

  if (!tickets || tickets.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tickets yet. Create one using the menu.
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
        />
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredAndSortedTickets.length} ticket{filteredAndSortedTickets.length !== 1 ? 's' : ''} found
        </Typography>
        
        <ButtonGroup size="small" variant="outlined">
          <Button
            onClick={() => handleSort('date')}
            variant={sortField === 'date' ? 'contained' : 'outlined'}
            startIcon={<SortIcon />}
          >
            Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            onClick={() => handleSort('name')}
            variant={sortField === 'name' ? 'contained' : 'outlined'}
            startIcon={<SortIcon />}
          >
            Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            onClick={() => handleSort('company')}
            variant={sortField === 'company' ? 'contained' : 'outlined'}
            startIcon={<SortIcon />}
          >
            Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
        </ButtonGroup>
      </Box>

      {filteredAndSortedTickets.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tickets found matching "{searchQuery}"
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            py: 2,
          }}
        >
          {filteredAndSortedTickets.map((ticket) => (
            <Card
              key={ticket.id}
              sx={{
                flex: '0 0 340px',
                minWidth: 340,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => onTicketClick(ticket)}
            >
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Chip
                  label={`#${tickets.indexOf(ticket) + 1}`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                />
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Name: {ticket.name} {ticket.surname}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Company: {ticket.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      Email: {ticket.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      Created: {new Date(ticket.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Description:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {ticket.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  )
}

export default TicketList
