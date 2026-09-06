export type UserRole = 'ADMIN' | 'CLERK' | 'VIEWER'

export interface DemoUser {
    name: string
    initials: string
    role: UserRole
}

export const demoUsers: DemoUser[] = [
    {name: 'Rudi Assauer', initials: 'RA', role: 'ADMIN'},
    {name: 'Kaan Sentürk', initials: 'KS', role: 'CLERK'},
    {name: 'Max Mustermann', initials: 'MM', role: 'VIEWER'}
]

export const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administration',
    CLERK: 'Sachbearbeitung',
    VIEWER: 'Lesender Zugriff'
}
