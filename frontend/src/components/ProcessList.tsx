import type {Process} from '../types/process.ts'
import ProcessCard from './ProcessCard.tsx'

interface ProcessListProps {
    processes: Process[]
    loading: boolean
    error: string | null
    onProcessClick: (process: Process) => void
    onStatusUpdated: (process: Process) => void
    emptyMessage?: string
    canManageProcesses: boolean
}

function ProcessList({
                         processes,
                         loading,
                         error,
                         onProcessClick,
                         onStatusUpdated,
                         canManageProcesses,
                         emptyMessage = 'Lege den ersten Verwaltungsvorgang an, um die Bearbeitung zu starten.'
                     }: ProcessListProps) {
    if (loading) {
        return <p className="feedback-message" role="status">Prozesse werden geladen...</p>
    }

    if (error) {
        return <p className="feedback-message error-message" role="alert">{error}</p>
    }

    if (processes.length === 0) {
        return (
            <div className="empty-state">
                <strong>Noch keine Vorgänge</strong>
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="process-list">
            {processes.map(process => (
                <ProcessCard
                    key={process.id}
                    process={process}
                    onClick={() => onProcessClick(process)}
                    onStatusUpdated={onStatusUpdated}
                    canManageProcesses={canManageProcesses}
                />
            ))}
        </div>
    )
}

export default ProcessList
