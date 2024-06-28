export function receivingParty(chatId: string, user: string) {
    const userIds = chatId.split('_').slice(1)
    return userIds.find((id) => id !== user) || ''
}

export function generateChatId(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort()
    return `chat_${sortedIds[0]}_${sortedIds[1]}`
}