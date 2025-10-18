# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing the maintainer directly. **Please do not create a public GitHub issue for security vulnerabilities.**

## Security Best Practices

When deploying this application:

### Environment Variables
- ✅ **NEVER** commit `.env` files to version control
- ✅ Use strong, random JWT secrets (minimum 32 characters)
- ✅ Use strong database passwords
- ✅ Change default credentials in production

### Database
- ✅ Use unique database credentials for production
- ✅ Restrict database access to localhost only
- ✅ Keep database software updated
- ✅ Regular backups

### Server
- ✅ Enable HTTPS/SSL certificates
- ✅ Keep Node.js and dependencies updated
- ✅ Use production mode (`NODE_ENV=production`)
- ✅ Enable firewall rules
- ✅ Regular security audits: `npm audit`

### File Uploads
- ✅ Validate file types on server-side
- ✅ Enforce file size limits (10MB default)
- ✅ Sanitize filenames
- ✅ Auto-delete temporary files
- ✅ Scan uploads for malware in production

### Authentication
- ✅ Use strong password requirements
- ✅ Implement rate limiting (enabled by default)
- ✅ JWT tokens expire after 7 days
- ✅ Passwords hashed with bcrypt

## Known Security Features

This application includes:
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Input validation and sanitization
- ✅ File type validation
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection

## Keeping Dependencies Secure

Run regular security audits:

```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix
```

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Update Policy

Security updates will be released as soon as possible after a vulnerability is confirmed.

