'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/resources/UserContext'
import { API } from '@/resources/constants'
import { generateChatId } from '@/resources/helperFuctions'
import { Chat, User } from '@/resources/types'

export default function UserLandingPage() {
    const router = useRouter()
    const { user } = useUser()
    const [users, setUsers] = useState<User[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const fetchUsers = useCallback(
        async (pageNum: number) => {
            try {
                const response = await fetch(
                    `${API}/users?page=${pageNum}&limit=10&currentUserId=${user}`,
                )
                const data = await response.json()
                if (data.length === 0) {
                    setHasMore(false)
                } else {
                    setUsers((prevUsers) => {
                        const newUsers = data.filter(
                            (newUser: { id: string }) =>
                                !prevUsers.some(
                                    (prevUser) => prevUser.id === newUser.id,
                                ),
                        )
                        return [...prevUsers, ...newUsers]
                    })
                    setPage(pageNum)
                }
            } catch (error) {
                console.error('Error fetching users:', error)
                setHasMore(false)
            }
        },
        [user],
    )

    const fetchChats = useCallback(async () => {
        const response = await fetch(
            `${API}/users/${user}/chats`,
        )
        const data = await response.json()
        setChats(data)
    }, [user])

    const handleChatClick = (chatId: string) => {
        router.push(`account/chat/${chatId}`)
    }

    const handleUserClick = async (userId: string) => {
        const chatId = generateChatId(user as string, userId)
        let chat = chats.find((chat) => chat.users.some((u) => u.id === userId))

        if (!chat) {
            router.push(`/chat/${chatId}`)
        }
        handleChatClick(chatId)
    }

    const loadMoreUsers = () => {
        fetchUsers(page + 1)
    }

    useEffect(() => {
        if (!user) {
            router.push('/')
        } else {
            fetchUsers(1)
            fetchChats()
        }
    }, [user, router, fetchChats, fetchUsers])

    return (
        <div>
            <h1>Home</h1>
            <div>
                <h2>Users</h2>
                <ul>
                    {users.map((u) => (
                        <li
                            key={u.id}
                            onClick={() => handleUserClick(u.id)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            {u.id}
                        </li>
                    ))}
                </ul>
                {hasMore && (
                    <button onClick={loadMoreUsers}>Load More Users</button>
                )}
            </div>
            <div>
                <h2>Chats</h2>
                <ul>
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                        >
                            {chat.id}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
