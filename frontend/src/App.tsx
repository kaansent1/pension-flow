import './index.css'
import {useEffect, useState} from "react";
import {getProcesses} from "./services/processService.ts";
import type {Process} from './types/process.ts'

function App() {
    const [processes, setProcesses] = useState<Process[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getProcesses()
            .then(setProcesses)
            .catch(() => {
                setError('Prozesse konnten nicht geladen werden.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, []);

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

                        <button>Neuer Prozess</button>
                    </div>

                    <div className="process-list">
                        {loading && (
                            <p>Prozesse werden geladen...</p>
                        )}

                        {error && (
                            <p>{error}</p>
                        )}

                        {!loading && !error && processes.map(process => (
                            <div className="process-card" key={process.id}>
                                <div>
                                    <h3>{process.title}</h3>
                                    <p>{process.description}</p>
                                </div>

                                <span className={`status ${process.status.toLowerCase()}`}>
                                    {process.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default App