import {useState} from 'react'
import type {Process, ProcessStatus} from '../types/process.ts'
import {updateProcessStatus} from '../services/processService.ts'

interface ProcessCardProps {
    process: Process
    onClick: () => void
    onStatusUpdated: (process: Process) => void
}

function ProcessCard({
                         process,
                         onClick,
                         onStatusUpdated
                     }: ProcessCardProps) {
    const [showStatusMenu, setShowStatusMenu] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)

    const statusLabels: Record<ProcessStatus, string> = {
        OPEN: 'Offen',
        IN_PROGRESS: 'In Bearbeitung',
        COMPLETED: 'Abgeschlossen',
        CANCELLED: 'Gelöscht'
    }

    const isCompleted = process.status === 'COMPLETED'

    async function handleStatusChange(status: ProcessStatus) {
        if (status === process.status) {
            setShowStatusMenu(false)
            return
        }

        setUpdatingStatus(true)

        try {
            const updatedProcess = await updateProcessStatus(
                process.id,
                status
            )

            console.log('Backend response:', updatedProcess)

            onStatusUpdated(updatedProcess)
            setShowStatusMenu(false)
        } catch (error) {
            console.error(
                'Status konnte nicht aktualisiert werden.',
                error
            )
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
            </div>

            <div
                className="status-container"
                onClick={event => event.stopPropagation()}
            >
                <button
                    type="button"
                    className={`status ${process.status.toLowerCase() ?? 'unknown'} ${
                        !isCompleted ? 'clickable' : ''
                    }`}
                    onClick={() => {
                        if (!isCompleted && !updatingStatus) {
                            setShowStatusMenu(current => !current)
                        }
                    }}
                    disabled={updatingStatus || isCompleted}
                >
                    {updatingStatus
                        ? 'Wird aktualisiert...'
                        : statusLabels[process.status]}

                    {!isCompleted && (
                        <span className="status-arrow">
                            ▾
                        </span>
                    )}
                </button>

                {showStatusMenu && !isCompleted && (
                    <div className="status-menu">
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProcessCard