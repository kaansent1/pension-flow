import type {Process, ProcessPriority, ProcessStatus} from '../types/process.ts'

const API_URL = import.meta.env.VITE_API_URL
    ?? (import.meta.env.DEV
        ? 'http://localhost:8080/api/processes'
        : 'https://pension-flow-service.onrender.com/api/processes')

let currentActor = 'System'

export interface AuditEvent {
    id: string
    action: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED'
    actor: string
    detail: string
    occurredAt: string
}

export interface CreateProcessRequest {
    title: string
    description: string
    priority: ProcessPriority
    assignedEmployeeId?: string
}

export interface UpdateProcessRequest {
    title: string
    description: string
    priority: ProcessPriority
    assignedEmployeeId?: string
}

export function setApiActor(actor: string) {
    currentActor = actor
}

function mutationHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-Actor': currentActor
    }
}

export async function getProcesses(): Promise<Process[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Prozesse konnten nicht geladen werden.')
    return response.json()
}

export async function getAuditEvents(id: string): Promise<AuditEvent[]> {
    const response = await fetch(`${API_URL}/${id}/audit`)
    if (!response.ok) throw new Error('Audit-Log konnte nicht geladen werden.')
    return response.json()
}

export async function createProcess(request: CreateProcessRequest): Promise<Process> {
    const response = await fetch(API_URL, {
        method: 'POST', headers: mutationHeaders(), body: JSON.stringify(request)
    })
    if (!response.ok) throw new Error('Prozess konnte nicht erstellt werden.')
    return response.json()
}

export async function updateProcess(id: string, request: UpdateProcessRequest): Promise<Process> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', headers: mutationHeaders(), body: JSON.stringify(request)
    })
    if (!response.ok) throw new Error('Prozess konnte nicht aktualisiert werden.')
    return response.json()
}

export async function updateProcessStatus(id: string, status: ProcessStatus): Promise<Process> {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH', headers: mutationHeaders(), body: JSON.stringify({status})
    })
    if (!response.ok) throw new Error('Status konnte nicht aktualisiert werden.')
    return response.json()
}

export async function deleteProcess(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE', headers: {'X-Actor': currentActor}
    })
    if (!response.ok) throw new Error('Prozess konnte nicht gelöscht werden.')
}
