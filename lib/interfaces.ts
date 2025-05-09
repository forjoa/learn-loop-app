export interface User {
    id: number
    name: string
    email: string
    password: string
    photo: string
    role: string
}

export interface Topic {
    id: number
    title: string
    description: string
    ownerId: number
}

export interface Noti {
    id: number
    userId: number
    title: string
    content: string
    createdAt?: string
    updatedAt?: string
}

export interface TopicWithUsers extends Topic {
    users: UserInTopic[]
    owner: Owner
}

export interface UserInTopic {
    status: string
    userId: number
}

export interface Owner {
    id: number
    name: string
}

export interface Post {
    id: number
    title: string
    content: string
    userId: number
    topicId: number
    createdAt: string
}

export interface DetailedTopic extends Topic {
    users: User[]
    owner: Owner
    posts: Post[]
}

export interface File {
    userId: number
    id: number
    createdAt: Date
    updatedAt: Date
    url: string
    filename: string
    fileType: string
    postId: number
}

export interface DetailedPost extends Post {
    file: File
}
