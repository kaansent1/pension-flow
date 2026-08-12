import type { Process} from '../types/process.ts'

const API_URL = 'http://localhost:8080/api/processes'

export async function getProcesses(): Promise<Process[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Prozesse konnten nicht geladen werden.')
    }

    return response.json()
}