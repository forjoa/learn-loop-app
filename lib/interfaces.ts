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

interface Noti {
    id: number
    userId: number
    title: string
    content: string
    createdAt?: string
    updatedAt?: string
}