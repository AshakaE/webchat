'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/resources/UserContext'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <UserProvider>{children}</UserProvider>
            </body>
        </html>
    )
}
