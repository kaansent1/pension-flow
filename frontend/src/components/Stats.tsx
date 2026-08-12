import type {Process} from '../types/process.ts'

interface StatsProps {
    processes: Process[]
}

function Stats({processes}: StatsProps) {
    const openCount = processes.filter(
        process => process.status === 'OPEN'
    ).length

    const inProgressCount = processes.filter(
        process => process.status === 'IN_PROGRESS'
    ).length

    const completedCount = processes.filter(
        process => process.status === 'COMPLETED'
    ).length

    return (
        <section className="stats">
            <div className="stat-card">
                <span>Alle Prozesse</span>
                <strong>{processes.length}</strong>
            </div>

            <div className="stat-card">
                <span>Offen</span>
                <strong>{openCount}</strong>
            </div>

            <div className="stat-card">
                <span>In Bearbeitung</span>
                <strong>{inProgressCount}</strong>
            </div>

            <div className="stat-card">
                <span>Abgeschlossen</span>
                <strong>{completedCount}</strong>
            </div>
        </section>
    )
}

export default Stats