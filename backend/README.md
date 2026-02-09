# Decentralised Chat - Backend

Express + Socket.io + MongoDB backend for the Decentralised Chat application.

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/privatechat
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Server will start on [http://localhost:3001](http://localhost:3001)

## 📦 Production

```bash
npm start
```

## 🌐 Deployment

### Deploy to Render (Recommended for Backend)

1. **Create account** at [render.com](https://render.com)

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the `backend` folder
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatechat
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Deploy** - Render will automatically deploy your backend

### Alternative: Deploy to Railway

1. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

2. **Login and Initialize**:
```bash
railway login
railway init
```

3. **Add MongoDB**:
```bash
railway add mongodb
```

4. **Set Environment Variables**:
```bash
railway variables set CORS_ORIGIN=https://your-frontend-url.com
railway variables set NODE_ENV=production
```

5. **Deploy**:
```bash
railway up
```

### Alternative: Deploy to Heroku

1. **Install Heroku CLI** and login:
```bash
heroku login
```

2. **Create Heroku app**:
```bash
heroku create your-app-name
```

3. **Add MongoDB Atlas**:
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string

4. **Set Environment Variables**:
```bash
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set CORS_ORIGIN=https://your-frontend-url.com
heroku config:set NODE_ENV=production
```

5. **Deploy**:
```bash
git push heroku main
```

## 🗄️ MongoDB Setup

### Local Development
- Install MongoDB locally
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # Mac/Linux
  sudo systemctl start mongod
  ```

### Production (MongoDB Atlas)

1. **Create Free Cluster** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Database User**:
   - Go to Database Access
   - Add new user with password

3. **Whitelist IP**:
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update Environment Variable**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/privatechat?retryWrites=true&w=majority
   ```

## 📁 Project Structure

```
backend/
├── server.js          # Main server file
├── models.js          # MongoDB models (User, Room, Message)
├── .env              # Environment variables (local)
├── .env.example      # Environment variables template
└── package.json      # Dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms/:code` - Get room info
- `GET /api/rooms/:code/messages` - Get room messages
- `POST /api/rooms` - Create new room

### Socket.io Events

**Client → Server:**
- `join-room` - Join a chat room
- `send-message` - Send text message
- `send-file` - Send file
- `typing` - User is typing
- `stop-typing` - User stopped typing

**Server → Client:**
- `room-joined` - Confirmation of room join
- `new-message` - New message received
- `user-count` - Active user count
- `user-typing` - Someone is typing
- `user-stop-typing` - Someone stopped typing
- `error` - Error message

## 🔒 Security Notes

⚠️ **Important for Production:**

1. **Password Hashing**: Currently using plain text passwords. Add bcrypt:
   ```bash
   npm install bcrypt
   ```

2. **JWT Authentication**: Implement JWT tokens for secure auth

3. **Rate Limiting**: Add rate limiting to prevent abuse:
   ```bash
   npm install express-rate-limit
   ```

4. **CORS**: Update CORS_ORIGIN to your actual frontend URL

5. **Environment Variables**: Never commit `.env` file to git

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify MONGODB_URI in `.env`
- For Atlas: Check IP whitelist and credentials

### CORS Errors
- Update CORS_ORIGIN in `.env` to match your frontend URL
- For multiple origins, use comma-separated values

### Port Already in Use
- Change PORT in `.env`
- Kill process using port 3001:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3001 | xargs kill
  ```

## 📄 License

MIT
