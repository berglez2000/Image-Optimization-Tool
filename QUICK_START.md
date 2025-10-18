# 🚀 Quick Start Guide

Follow these steps to get your Image Optimization Tool running in minutes!

## Step 1: Database Setup (2 minutes)

1. **Start MAMP**
   - Open MAMP application
   - Click "Start Servers"
   - Wait for MySQL to start (green light)

2. **Create Database**
   - Open: http://localhost:8888/phpMyAdmin5/
   - Login: username `root`, password `root`
   - Click "New" database
   - Name: `image_optimizer`
   - Click "Create"

3. **Import Schema**
   - Select `image_optimizer` database
   - Click "Import" tab
   - Choose file: `database/schema.sql`
   - Click "Go"

✅ Database ready!

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install packages
npm install

# Create .env file
cp env.example.txt .env

# Note: Open .env and verify settings match your MAMP configuration
```

✅ Backend configured!

## Step 3: Frontend Setup (2 minutes)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install packages
npm install

# Create .env file
cp env.example.txt .env
```

✅ Frontend configured!

## Step 4: Run the Application (1 minute)

**Open TWO terminal windows:**

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
You should see:
```
✅ Database connected successfully
🚀 Image Optimizer API Server
Port: 5000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Browser will open automatically at http://localhost:3000

✅ Application running!

## Step 5: Test It Out! (1 minute)

1. **Register** a new account
2. **Upload** some images (drag & drop)
3. **Adjust** quality slider (try 85)
4. **Select** format (try WebP)
5. **Click** "Process Images"
6. **Download** your optimized images!

## 🎉 You're Done!

The entire setup takes about **8 minutes**.

## ⚠️ Common Issues

**Port already in use?**
```bash
# Check what's using port 5000
lsof -i :5000
# Kill it or change PORT in backend/.env
```

**Database connection failed?**
- Check MAMP is running
- Verify port 8889 in backend/.env
- Ensure database `image_optimizer` exists

**Frontend can't connect?**
- Make sure backend is running first
- Check console for errors
- Verify REACT_APP_API_URL in frontend/.env

## 📚 Need More Help?

See the full [README.md](README.md) for detailed documentation.

