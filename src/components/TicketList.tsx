import React from 'react'
import { Ticket } from '../types'
import './TicketList.css'

type Props = {
  tickets: Ticket[]
  onTicketClick: (ticket: Ticket) => void
}

const TicketList: React.FC<Props> = ({ tickets, onTicketClick }) => {
  if (!tickets || tickets.length === 0) {
    return <div>No tickets yet. Create one using the menu.</div>;
  }

  return (
    <div className="tickets-wrapper">
      {[...tickets].reverse().map((t, index) => (
        <article className="ticket-card" key={t.id} onClick={() => onTicketClick(t)}>
          <div className="ticket-number">#{index + 1}</div>
          <div className="field-row">
            <div>
              Name: {t.name} {t.surname}
            </div>
            <div>
              Company: {t.company}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            Email: {t.email}
          </div>
          <div style={{ marginTop: 8 }}>
            Created: {new Date(t.createdAt).toLocaleString()}
          </div>
          <div style={{ marginTop: 8 }}>
            Description:
            <p>{t.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default TicketList
