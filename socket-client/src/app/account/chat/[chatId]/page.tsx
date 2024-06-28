'use client'
import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/resources/UserContext'
import { FixedSizeList as List } from 'react-window'
import io from 'socket.io-client'
import { API } from '@/resources/constants'
import { receivingParty } from '@/resources/helperFuctions'
import { Chat, FileMessage, Message } from '@/resources/types'

const socket = io(API, {
    transports: ['websocket', 'polling'],
})

export default function ChatPage() {
    const params = useParams()
    const chatId = params.chatId as string
    const { user } = useUser()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [chat, setChat] = useState<Chat | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [file, setFile] = useState<File | null>(null)
    const isCurrentUserMessage = (message: Message) => message.user === user

    const sendMessage = async () => {
        if (inputValue.trim() !== '') {
            socket.emit('message', {
                chatId,
                content: inputValue.trim(),
                user,
                messageType: 'Text',
                recipient: receivingParty(chatId, user as string),
            })
            setInputValue('')
        } else if (fileInputRef?.current?.value !== '') {
            sendFile()
        }
    }

    const renderRow = ({
        index,
        style,
    }: {
        index: number
        style: any
    }) => {
        const message = messages[index]
        return (
            <div
                style={{
                    ...style,
                    display: 'flex',
                    justifyContent: isCurrentUserMessage(message)
                        ? 'flex-start'
                        : 'flex-end',
                    width: '100%',
                }}
            >
                <div
                    key={message.chatId}
                    className={`message w-auto rounded-md ${
                        isCurrentUserMessage(message)
                            ? 'current-user self-start bg-blue-600'
                            : 'other-user self-end bg-orange-400'
                    }`}
                >
                    <div className='message-content w-auto'>
                        {renderMessage(message)}
                    </div>
                </div>
            </div>
        )
    }

    const sendFile = async () => {
        if (file && user) {
            if (!chat) {
                const recipient = receivingParty(chatId, user as string)
                try {
                    const response = await fetch(`${API}/chats`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: chatId,
                            users: [user, recipient],
                        }),
                    })
                    if (!response.ok) throw new Error('Failed to create chat')
                    const newChat = await response.json()
                    setChat(newChat)
                } catch (error) {
                    console.error('Error creating chat:', error)
                    return
                }
            }

            const reader = new FileReader()
            reader.onload = () => {
                const fileData: FileMessage = {
                    name: file.name,
                    type: file.type,
                    data: reader.result as ArrayBuffer,
                    user,
                }
                socket.emit('file', { ...fileData, chatId: chatId as string })
            }
            reader.readAsArrayBuffer(file)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleDownload = (fileId: string) => {
        socket.emit('downloadFile', fileId)
    }

    const renderMessage = (message: Message) => {

        return (
            <>
                <div
                    className={`font-light italic text-sm text-right flex justify-end  w-full pl-2 pr-1 rounded-t-md ${
                        isCurrentUserMessage(message)
                            ? 'bg-blue-500'
                            : ' bg-orange-300'
                    }`}
                >
                    {message.user}
                </div>
                {message.messageType !== 'Text' ? (
                    <div className='w-full px-4 bg-gray-400 text-black rounded-b-md hover:text-gray-200'>
                        <button
                            onClick={() => handleDownload(message.fileName)}
                        >
                            Download {message.content}
                        </button>
                    </div>
                ) : (
                    <div className='w-full px-4 '>{message.content}</div>
                )}
            </>
        )
    }

    const fetchChat = useCallback(async () => {
        try {
            const response = await fetch(`${API}/chats/${chatId}`)
            if (response.ok) {
                const chatData = await response.json()
                setChat(chatData)
                setMessages(chatData || [])
            }
        } catch (error) {
            console.error('Error fetching chat:', error)
        }
    }, [chatId])

    useEffect(() => {
        if (chatId) {
            fetchChat()
        }
    }, [chatId, fetchChat])

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to WebSocket server')
        })
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server')
        })
        socket.on('message', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message])
            console.log('Received message:', message)
        })
        socket.on('file', (file: FileMessage & { chatId: string }) => {
            const fileMessage: any = {
                chatId: file.chatId,
                user,
                content: file.name,
                messageType: 'file',
                created: new Date().toDateString(),
            }
            setMessages((prevMessages) => [...prevMessages, fileMessage])
            setFile(null)
        })
        socket.on(
            'fileData',
            (fileData: { name: string; data: ArrayBuffer }) => {
                const blob = new Blob([fileData.data])
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = fileData.name
                a.click()
                URL.revokeObjectURL(url)
            },
        )
        socket.on('error', (error) => {
            console.error('WebSocket error:', error)
        })
        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off('message')
            socket.off('file')
            socket.off('fileData')
            socket.off('activeUsers')
        }
    })

    return (
        <div className='flex flex-col items-center w-full mt-24 '>
            <div className='messages-container flex flex-col gap-3 justify-center w-1/2 px-10 bg-slate-500 rounded-md py-16 max-h-[500px]  overflow-y-auto'>
                <List
                    height={500}
                    itemCount={messages.length}
                    itemSize={50}
                    width={'auto'}
                >
                    {renderRow}
                </List>
            </div>
            <input
                type='text'
                value={inputValue}
                className='text-black'
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage()
                }}
            />
            <button onClick={sendMessage}>Send</button>
            <input
                type='file'
                ref={fileInputRef}
                onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                }
            />
        </div>
    )
}
