import {useState} from 'react'
import type {Process, ProcessPriority} from '../types/process.ts'
import {
    updateProcess
} from '../services/processService.ts'

interface EditProcessModalProps {
    process: Process
    onClose: () => void
    onUpdated: (process: Process) => void
}

function EditProcessModal({
                              process,
                              onClose,
                              onUpdated
                          }: EditProcessModalProps) {
    const [title, setTitle] = useState(process.title)
    const [description, setDescription] = useState(process.description)
    const [priority, setPriority] = useState<ProcessPriority>(process.priority)
    const [assignedEmployeeId, setAssignedEmployeeId] = useState(
        process.assignedEmployeeId ?? ''
    )
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        setUpdating(true)
        setError(null)

        try {
            const updatedProcess = await updateProcess(process.id, {
                title,
                description,
                priority,
                assignedEmployeeId: assignedEmployeeId || undefined
            })

            onUpdated(updatedProcess)
        } catch {
            setError('Prozess konnte nicht aktualisiert werden.')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="process-details-modal"
                onClick={event => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h2>Prozess bearbeiten</h2>
                        <p>{process.title}</p>
                    </div>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="process-form">
                        <div className="form-group">
                            <label htmlFor="edit-title">
                                Titel
                            </label>

                            <input
                                id="edit-title"
                                type="text"
                                value={title}
                                onChange={event =>
                                    setTitle(event.target.value)
                                }
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-description">
                                Beschreibung
                            </label>

                            <textarea
                                id="edit-description"
                                value={description}
                                onChange={event =>
                                    setDescription(event.target.value)
                                }
                                maxLength={1000}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-priority">
                                Priorität
                            </label>

                            <select
                                id="edit-priority"
                                value={priority}
                                onChange={event =>
                                    setPriority(
                                        event.target.value as ProcessPriority
                                    )
                                }
                            >
                                <option value="LOW">
                                    Niedrig
                                </option>

                                <option value="MEDIUM">
                                    Mittel
                                </option>

                                <option value="HIGH">
                                    Hoch
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-employee">
                                Mitarbeiter
                            </label>

                            <input
                                id="edit-employee"
                                type="text"
                                value={assignedEmployeeId}
                                onChange={event =>
                                    setAssignedEmployeeId(
                                        event.target.value
                                    )
                                }
                                placeholder="Mitarbeiter-ID"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <div className="modal-actions">
                        <button
                            className="cancel-button"
                            type="button"
                            onClick={onClose}
                        >
                            Abbrechen
                        </button>

                        <button
                            className="submit-button"
                            type="submit"
                            disabled={updating}
                        >
                            {updating
                                ? 'Wird gespeichert...'
                                : 'Änderungen speichern'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProcessModal