export type ProcessStatus =
    | 'OPEN'
    | 'IN_PROGRESS'
    | 'COMPLETED'

export type ProcessPriority =
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'

export interface Process {
    id: string
    title: string
    description: string
    status: ProcessStatus
    priority: ProcessPriority
    assignedEmployeeId: string | null
    createdAt: string
    updatedAt: string
}