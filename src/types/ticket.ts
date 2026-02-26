import { PriorityLevel } from './dragDrop'

export interface Ticket {
    id: string
    name: string
    surname: string
    company: string
    email: string
    description: string
    priority: PriorityLevel
    createdAt: string
}
