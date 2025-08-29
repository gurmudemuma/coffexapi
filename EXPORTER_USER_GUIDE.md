# Coffee Exporter User - Testing Guide

## Overview

The Coffee Export System now includes a dedicated **Coffee Exporter** user type, representing coffee exporters who submit export requests and manage their export documentation through the system.

## New Exporter User Details

### Authentication Credentials
- **Username**: `exporter.user`
- **Password**: `exporter123`

### User Information
- **Full Name**: Coffee Exporter
- **Role**: `EXPORTER`
- **Organization**: Coffee Exporters Association
- **Email**: exporter@coffeeexporters.com

### Permissions
The exporter user has the following permissions:
- `export:create` - Create new export requests
- `export:read` - View export requests
- `export:update` - Modify export requests
- `export:submit` - Submit export requests for validation
- `document:upload` - Upload export documents
- `document:read` - View export documents
- `payment:request` - Request payment processing
- `audit:read` - View audit trails

## Accessible Routes

The exporter user can access the following routes:
- `/exporter` - Main exporter dashboard
- `/export/new` - Create new export request
- `/export/manage` - Manage existing exports
- `/documents` - Document management
- `/audit` - Audit trail access

## Blocked Routes

The exporter user is **blocked** from accessing:
- `/nbe` - NBE dashboard
- `/customs` - Customs dashboard
- `/quality` - Quality dashboard
- `/bank` - Bank dashboard
- `/users` - User management (NBE only)
- `/compliance` - Compliance monitoring (NBE only)

## Testing Instructions

### 1. Login Test
1. Navigate to `/login`
2. Enter credentials:
   - Username: `exporter.user`
   - Password: `exporter123`
3. Click "Login"
4. Should redirect to `/exporter`

### 2. Dashboard Access Test
1. After login, verify the exporter dashboard displays:
   - Export statistics (Total Exports, Active Exports, etc.)
   - Quick actions (New Export Request, Upload Documents, etc.)
   - Recent exports table (empty initially)
   - Export management tools

### 3. Navigation Test
1. Verify the navigation menu shows only exporter-specific items:
   - ✅ Export Dashboard
   - ✅ Manage Exports
   - ✅ Audit Trail
   - ❌ New Export (removed to reduce redundancy)
   - ❌ Documents (removed to reduce redundancy)
   - ❌ NBE Control Center (should not appear)
   - ❌ User Management (should not appear)
   - ❌ Customs Operations (should not appear)

### 4. Access Control Test
1. Try to directly access blocked routes:
   - Navigate to `/nbe`
   - Should show "Organization Access Violation" error
   - Navigate to `/users`
   - Should show "Organization Access Violation" error
   - Navigate to `/customs`
   - Should show "Organization Access Violation" error

### 5. Audit Logging Test
1. Access a blocked route (e.g., `/nbe`)
2. Open browser developer tools → Console
3. Should see audit log entries for the access violation
4. Check localStorage for `audit_events` key
5. Should contain ORGANIZATION_VIOLATION events

## Dashboard Features

The Exporter Dashboard includes:

### Statistics Cards
- **Total Exports**: Number of export requests created
- **Active Exports**: Exports currently in process
- **Pending Validation**: Exports awaiting validator approval
- **Total Value**: Combined value of all exports

### Quick Actions
- **New Export Request**: Create a new export request
- **Upload Documents**: Manage export documentation
- **Manage Exports**: View and edit existing exports

### Export Management Table
- Lists all export requests with status tracking
- Shows validation progress for each export
- Provides edit/view actions for draft exports
- Displays export details (product, quantity, destination, value)

## Integration with Existing System

### Organization-Specific Access Control
- The exporter user is fully integrated with the existing access control system
- All access attempts are logged in the audit system
- Role-based restrictions are enforced
- Organization boundaries are strictly maintained

### State Management
- Uses the same Zustand store as other user types
- Supports proper session management and persistence
- Integrates with the notification system

### Testing Suite Integration
- Unit tests include exporter user scenarios
- E2E tests cover exporter navigation and access control
- Performance tests include exporter user load testing
- All quality gates apply to exporter functionality

## Error Handling

The system provides clear error messages for:
- **Invalid Login**: Shows "Invalid credentials" message
- **Access Violations**: Shows organization-specific error messages
- **Missing Permissions**: Shows permission requirement details
- **Network Issues**: Graceful degradation with error notifications

## Security Features

- **Authentication Required**: All exporter routes require login
- **Organization Isolation**: Cannot access other organization routes
- **Audit Logging**: All actions are logged for security monitoring
- **Session Management**: Proper logout and session expiration handling

## Development Notes

### Files Modified
- `src/store/index.ts` - Added exporter user to mock authentication
- `src/components/ProtectedRoute.tsx` - Added exporter organization routes
- `src/components/layout/ModernLayout.tsx` - Added exporter navigation
- `src/pages/ExporterDashboard.tsx` - New exporter dashboard component
- `src/App.tsx` - Added exporter dashboard route
- `src/ModernApp.tsx` - Added exporter to organization router

### Test Files Updated
- `src/components/__tests__/ProtectedRoute.test.tsx` - Added exporter test cases
- `src/e2e/userAccessControl.spec.ts` - Added exporter E2E tests
- `load-testing/load-test-data.csv` - Added exporter users for load testing

This integration ensures that coffee exporters have a dedicated, secure workspace within the Coffee Export System while maintaining strict organizational boundaries and comprehensive audit trails.