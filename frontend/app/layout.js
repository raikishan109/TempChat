import './globals.css'

export const metadata = {
    title: 'TempChat - Temporary Anonymous Chat',
    description: 'TempChat: Secure, anonymous, temporary chat platform with 24-hour auto-delete',
    icons: {
        icon: [
            {
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238B5CF6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%233B82F6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='20' fill='url(%23grad)'/%3E%3Ctext x='50' y='70' font-family='Arial,sans-serif' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3ETC%3C/text%3E%3C/svg%3E",
                type: "image/svg+xml",
            }
        ],
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
