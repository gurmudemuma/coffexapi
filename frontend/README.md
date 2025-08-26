# Coffee Export Frontend

A React-based frontend application for the Coffexapi decentralized trade finance platform. This application allows exporters to submit export documentation and track validation progress.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- Docker and Docker Compose
- Git

### Setup

1. **Clone and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Run the setup script:**
   ```bash
   # Linux/macOS
   npm run setup
   
   # Windows
   npm run setup:windows
   ```

3. **Start the IPFS service** (from project root):
   ```bash
   docker-compose up ipfs -d
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

The application uses environment variables to control features and behavior. Copy `.env.example` to `.env` and configure as needed:

```bash
# IPFS Configuration
VITE_FEATURE_IPFS_UPLOAD=true

# API Configuration  
VITE_API_BASE_URL=http://localhost:5000

# Application Settings
VITE_APP_ENV=development

# Feature Flags
VITE_FEATURE_OFFLINE_MODE=true

# Security Settings
VITE_SESSION_TIMEOUT=30

# Development Settings
VITE_DEBUG_LOGGING=true
```

### Key Environment Variables

- `VITE_FEATURE_IPFS_UPLOAD`: Enable/disable IPFS file uploads (required for document submission)
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_APP_ENV`: Environment mode (development/staging/production)
- `VITE_FEATURE_OFFLINE_MODE`: Enable offline functionality
- `VITE_DEBUG_LOGGING`: Enable debug logging in browser console

## 📁 File Upload & IPFS

The application uses IPFS (InterPlanetary File System) for decentralized document storage:

### Supported File Types
- PDF documents (max 10MB)
- Word documents (.doc, .docx - max 5MB)
- Images (JPEG, PNG - max 5MB)

### IPFS Configuration
- **API Endpoint**: http://localhost:5001
- **Gateway**: http://localhost:8080
- **Encryption**: Files are encrypted by default before upload
- **Progress Tracking**: Real-time upload progress with retry mechanism

### Troubleshooting IPFS Issues

If you encounter "IPFS uploads are currently disabled" error:

1. **Check environment configuration:**
   ```bash
   npm run diagnose
   ```

2. **Verify IPFS service is running:**
   ```bash
   docker ps | grep ipfs
   ```

3. **Start IPFS service if needed:**
   ```bash
   docker-compose up ipfs -d
   ```

4. **Check IPFS connectivity:**
   ```bash
   curl http://localhost:5001/api/v0/version
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run tests once
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### End-to-End Tests
```bash
npm run test:e2e
```

## 🏗️ Building

### Development Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📚 Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React hooks
- **File Upload**: IPFS with encryption
- **Testing**: Vitest + Testing Library + Playwright
- **Code Quality**: Prettier

## 🔐 Security Features

- **Client-side encryption**: Documents encrypted before IPFS upload
- **Content addressing**: IPFS ensures document integrity
- **Feature flags**: Granular control over functionality
- **Type safety**: Full TypeScript coverage

## 📖 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run format` - Format code with Prettier
- `npm run setup` - Setup environment (Linux/macOS)
- `npm run setup:windows` - Setup environment (Windows)
- `npm run diagnose` - Diagnose IPFS connectivity issues

## 🐛 Common Issues

### IPFS Upload Errors
- Ensure `VITE_FEATURE_IPFS_UPLOAD=true` in `.env`
- Verify IPFS service is running: `docker-compose up ipfs -d`
- Check IPFS API connectivity: `curl http://localhost:5001/api/v0/version`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)

### Development Server Issues
- Check if port 3000 is available
- Restart the dev server: `npm run dev`

## 📄 License

This project is part of the Coffexapi platform. See the main project README for licensing information.