# Organization-Specific Access Control System

## Overview

This document describes the comprehensive organization-specific access control system implemented for the Coffee Export Platform. The system ensures that each network member (organization) can only access their designated tasks and resources, maintaining strict security boundaries.

## System Architecture

### 1. Enhanced ProtectedRoute Component

**Location**: `c:\coffexapi\frontend\src\components\ProtectedRoute.tsx`

The `ProtectedRoute` component has been significantly enhanced with multi-layered access control:

#### Access Control Layers:
1. **Authentication Check**: Ensures user is logged in
2. **Organization Boundary Enforcement**: Users can only access their organization's routes
3. **Role-based Restrictions**: Additional role-specific limitations
4. **Permission Validation**: Fine-grained permission checking

#### Key Features:
- **Organization Route Mapping**: Predefined routes for each organization
- **Role Restrictions**: Specific routes blocked for certain roles
- **Comprehensive Error Messages**: Clear feedback for access violations
- **Audit Logging Integration**: All violations are logged

#### Organization Route Mappings:
```typescript
const ORGANIZATION_ROUTES: Record<string, string[]> = {
  'National Bank of Ethiopia': ['/nbe', '/users', '/compliance', '/audit'],
  'Customs Authority': ['/customs', '/audit'],
  'Coffee Quality Authority': ['/quality', '/audit'],
  'Exporter Bank': ['/bank', '/audit'],
  'Commercial Bank of Ethiopia': ['/bank', '/audit'],
  'Coffee Exporters Association': ['/exporter', '/exports', '/audit']
};
```

### 2. Organization-Specific Navigation

**Location**: `c:\coffexapi\frontend\src\components\layout\ModernLayout.tsx`

The navigation system dynamically generates menu items based on user organization:

#### Features:
- **Dynamic Menu Generation**: Shows only relevant navigation items
- **Permission-based Filtering**: Hides items user cannot access
- **Organization-specific Icons**: Different dashboards for each organization

#### Navigation Structure:
- **NBE**: Control Center, Compliance Monitor, User Management, Audit Trail
- **Customs**: Customs Operations, Audit Trail
- **Quality Authority**: Quality Control, Audit Trail
- **Banks**: Banking Operations, Audit Trail
- **Exporters**: Export Dashboard, Export Management

### 3. Enhanced Organization Router

**Location**: `c:\coffexapi\frontend\src\ModernApp.tsx`

The `OrganizationRouter` component validates organization-role combinations:

#### Validation Rules:
- **NBE**: Only `NBE_ADMIN` and `NBE_OFFICER` roles
- **Customs**: Only `CUSTOMS_VALIDATOR` role
- **Quality Authority**: Only `QUALITY_INSPECTOR` role
- **Banks**: Only `BANK_VALIDATOR` role

#### Error Handling:
- Clear error messages for invalid role-organization combinations
- Automatic logging of violation attempts
- Fallback to general dashboard for unrecognized organizations

### 4. Comprehensive Audit Logging

**Location**: `c:\coffexapi\frontend\src\utils\auditLogger.ts`

A sophisticated audit logging system tracks all security-related events:

#### Event Types:
- `ACCESS_DENIED`: General access denials
- `ORGANIZATION_VIOLATION`: Cross-organization access attempts
- `ROLE_VIOLATION`: Role-based access violations
- `PERMISSION_VIOLATION`: Insufficient permission attempts
- `LOGIN_ATTEMPT`: Successful and failed logins
- `LOGOUT`: User logout events

#### Features:
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Metadata Storage**: Detailed context for each event
- **localStorage Persistence**: Client-side event storage
- **Development Logging**: Console output during development
- **Export Functionality**: JSON export of audit events

#### Integration Points:
- **ProtectedRoute**: Logs all access violations
- **Auth Store**: Logs login/logout events
- **Organization Router**: Logs organization violations

### 5. Updated Authentication Store

**Location**: `c:\coffexapi\frontend\src\store\index.ts`

The Zustand auth store includes audit logging for authentication events:

#### Enhancements:
- **Login Auditing**: Logs successful and failed login attempts
- **Logout Auditing**: Tracks user logout events
- **Failed Login Tracking**: Records failed authentication attempts

## Organization Task Segregation

### National Bank of Ethiopia (NBE)
**Authorized Tasks:**
- License validation and management
- Regulatory compliance monitoring
- User management (Admin only)
- System-wide audit access
- Export declaration approval/rejection

**Restricted From:**
- Direct shipping/customs operations
- Quality inspection processes
- Bank-specific payment processing

### Customs Authority
**Authorized Tasks:**
- Shipping document validation
- Customs clearance processing
- Border control operations
- Port statistics monitoring

**Restricted From:**
- Banking operations
- License management
- Quality certification
- User management

### Coffee Quality Authority
**Authorized Tasks:**
- Sample inspection and testing
- Quality certification issuance
- Grade assessment
- Quality standard enforcement

**Restricted From:**
- Banking operations
- Customs processing
- License management
- User management

### Exporter/Commercial Banks
**Authorized Tasks:**
- Payment processing and validation
- Invoice verification
- Currency exchange operations
- Transaction monitoring

**Restricted From:**
- Quality inspection
- Customs operations
- License management
- User management

## Security Features

### 1. Multi-Layer Validation
- Authentication → Organization → Role → Permission
- Each layer provides specific error messages
- All violations are logged with full context

### 2. Route Protection
- Organization-specific route whitelisting
- Role-based route restrictions
- Permission-based feature access

### 3. Audit Trail
- Comprehensive logging of all access attempts
- Severity-based categorization
- Persistent storage and export capabilities

### 4. Error Handling
- Clear, informative error messages
- No sensitive information exposure
- Graceful degradation

## Implementation Benefits

1. **Security**: Strict organization boundaries prevent unauthorized access
2. **Compliance**: Complete audit trail for regulatory requirements
3. **Usability**: Users only see relevant features and options
4. **Maintainability**: Clear separation of concerns and modular design
5. **Scalability**: Easy to add new organizations or modify permissions

## Testing Guidelines

### Manual Testing Scenarios:

1. **Cross-Organization Access**:
   - Login as NBE user, attempt to access `/customs-dashboard`
   - Verify access denied and audit log entry

2. **Role Violations**:
   - Login as `NBE_OFFICER`, attempt to access `/users`
   - Verify role restriction and logging

3. **Navigation Filtering**:
   - Check that each organization sees only their menu items
   - Verify permission-based item hiding

4. **Audit Logging**:
   - Perform various access violations
   - Check console logs and localStorage for audit events

### Automated Testing:
- Unit tests for `ProtectedRoute` component
- Integration tests for organization routing
- Audit logger functionality tests

## Configuration Management

### Adding New Organizations:
1. Update `ORGANIZATION_ROUTES` in `ProtectedRoute.tsx`
2. Add navigation items in `ModernLayout.tsx`
3. Update organization validation in `OrganizationRouter`
4. Create organization-specific dashboard component

### Modifying Permissions:
1. Update role restrictions in `ProtectedRoute.tsx`
2. Modify navigation permission requirements
3. Update user permissions in auth store mock data

## Monitoring and Alerts

The audit logging system provides several monitoring capabilities:

- **Real-time Violation Detection**: Console warnings for development
- **Severity-based Alerting**: Critical events trigger special handling
- **Export Functionality**: Regular audit report generation
- **localStorage Persistence**: Client-side event tracking

## Conclusion

This organization-specific access control system provides comprehensive security boundaries while maintaining usability and performance. Each network member is strictly limited to their designated tasks, with full audit trails for compliance and security monitoring.

The modular design allows for easy maintenance and extension, while the multi-layered validation ensures robust security against unauthorized access attempts.