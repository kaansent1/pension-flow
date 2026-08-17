import type {Process, ProcessPriority, ProcessStatus} from '../types/process.ts'

const API_URL = `https://pension-flow-service.onrender.com/api/processes`

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

export async function getProcesses(): Promise<Process[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Prozesse konnten nicht geladen werden.')
    }

    return response.json()
}

export async function getProcess(id: string): Promise<Process> {
    const response = await fetch(`${API_URL}/${id}`)

    if (!response.ok) {
        throw new Error('Prozess konnte nicht geladen werden.')
    }

    return response.json()
}

export async function createProcess(
    request: CreateProcessRequest
): Promise<Process> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error('Prozess konnte nicht erstellt werden.')
    }

    return response.json()
}

export async function updateProcess(
    id: string,
    request: UpdateProcessRequest
): Promise<Process> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error('Prozess konnte nicht aktualisiert werden.')
    }

    return response.json()
}

export async function updateProcessStatus(
    id: string,
    status: ProcessStatus
): Promise<Process> {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status}),
    })

    if (!response.ok) {
        throw new Error('Status konnte nicht aktualisiert werden.')
    }

    return response.json()
}

export async function deleteProcess(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Prozess konnte nicht gelöscht werden.')
    }
}