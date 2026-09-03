import {useState} from 'react'
import {createProcess} from '../services/processService.ts'

interface CreateProcessModalProps {
    onClose: () => void
    onCreated: (process: Awaited<ReturnType<typeof createProcess>>) => void
}

function CreateProcessModal({
                                onClose,
                                onCreated
                            }: CreateProcessModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
    const [assignedEmployeeId, setAssignedEmployeeId] = useState('')
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        setCreating(true)
        setError(null)

        try {
            const newProcess = await createProcess({
                title,
                description,
                priority,
                assignedEmployeeId: assignedEmployeeId || undefined
            })

            onCreated(newProcess)
            onClose()
        } catch {
            setError('Prozess konnte nicht erstellt werden.')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={event => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h2>Neuer Prozess</h2>
                        <p>Erstelle einen neuen Verwaltungsvorgang.</p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Dialog schließen"
                    >
                        ×
                    </button>
                </div>

                <form className="process-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Titel</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            placeholder="z. B. Adressänderung"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Beschreibung</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            placeholder="Beschreibung des Vorgangs"
                            maxLength={1000}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priorität</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={event =>
                                setPriority(
                                    event.target.value as 'LOW' | 'MEDIUM' | 'HIGH'
                                )
                            }
                        >
                            <option value="LOW">Niedrig</option>
                            <option value="MEDIUM">Mittel</option>
                            <option value="HIGH">Hoch</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignedEmployeeId">
                            Mitarbeiter
                        </label>
                        <input
                            id="assignedEmployeeId"
                            type="text"
                            value={assignedEmployeeId}
                            onChange={event =>
                                setAssignedEmployeeId(event.target.value)
                            }
                            placeholder="Mitarbeiter-ID"
                        />
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Abbrechen
                        </button>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={creating}
                        >
                            {creating
                                ? 'Wird erstellt...'
                                : 'Prozess erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProcessModal
