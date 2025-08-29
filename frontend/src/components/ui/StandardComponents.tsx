/**
 * Standardized UI Components
 * 
 * This module provides a set of standardized, reusable UI components
 * with consistent design patterns for the Coffee Export Platform.
 */

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

// ==============================================================================
// Base Button Component
// ==============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    iconPosition = 'left',
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary-500',
      ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    };
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
    };
    
    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ==============================================================================
// Card Component
// ==============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-card text-card-foreground',
      outline: 'bg-card text-card-foreground border border-border',
      elevated: 'bg-card text-card-foreground shadow-md',
    };
    
    return (
      <div
        ref={ref}
        className={cn('rounded-lg', variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

// ==============================================================================
// Alert Component
// ==============================================================================

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', dismissible = false, onDismiss, children, ...props }, ref) => {
    const variants = {
      default: 'bg-background text-foreground border-border',
      success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/30',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-900/30',
      error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30',
      info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/30',
    };
    
    const icons = {
      default: Info,
      success: CheckCircle,
      warning: AlertCircle,
      error: AlertCircle,
      info: Info,
    };
    
    const Icon = icons[variant];
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full rounded-lg border p-4',
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">{children}</div>
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-auto -mr-1 -mt-1 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
);

AlertDescription.displayName = 'AlertDescription';

// ==============================================================================
// Badge Component
// ==============================================================================

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400',
      secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      outline: 'border border-border text-foreground',
    };
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

// ==============================================================================
// Progress Component
// ==============================================================================

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = 'md', variant = 'default', showPercentage = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };
    
    const variants = {
      default: 'bg-primary-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
    };
    
    return (
      <div className="space-y-1">
        {showPercentage && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn('w-full bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden', sizes[size], className)}
          {...props}
        >
          <div
            className={cn('h-full transition-all duration-300 ease-in-out', variants[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// ==============================================================================
// Loading Spinner Component
// ==============================================================================

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', text, ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };
    
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center space-x-2', className)}
        {...props}
      >
        <Loader2 className={cn('animate-spin', sizes[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

// ==============================================================================
// Status Indicator Component
// ==============================================================================

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'online' | 'offline' | 'warning' | 'error' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
}

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size = 'md', showText = false, text, ...props }, ref) => {
    const statusConfig = {
      online: { color: 'bg-green-500', text: text || 'Online' },
      offline: { color: 'bg-gray-500', text: text || 'Offline' },
      warning: { color: 'bg-yellow-500', text: text || 'Warning' },
      error: { color: 'bg-red-500', text: text || 'Error' },
      pending: { color: 'bg-blue-500', text: text || 'Pending' },
    };
    
    const sizes = {
      sm: 'h-2 w-2',
      md: 'h-3 w-3',
      lg: 'h-4 w-4',
    };
    
    const config = statusConfig[status];
    
    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-2', className)}
        {...props}
      >
        <div className={cn('rounded-full', sizes[size], config.color)} />
        {showText && (
          <span className="text-sm text-muted-foreground">{config.text}</span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';

// ==============================================================================
// Empty State Component
// ==============================================================================

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center text-center p-8', className)}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-4 max-w-md">
            {description}
          </p>
        )}
        {action && action}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';