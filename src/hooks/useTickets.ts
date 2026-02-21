import { useState, useEffect } from 'react'
import { Ticket } from '../types'

function loadTickets(): Ticket[] {
    try {
        const raw = localStorage.getItem('tickets')
        return raw ? (JSON.parse(raw) as Ticket[]) : []
    } catch {
        return []
    }
}

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>(loadTickets)

    useEffect(() => {
        try {
            localStorage.setItem('tickets', JSON.stringify(tickets))
        } catch { }
    }, [tickets])

    const addTicket = (data: Omit<Ticket, 'id' | 'createdAt'>) => {
        const newTicket: Ticket = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...data,
        }
        setTickets((prev) => [newTicket, ...prev])
    }

    const updateTicket = (id: string, data: Omit<Ticket, 'id' | 'createdAt'>) => {
        setTickets((prev) =>
            prev.map((ticket) =>
                ticket.id === id
                    ? { ...ticket, ...data }
                    : ticket
            )
        )
    }

    const deleteTicket = (id: string) => {
        setTickets((prev) => prev.filter((ticket) => ticket.id !== id))
    }

    return { tickets, addTicket, updateTicket, deleteTicket }
}
