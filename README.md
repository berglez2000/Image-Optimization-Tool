# Image Optimization Tool 🖼️

A powerful web-based image optimization tool built with React and Node.js. Optimize your images for web with ease - convert formats, adjust quality, resize, and reduce file sizes significantly.

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT tokens
- 📤 **Drag & Drop Upload** - Easy file upload with drag and drop support
- 🎨 **Quality Control** - Adjustable quality slider (1-100) with visual guides
- 🔄 **Format Conversion** - Convert to WebP, JPEG, or PNG
- 📏 **Auto-resize** - Automatically resize images wider than 1920px
- 💾 **Storage Savings** - See exactly how much space you've saved
- ⬇️ **Batch Download** - Download all optimized images as ZIP
- 🗑️ **Auto-cleanup** - Files deleted immediately after download
- 📊 **Processing Logs** - Track optimization history in database

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MySQL (MAMP)
- Sharp (image processing)
- JWT authentication
- Multer (file uploads)
- Archiver (ZIP creation)

### Frontend
- React.js
- Tailwind CSS + DaisyUI
- Font Awesome icons
- React Router
- Axios
- React Dropzone

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MAMP** or MySQL server
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd "/Users/aljaz/projects/Image Optimization Tool"
```

### 2. Database Setup

1. **Start MAMP** and ensure MySQL is running on port `8889`

2. **Access phpMyAdmin:**
   - Open: http://localhost:8888/phpMyAdmin5/
   - Login with username: `root`, password: `root`

3. **Create Database:**
   - Click "New" to create a new database
   - Name it: `image_optimizer`
   - Or run this SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS image_optimizer;
   ```

4. **Import Schema:**
   - Select the `image_optimizer` database
   - Click "Import" tab
   - Choose file: `database/schema.sql`
   - Click "Go"
   
   Or copy and paste the contents of `database/schema.sql` into the SQL tab and execute.

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the contents from backend/env.example.txt to a new file called .env
# Update any values if needed (default values should work for local MAMP setup)

# Your .env file should contain:
# DB_HOST=localhost
# DB_PORT=8889
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=image_optimizer
# PORT=5000
# NODE_ENV=development
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# JWT_EXPIRE=7d
# MAX_FILE_SIZE=10485760
# MAX_FILES=20
# UPLOAD_PATH=./uploads
# FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
# Copy the contents from frontend/env.example.txt to a new file called .env

# Your .env file should contain:
# REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Running the Application

You'll need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3000 and open automatically in your browser.

## 📱 Usage

### 1. Register/Login
- Open http://localhost:3000
- Create a new account or login with existing credentials

### 2. Upload Images
- Drag and drop images (or click to select)
- Supports: JPEG, PNG, GIF, WebP
- Max 10MB per file, up to 20 files at once

### 3. Configure Settings
- **Quality Slider:** Adjust from 1-100 (default: 85)
  - 🟢 90-100: Maximum quality
  - 🟡 70-90: Recommended (best balance)
  - 🔴 Below 70: High compression
- **Format:** Choose WebP, JPEG, or PNG
- **Auto-resize:** Images > 1920px width automatically resized

### 4. Process & Download
- Click "Process Images"
- View optimization results and savings
- Download individual files or all as ZIP
- Files auto-delete after download

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Images
- `POST /api/images/process` - Upload and process images (protected)
- `GET /api/images/download/:filename` - Download single image (protected)
- `POST /api/images/download-zip` - Download all as ZIP (protected)
- `DELETE /api/images/delete` - Delete files (protected)

### Health Check
- `GET /api/health` - API health status

## 🗂️ Project Structure

```
Image Optimization Tool/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MySQL connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── imageController.js   # Image processing logic
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── upload.js            # Multer config
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth routes
│   │   │   └── images.js            # Image routes
│   │   ├── services/
│   │   │   └── imageProcessor.js    # Sharp image processing
│   │   └── utils/
│   ├── uploads/                      # Temporary file storage
│   ├── server.js                     # Express server
│   ├── package.json
│   └── env.example.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   └── PrivateRoute.js      # Route protection
│   │   ├── contexts/
│   │   │   └── AuthContext.js       # Auth state management
│   │   ├── services/
│   │   │   └── api.js               # API calls
│   │   ├── utils/
│   │   │   └── formatters.js        # Helper functions
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Tailwind styles
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── env.example.txt
├── database/
│   └── schema.sql                    # Database schema
└── README.md
```

## 🔧 Configuration

### File Upload Limits
- **Max file size:** 10MB per file
- **Max files:** 20 files per batch
- **Allowed formats:** JPEG, JPG, PNG, GIF, WebP

### Image Processing
- **Quality range:** 1-100 (default: 85)
- **Max width:** 1920px (auto-resize if larger)
- **Output formats:** WebP, JPEG, PNG
- **Metadata:** Stripped for smaller file size

### Security
- JWT token expiration: 7 days
- Rate limiting: 100 requests per 15 minutes
- CORS enabled for frontend URL
- Helmet.js security headers

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MAMP is running and MySQL is on port 8889
- Check credentials in backend/.env match MAMP settings
- Verify database `image_optimizer` exists

### Backend Won't Start
- Check if port 5000 is already in use
- Run `npm install` in backend directory
- Ensure .env file exists with correct values

### Frontend Won't Connect
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Clear browser cache and localStorage

### Upload Errors
- Ensure uploads directory exists: `backend/uploads/`
- Check file size is under 10MB
- Verify file format is supported (images only)

### Sharp Installation Issues (Mac M1/M2)
```bash
cd backend
rm -rf node_modules package-lock.json
npm install --platform=darwin --arch=arm64 sharp
npm install
```

## 🔮 Future Enhancements (Phase 2)

- [ ] WordPress REST API integration
- [ ] Direct upload to WordPress Media Library
- [ ] Bulk image optimization
- [ ] Image filters and effects
- [ ] User statistics dashboard
- [ ] Custom watermarking
- [ ] Image comparison slider

## 📝 Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique, user email
- `password_hash` - Bcrypt hashed password
- `created_at` - Registration timestamp

### Processing Logs Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `original_filename` - Original file name
- `original_size` - Original file size (bytes)
- `optimized_size` - Optimized file size (bytes)
- `format` - Output format
- `quality` - Quality setting used
- `processed_at` - Processing timestamp

### WP Settings Table (Future Use)
- `id` - Primary key
- `user_id` - Foreign key to users
- `wp_site_url` - WordPress site URL
- `wp_username` - WordPress username
- `wp_app_password` - WordPress application password

## 📄 License

This project is for personal/client use. Modify as needed.

## 👨‍💻 Support

For issues or questions, check the troubleshooting section above or review the code comments.

---

**Built with ❤️ for optimizing images and improving web performance**

