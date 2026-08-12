import type {Process} from '../types/process.ts'

interface ProcessDetailsModalProps {
    process: Process
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}

function ProcessDetailsModal({
                                 process,
                                 onClose,
                                 onEdit,
                                 onDelete
                             }: ProcessDetailsModalProps) {
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
                                {process.status}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Priorität</span>
                            <strong>
                                {process.priority}
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

                <div className="modal-actions">
                    <button
                        className="delete-button"
                        type="button"
                        onClick={onDelete}
                    >
                        Löschen
                    </button>

                    <div>
                        <button
                            className="cancel-button"
                            type="button"
                            onClick={onClose}
                        >
                            Schließen
                        </button>

                        <button
                            className="submit-button"
                            type="button"
                            onClick={onEdit}
                        >
                            Bearbeiten
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProcessDetailsModal