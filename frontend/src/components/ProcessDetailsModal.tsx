import {useEffect, useState} from 'react'
import type {Process} from '../types/process.ts'
import type {DemoUser} from '../types/auth.ts'
import {getAuditEvents, type AuditEvent} from '../services/processService.ts'

interface ProcessDetailsModalProps {
    process: Process
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
    canManageProcesses: boolean
    canDeleteProcesses: boolean
    currentUser: DemoUser
}

function ProcessDetailsModal({
                                 process,
                                 onClose,
                                 onEdit,
                                 onDelete,
                                 canManageProcesses,
                                 canDeleteProcesses,
                                 currentUser
                             }: ProcessDetailsModalProps) {
    const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
    const [auditError, setAuditError] = useState(false)
    const statusLabels = {
        OPEN: 'Offen',
        IN_PROGRESS: 'In Bearbeitung',
        COMPLETED: 'Abgeschlossen',
        CANCELLED: 'Storniert'
    }

    const priorityLabels = {
        LOW: 'Niedrig',
        MEDIUM: 'Mittel',
        HIGH: 'Hoch'
    }

    const actionLabels: Record<AuditEvent['action'], string> = {
        CREATED: 'Angelegt',
        UPDATED: 'Aktualisiert',
        STATUS_CHANGED: 'Status geändert',
        DELETED: 'Gelöscht'
    }

    useEffect(() => {
        getAuditEvents(process.id)
            .then(setAuditEvents)
            .catch(() => setAuditError(true))
    }, [process.id])

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="process-details-modal"
                onClick={event => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h2>{process.title}</h2>
                        <p>Prozessdetails</p>
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Dialog schließen"
                    >
                        ×
                    </button>
                </div>

                <div className="process-details">
                    <div className="detail-item">
                        <span>Beschreibung</span>
                        <strong>
                            {process.description || 'Keine Beschreibung'}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <div className="detail-item">
                            <span>Status</span>
                            <strong>
                                {statusLabels[process.status]}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Priorität</span>
                            <strong>
                                {priorityLabels[process.priority]}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span>Mitarbeiter</span>
                        <strong>
                            {process.assignedEmployeeId || 'Nicht zugewiesen'}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <div className="detail-item">
                            <span>Erstellt</span>
                            <strong>
                                {new Date(process.createdAt).toLocaleString('de-DE')}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Zuletzt aktualisiert</span>
                            <strong>
                                {new Date(process.updatedAt).toLocaleString('de-DE')}
                            </strong>
                        </div>
                    </div>
                </div>

                <section className="audit-log" aria-labelledby="audit-log-title">
                    <div className="audit-log-heading">
                        <div>
                            <h3 id="audit-log-title">Aktivitätsverlauf</h3>
                            <p>Nachvollziehbar für Prüfung und Übergabe.</p>
                        </div>
                        <span className="current-actor">Aktiv: {currentUser.name}</span>
                    </div>

                    {auditError && <p className="inline-error">Audit-Log konnte nicht geladen werden.</p>}
                    {!auditError && auditEvents.length === 0 && <p className="audit-empty">Noch keine protokollierten Änderungen.</p>}
                    <ol className="audit-events">
                        {auditEvents.map(event => (
                            <li key={event.id}>
                                <span className="audit-marker" aria-hidden="true" />
                                <div>
                                    <strong>{actionLabels[event.action]}</strong>
                                    <p>{event.detail}</p>
                                    <small>{event.actor} · {new Date(event.occurredAt).toLocaleString('de-DE')}</small>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="modal-actions">
                    {canDeleteProcesses && <button
                        className="delete-button"
                        type="button"
                        onClick={onDelete}
                    >
                        Löschen
                    </button>}

                    <div>
                        <button
                            className="cancel-button"
                            type="button"
                            onClick={onClose}
                        >
                            Schließen
                        </button>

                        {canManageProcesses && <button
                            className="submit-button"
                            type="button"
                            onClick={onEdit}
                        >
                            Bearbeiten
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProcessDetailsModal
