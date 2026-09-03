import './index.css'
import {useEffect, useState} from "react";
import {getProcesses, setApiActor} from "./services/processService.ts";
import type {Process} from './types/process.ts'
import {demoUsers, roleLabels, type DemoUser} from './types/auth.ts'
import CreateProcessModal from "./components/CreateProcessModel.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";

function App() {
    const [processes, setProcesses] = useState<Process[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [currentUser, setCurrentUser] = useState<DemoUser>(() => {
        const storedRole = localStorage.getItem('pension-flow-demo-user')
        return demoUsers.find(user => user.role === storedRole) ?? demoUsers[0]
    })

    useEffect(() => {
        setApiActor(currentUser.name)
        localStorage.setItem('pension-flow-demo-user', currentUser.role)
    }, [currentUser])

    const canManageProcesses = currentUser.role !== 'VIEWER'
    const canDeleteProcesses = currentUser.role === 'ADMIN'

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

                <div className="user-switcher">
                    <label htmlFor="demo-user">Demo-Rolle</label>
                    <select
                        id="demo-user"
                        value={currentUser.role}
                        onChange={event => setCurrentUser(
                            demoUsers.find(user => user.role === event.target.value) ?? demoUsers[0]
                        )}
                    >
                        {demoUsers.map(user => (
                            <option key={user.role} value={user.role}>
                                {user.name} · {roleLabels[user.role]}
                            </option>
                        ))}
                    </select>
                    <p>{roleLabels[currentUser.role]}</p>
                </div>
            </aside>

            <main className="main-content">
                <DashboardPage
                    processes={processes}
                    loading={loading}
                    error={error}
                    onCreateProcess={() => setShowCreateForm(true)}
                    currentUser={currentUser}
                    canManageProcesses={canManageProcesses}
                    canDeleteProcesses={canDeleteProcesses}
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

            {showCreateForm && canManageProcesses && (
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
