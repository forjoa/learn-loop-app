interface User {
    id: number
    name: string
    email: string
    password: string
    photo: string
    role: string
}

interface Topic {
    id: number
    title: string
    description: string
    ownerId: number
}