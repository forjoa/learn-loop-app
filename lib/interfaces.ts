export interface User {
  id: string
  name: string
  email: string
  password: string
  photo: string
  role: string
}

export interface Topic {
  id: string
  title: string
  description: string
  ownerId: string
}

export interface Noti {
  id: string
  userId: string
  title: string
  content: string
  enrollmentId?: string
  createdAt?: string
  updatedAt?: string
}

export interface TopicWithUsers extends Topic {
  users: UserInTopic[]
  owner: Owner
}

export interface UserInTopic {
  status: string
  userId: string
}

export interface Owner {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  content: string
  userId: string
  topicId: string
  createdAt: string
}

export interface DetailedTopic extends Topic {
  users: User[]
  owner: Owner
  posts: Post[]
}

export interface File {
  userId: string
  id: string
  createdAt: Date
  updatedAt: Date
  url: string
  filename: string
  fileType: string
  postId: string
}

export interface DetailedPost extends Post {
  file: File
}

export interface Chat {
  id: string
  type: string
  topicId: string
  topicName: string
  lastMessage: string
  lastMessageDate: string
  users: User[]
}

export interface Message {
  id: string
  content: string
  sender: Partial<User>
  chatId: string
  createdAt: string
}
