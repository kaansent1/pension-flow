import {useMemo, useState} from 'react'
import type {Process, ProcessPriority, ProcessStatus} from '../types/process.ts'
import type {DemoUser} from '../types/auth.ts'
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
    currentUser: DemoUser
    canManageProcesses: boolean
    canDeleteProcesses: boolean
}

function DashboardPage({
                           processes,
                           loading,
                           error,
                           onCreateProcess,
                           onProcessUpdated,
                           onProcessDeleted,
                           currentUser,
                           canManageProcesses,
                           canDeleteProcesses
                       }: DashboardPageProps) {
    const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
    const [editingProcess, setEditingProcess] = useState<Process | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'ALL' | ProcessStatus>('ALL')
    const [priorityFilter, setPriorityFilter] = useState<'ALL' | ProcessPriority>('ALL')
    const [sortBy, setSortBy] = useState<'NEWEST' | 'PRIORITY'>('NEWEST')


    const openCount = processes.filter(
        process => process.status === 'OPEN'
    ).length

    const inProgressCount = processes.filter(
        process => process.status === 'IN_PROGRESS'
    ).length

    const completedCount = processes.filter(
        process => process.status === 'COMPLETED'
    ).length

    const filteredProcesses = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase('de-DE')
        const priorityOrder: Record<ProcessPriority, number> = {HIGH: 3, MEDIUM: 2, LOW: 1}

        return processes
            .filter(process => {
                const matchesSearch = !normalizedSearch
                    || process.title.toLocaleLowerCase('de-DE').includes(normalizedSearch)
                    || process.description.toLocaleLowerCase('de-DE').includes(normalizedSearch)
                    || process.assignedEmployeeId?.toLocaleLowerCase('de-DE').includes(normalizedSearch)

                return matchesSearch
                    && (statusFilter === 'ALL' || process.status === statusFilter)
                    && (priorityFilter === 'ALL' || process.priority === priorityFilter)
            })
            .sort((first, second) => sortBy === 'PRIORITY'
                ? priorityOrder[second.priority] - priorityOrder[first.priority]
                : new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    }, [processes, priorityFilter, searchTerm, sortBy, statusFilter])

    async function handleDeleteProcess(id: string) {
        setActionError(null)
        try {
            await deleteProcess(id)
            onProcessDeleted(id)
            setSelectedProcess(null)
        } catch {
            setActionError('Der Prozess konnte nicht gelöscht werden. Bitte versuche es erneut.')
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
                    {currentUser.initials}
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

                    {canManageProcesses && <button onClick={onCreateProcess}>Neuer Prozess</button>}
                </div>

                <div className="process-controls" aria-label="Vorgänge filtern und sortieren">
                    <label className="search-field" htmlFor="process-search">
                        <span className="sr-only">Vorgänge durchsuchen</span>
                        <input
                            id="process-search"
                            type="search"
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            placeholder="Nach Titel, Beschreibung oder Mitarbeiter suchen"
                        />
                    </label>

                    <label>
                        <span>Status</span>
                        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'ALL' | ProcessStatus)}>
                            <option value="ALL">Alle Status</option>
                            <option value="OPEN">Offen</option>
                            <option value="IN_PROGRESS">In Bearbeitung</option>
                            <option value="COMPLETED">Abgeschlossen</option>
                            <option value="CANCELLED">Storniert</option>
                        </select>
                    </label>

                    <label>
                        <span>Priorität</span>
                        <select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value as 'ALL' | ProcessPriority)}>
                            <option value="ALL">Alle Prioritäten</option>
                            <option value="HIGH">Hoch</option>
                            <option value="MEDIUM">Mittel</option>
                            <option value="LOW">Niedrig</option>
                        </select>
                    </label>

                    <label>
                        <span>Sortierung</span>
                        <select value={sortBy} onChange={event => setSortBy(event.target.value as 'NEWEST' | 'PRIORITY')}>
                            <option value="NEWEST">Neueste zuerst</option>
                            <option value="PRIORITY">Höchste Priorität</option>
                        </select>
                    </label>
                </div>

                <p className="result-summary" aria-live="polite">
                    {filteredProcesses.length} {filteredProcesses.length === 1 ? 'Vorgang' : 'Vorgänge'} angezeigt
                </p>

                <ProcessList
                    processes={filteredProcesses}
                    loading={loading}
                    error={error}
                    onProcessClick={process => setSelectedProcess(process)}
                    onStatusUpdated={onProcessUpdated}
                    canManageProcesses={canManageProcesses}
                    emptyMessage={processes.length === 0
                        ? 'Lege den ersten Verwaltungsvorgang an, um die Bearbeitung zu starten.'
                        : 'Für die aktuelle Suche und Filterauswahl wurden keine Vorgänge gefunden.'}
                />

                {actionError && <p className="feedback-message error-message" role="alert">{actionError}</p>}
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
                    canManageProcesses={canManageProcesses}
                    canDeleteProcesses={canDeleteProcesses}
                    currentUser={currentUser}
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
