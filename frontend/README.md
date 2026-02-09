# Decentralised Chat - Frontend

Next.js frontend for the Decentralised Chat application.

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed
- Backend server running

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Set Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-backend.onrender.com`)
   - `NEXT_PUBLIC_SOCKET_URL` = Your backend URL (e.g., `https://your-backend.onrender.com`)

4. **Deploy to Production**:
```bash
vercel --prod
```

### Alternative: Deploy to Netlify

1. **Install Netlify CLI**:
```bash
npm i -g netlify-cli
```

2. **Build the project**:
```bash
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod
```

4. **Set Environment Variables** in Netlify Dashboard:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SOCKET_URL`

## 📁 Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── page.js         # Home page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── chat/[code]/    # Chat room page
│   ├── layout.js       # Root layout
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── MessageList.jsx
│   ├── FileUpload.jsx
│   └── Timer.jsx
├── lib/               # Utility functions
│   └── socket.js      # Socket.io client
├── .env               # Environment variables (local)
├── .env.example       # Environment variables template
└── package.json       # Dependencies
```

## 🔧 Configuration

### Update Backend URL

For production, update `.env` or set environment variables in your hosting platform:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

## 📝 Features

- ✅ Real-time messaging with Socket.io
- ✅ File sharing (images, videos, documents)
- ✅ User authentication
- ✅ 24-hour chat expiry timer
- ✅ Responsive design
- ✅ Dark mode support

## 🐛 Troubleshooting

### Cannot connect to backend
- Ensure backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Verify CORS settings in backend

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (should be 18+)

## 📄 License

MIT
