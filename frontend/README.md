# Coffee Export Frontend

A modern, type-safe React application for the Coffexapi decentralized trade finance platform. Built with React 18, TypeScript, and modern tooling following industry best practices.

## ✨ Features

- 🚀 **Modern React**: Built with React 18 and TypeScript
- 🏗️ **Feature-Based Architecture**: Organized by features for better maintainability
- 🛡️ **Type Safety**: Full TypeScript coverage with strict typing
- 🧪 **Comprehensive Testing**: Unit, integration, and E2E testing with 85%+ coverage
- ♿ **Accessibility**: WCAG compliant with proper ARIA support
- 🎨 **Modern UI**: Tailwind CSS with dark mode support
- 📱 **Responsive Design**: Mobile-first responsive design
- 🔧 **Developer Experience**: ESLint, Prettier, and advanced tooling
- 🚦 **Error Boundaries**: Comprehensive error handling at multiple levels
- ⚡ **Performance**: Optimized with React patterns and code splitting

## 🏗️ Architecture

### Feature-Based Organization

The application follows a feature-based architecture for better scalability and maintainability:

```
src/
├── features/           # Feature-specific code
│   ├── auth/          # Authentication
│   ├── exports/       # Export management
│   ├── dashboard/     # Dashboard views
│   └── users/         # User management
├── shared/            # Shared resources
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript definitions
│   ├── utils/         # Utility functions
│   └── testing/       # Testing utilities
└── App.tsx           # Main application
```

### Key Technologies

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with custom state management
- **Routing**: React Router v6 with lazy loading
- **Testing**: Vitest + Testing Library + Playwright
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Documentation**: JSDoc with comprehensive component docs

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

## 🛠️ Development

### Code Quality Tools

```bash
# Linting and formatting
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
npm run typecheck     # TypeScript checking
```

### Testing Strategy

Comprehensive testing at multiple levels:

```bash
# Unit tests
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report

# E2E tests
npm run test:e2e      # Playwright tests

# Performance tests
npm run test:performance # Load and performance tests
```

### Component Development

Components follow strict patterns for consistency:

```typescript
// Example component structure
export const ExampleComponent: React.FC<Props> = memo(({
  prop1,
  prop2,
  onAction,
  className,
  'data-testid': testId = 'example',
  ...props
}) => {
  // Memoized values
  const computedValue = useMemo(() => {
    return expensiveCalculation(prop1, prop2);
  }, [prop1, prop2]);

  // Memoized callbacks
  const handleClick = useCallback(() => {
    onAction?.(computedValue);
  }, [onAction, computedValue]);

  return (
    <div 
      className={cn('base-classes', className)}
      data-testid={testId}
      onClick={handleClick}
      {...props}
    >
      {/* Component content */}
    </div>
  );
});
```

### Error Handling

Multi-level error boundaries for robust error handling:

```typescript
// Route-level errors
<RouteErrorBoundary>
  <Routes>...</Routes>
</RouteErrorBoundary>

// Feature-level errors
<FeatureErrorBoundary featureName="exports">
  <ExportManagement />
</FeatureErrorBoundary>

// Async operation errors
<AsyncErrorBoundary>
  <DataFetching />
</AsyncErrorBoundary>
```

## 📚 Documentation

- [Development Guide](./DEVELOPMENT_GUIDE.md) - Comprehensive development standards
- [Component Documentation](./COMPONENT_DOCUMENTATION.md) - Component creation guide
- [Frontend Standardization Guide](./FRONTEND_STANDARDIZATION_GUIDE.md) - UI/UX standards

## 🎨 Styling

### Design System

Built with Tailwind CSS and a custom design system:

```css
/* Color palette */
--primary: hsl(var(--primary));
--secondary: hsl(var(--secondary));
--accent: hsl(var(--accent));

/* Component variants */
.btn-primary { @apply bg-primary text-primary-foreground; }
.btn-outline { @apply border border-input bg-background; }
```

### Responsive Design

Mobile-first approach with breakpoint system:

```typescript
// Responsive classes
'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
'text-sm md:text-base lg:text-lg'
'p-4 md:p-6 lg:p-8'
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