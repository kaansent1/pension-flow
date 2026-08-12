import type {Process} from '../types/process.ts'
import ProcessCard from './ProcessCard.tsx'

interface ProcessListProps {
    processes: Process[]
    loading: boolean
    error: string | null
    onProcessClick: (process: Process) => void
    onStatusUpdated: (process: Process) => void
}

function ProcessList({
                         processes,
                         loading,
                         error,
                         onProcessClick,
                         onStatusUpdated
                     }: ProcessListProps) {
    if (loading) {
        return <p>Prozesse werden geladen...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="process-list">
            {processes.map(process => (
                <ProcessCard
                    key={process.id}
                    process={process}
                    onClick={() => onProcessClick(process)}
                    onStatusUpdated={onStatusUpdated}
                />
            ))}
        </div>
    )
}

export default ProcessList