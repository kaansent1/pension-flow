import {useState} from 'react'
import type {Process, ProcessPriority, ProcessStatus} from '../types/process.ts'
import {updateProcessStatus} from '../services/processService.ts'

interface ProcessCardProps {
    process: Process
    onClick: () => void
    onStatusUpdated: (process: Process) => void
    canManageProcesses: boolean
}

function ProcessCard({
                         process,
                         onClick,
                         onStatusUpdated,
                         canManageProcesses
                     }: ProcessCardProps) {
    const [showStatusMenu, setShowStatusMenu] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const statusLabels: Record<ProcessStatus, string> = {
        OPEN: 'Offen',
        IN_PROGRESS: 'In Bearbeitung',
        COMPLETED: 'Abgeschlossen',
        CANCELLED: 'Storniert'
    }

    const priorityLabels: Record<ProcessPriority, string> = {
        LOW: 'Niedrig',
        MEDIUM: 'Mittel',
        HIGH: 'Hoch'
    }

    const isFinal = process.status === 'COMPLETED' || process.status === 'CANCELLED'

    async function handleStatusChange(status: ProcessStatus) {
        if (status === process.status) {
            setShowStatusMenu(false)
            return
        }

        setUpdatingStatus(true)
        setError(null)

        try {
            const updatedProcess = await updateProcessStatus(
                process.id,
                status
            )

            onStatusUpdated(updatedProcess)
            setShowStatusMenu(false)
        } catch {
            setError('Status konnte nicht aktualisiert werden.')
        } finally {
            setUpdatingStatus(false)
        }
    }

    return (
        <div
            className="process-card"
            onClick={onClick}
        >
            <div>
                <h3>{process.title}</h3>
                <p>{process.description}</p>
                <span className={`priority priority-${process.priority.toLowerCase()}`}>
                    Priorität: {priorityLabels[process.priority]}
                </span>
            </div>

            <div
                className="status-container"
                onClick={event => event.stopPropagation()}
            >
                <button
                    type="button"
                    className={`status ${process.status.toLowerCase() ?? 'unknown'} ${
                        !isFinal && canManageProcesses ? 'clickable' : ''
                    }`}
                    onClick={() => {
                        if (!isFinal && canManageProcesses && !updatingStatus) {
                            setShowStatusMenu(current => !current)
                        }
                    }}
                    disabled={updatingStatus || isFinal || !canManageProcesses}
                    aria-expanded={showStatusMenu}
                    aria-haspopup="menu"
                >
                    {updatingStatus
                        ? 'Wird aktualisiert...'
                        : statusLabels[process.status]}

                    {!isFinal && canManageProcesses && (
                        <span className="status-arrow">
                            ▾
                        </span>
                    )}
                </button>

                {showStatusMenu && !isFinal && canManageProcesses && (
                    <div className="status-menu" role="menu" aria-label="Prozessstatus ändern">
                        <button
                            type="button"
                            onClick={() => handleStatusChange('OPEN')}
                        >
                            Offen
                        </button>

                        <button
                            type="button"
                            onClick={() => handleStatusChange('IN_PROGRESS')}
                        >
                            In Bearbeitung
                        </button>

                        <button
                            type="button"
                            onClick={() => handleStatusChange('COMPLETED')}
                        >
                            Abgeschlossen
                        </button>

                        <button
                            type="button"
                            onClick={() => handleStatusChange('CANCELLED')}
                        >
                            Stornieren
                        </button>
                    </div>
                )}
                {error && <span className="inline-error" role="alert">{error}</span>}
            </div>
        </div>
    )
}

export default ProcessCard
