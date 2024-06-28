'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/resources/UserContext'
import { signInOrSignUp } from '@/resources/apiRequests'

export default function SignInPage() {
    const [username, setUsername] = useState<string>('')
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const router = useRouter()
    const { setUser } = useUser()

    const handleSignIn = async () => {
        if (username.trim()) {
            const response = await signInOrSignUp(username)
            if (response?.status === 200) {
                setUser(username)
                router.push('/account')
            } else {
                router.push('/')
                console.error('Failed to sign up')
            }
        }
    }

    const handleSignUp = async () => {
        if (username.trim()) {
            const response = await signInOrSignUp(username, false)
            if (response?.ok) {
                setUser(username)
                router.push('/account')
            } else {
                console.error('Failed to sign up')
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isSignUp) {
            handleSignUp()
        } else {
            handleSignIn()
        }
    }

    return (
        <div>
            <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    className='text-cyan-800'
                    placeholder='Enter your username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type='submit'>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
            </button>
        </div>
    )
}
