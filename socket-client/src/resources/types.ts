export type Message = {
    chatId: string
    user: string
    content: string
    created: string
    messageType: string
    fileName: string
}

export type FileMessage = {
    name: string
    type: string
    data: ArrayBuffer
    user: string
}

export type Chat = {
    id: string
    users: User[]
}


export type User = {
    id: string
    name: string
}

