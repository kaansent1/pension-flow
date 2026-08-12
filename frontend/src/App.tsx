import './index.css'
import {useEffect, useState} from "react";
import {getProcesses} from "./services/processService.ts";
import type {Process} from './types/process.ts'
import CreateProcessModal from "./components/CreateProcessModel.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";

function App() {
    const [processes, setProcesses] = useState<Process[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    useEffect(() => {
        getProcesses()
            .then(setProcesses)
            .catch(() => {
                setError('Prozesse konnten nicht geladen werden.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="logo">
                    Pension Flow
                </div>

                <nav>
                    <a className="nav-item active">Dashboard</a>
                    <a className="nav-item">Prozesse</a>
                </nav>
            </aside>

            <main className="main-content">
                <DashboardPage
                    processes={processes}
                    loading={loading}
                    error={error}
                    onCreateProcess={() => setShowCreateForm(true)}
                    onProcessUpdated={updatedProcess => {
                        setProcesses(current =>
                            current.map(process =>
                                process.id === updatedProcess.id
                                    ? updatedProcess
                                    : process
                            )
                        )
                    }}
                    onProcessDeleted={id => {
                        setProcesses(current =>
                            current.filter(process => process.id !== id)
                        )
                    }}
                />
            </main>

            {showCreateForm && (
                <CreateProcessModal
                    onClose={() => setShowCreateForm(false)}
                    onCreated={newProcess => {
                        setProcesses(current => [newProcess, ...current])
                    }}
                />
            )}
        </div>
    )
}

export default App