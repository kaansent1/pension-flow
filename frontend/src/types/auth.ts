export type UserRole = 'ADMIN' | 'CLERK' | 'VIEWER'

export interface DemoUser {
    name: string
    initials: string
    role: UserRole
}

export const demoUsers: DemoUser[] = [
    {name: 'Kaan Sentürk', initials: 'KS', role: 'ADMIN'},
    {name: 'Max Mustermann', initials: 'MM', role: 'CLERK'},
    {name: 'Rudi Assauer', initials: 'RA', role: 'VIEWER'}
]

export const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administration',
    CLERK: 'Sachbearbeitung',
    VIEWER: 'Lesender Zugriff'
}
