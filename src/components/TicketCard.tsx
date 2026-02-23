import React from 'react'
import { 
  Box,
  Card, 
  CardContent, 
  Typography, 
  Chip
} from '@mui/material'
import { Ticket } from '../types'

type Props = {
  ticket: Ticket
  ticketNumber: number
  onClick: (ticket: Ticket) => void
}

const TicketCard: React.FC<Props> = ({ ticket, ticketNumber, onClick }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
      onClick={() => onClick(ticket)}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Chip
          label={`#${ticketNumber}`}
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
  )
}

export default TicketCard
