import {useState} from 'react'
import type {Process} from '../types/process.ts'
import ProcessDetailsModal from '../components/ProcessDetailsModal.tsx'
import EditProcessModal from '../components/EditProcessModal.tsx'
import {deleteProcess} from "../services/processService.ts";
import ProcessList from "../components/ProcessList.tsx";

interface DashboardPageProps {
    processes: Process[]
    loading: boolean
    error: string | null
    onCreateProcess: () => void
    onProcessUpdated: (process: Process) => void
    onProcessDeleted: (id: string) => void
}

function DashboardPage({
                           processes,
                           loading,
                           error,
                           onCreateProcess,
                           onProcessUpdated,
                           onProcessDeleted
                       }: DashboardPageProps) {
    const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
    const [editingProcess, setEditingProcess] = useState<Process | null>(null)


    const openCount = processes.filter(
        process => process.status === 'OPEN'
    ).length

    const inProgressCount = processes.filter(
        process => process.status === 'IN_PROGRESS'
    ).length

    const completedCount = processes.filter(
        process => process.status === 'COMPLETED'
    ).length

    async function handleDeleteProcess(id: string) {
        try {
            await deleteProcess(id)
            onProcessDeleted(id)
            setSelectedProcess(null)
        } catch (error) {
            console.error('Prozess konnte nicht gelöscht werden.', error)
        }
    }

    return (
        <>
            <header className="header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Übersicht deiner Verwaltungsprozesse</p>
                </div>

                <div className="user">
                    KS
                </div>
            </header>

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

            <section className="process-section">
                <div className="section-header">
                    <div>
                        <h2>Aktuelle Prozesse</h2>
                        <p>Die zuletzt erstellten Verwaltungsvorgänge</p>
                    </div>

                    <button onClick={onCreateProcess}>
                        Neuer Prozess
                    </button>
                </div>

                <div className="process-list">

                    <ProcessList
                        processes={processes}
                        loading={loading}
                        error={error}
                        onProcessClick={process => setSelectedProcess(process)}
                        onStatusUpdated={onProcessUpdated}
                    />
                </div>
            </section>

            {selectedProcess && (
                <ProcessDetailsModal
                    process={selectedProcess}
                    onClose={() => setSelectedProcess(null)}
                    onEdit={() => {
                        setEditingProcess(selectedProcess)
                        setSelectedProcess(null)
                    }}
                    onDelete={() => {
                        const confirmed = window.confirm(
                            `Möchtest du den Prozess "${selectedProcess.title}" wirklich löschen?`
                        )

                        if (!confirmed) {
                            return
                        }

                        handleDeleteProcess(selectedProcess.id)
                    }}
                />
            )}

            {editingProcess && (
                <EditProcessModal
                    process={editingProcess}
                    onClose={() => setEditingProcess(null)}
                    onUpdated={updatedProcess => {
                        onProcessUpdated(updatedProcess)
                        setEditingProcess(null)
                    }}
                />
            )}
        </>
    )
}

export default DashboardPage