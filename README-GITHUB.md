# Image Optimization Tool 🖼️

A professional web-based image optimization tool built with React and Node.js. Optimize images for web with ease - convert formats, adjust quality, resize, and reduce file sizes significantly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT tokens
- 📤 **Drag & Drop Upload** - Easy file upload with drag and drop support (up to 20 files, 10MB each)
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
- MySQL database
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
- **MySQL** server
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/image-optimization-tool.git
cd image-optimization-tool
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE image_optimizer;
```

Import the schema:

```bash
mysql -u your_user -p image_optimizer < database/schema.sql
```

Or manually import `database/schema.sql` via phpMyAdmin.

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
cp env.example.txt .env

# Edit .env with your database credentials
nano .env
```

Update `.env` with your values:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=image_optimizer
```

Start the backend:
```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
cp env.example.txt .env
```

Update `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📦 Project Structure

```
image-optimization-tool/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, upload, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Image processing
│   │   └── utils/           # Helper functions
│   ├── uploads/             # Temporary file storage
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Auth context
│   │   ├── services/        # API calls
│   │   └── utils/           # Helper functions
│   └── package.json
├── database/
│   └── schema.sql           # Database schema
└── README.md
```

## 🎯 Usage

1. **Register** a new account or login
2. **Upload** images using drag & drop (JPEG, PNG, GIF, WebP)
3. **Configure** processing settings:
   - Quality: 1-100 (default: 85)
   - Format: WebP, JPEG, or PNG
   - Auto-resize: >1920px width
4. **Process** images and view results
5. **Download** individual files or all as ZIP
6. Files are automatically deleted after download

## 🔧 Configuration

### File Upload Limits
- Max file size: **10MB** per file
- Max files: **20** files per batch
- Allowed formats: JPEG, JPG, PNG, GIF, WebP

### Image Processing
- Quality range: 1-100 (default: 85)
- Max width: 1920px (auto-resize if larger)
- Output formats: WebP, JPEG, PNG
- Metadata: Stripped for smaller file size

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

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Helmet.js security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization

## 🚢 Deployment

See [QUICK_START.md](QUICK_START.md) for detailed deployment instructions for:
- cPanel hosting
- VPS/Cloud servers
- Docker (coming soon)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Sharp](https://sharp.pixelplumbing.com/) - High performance image processing
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Tailwind CSS components

## 📧 Contact

Project Link: [https://github.com/YOUR_USERNAME/image-optimization-tool](https://github.com/YOUR_USERNAME/image-optimization-tool)

---

**Built with ❤️ for optimizing images and improving web performance**

