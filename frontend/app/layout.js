import './globals.css'

export const metadata = {
    title: 'TempChat - Temporary Anonymous Chat',
    description: 'TempChat: Secure, anonymous, temporary chat platform with 24-hour auto-delete',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
