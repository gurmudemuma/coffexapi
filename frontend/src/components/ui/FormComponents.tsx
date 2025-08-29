/**
 * Standardized Form Components
 * 
 * This module provides a set of form components with consistent validation,
 * error handling, and accessibility features.
 */

import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, AlertCircle, Upload, X, Check } from 'lucide-react';

// ==============================================================================
// Base Input Component
// ==============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helper, 
    required = false,
    leftIcon,
    rightIcon,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
          
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-muted-foreground">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ==============================================================================
// Password Input Component
// ==============================================================================

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    
    const calculateStrength = (password: string): number => {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z\d]/.test(password)) score++;
      return score;
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const password = e.target.value;
      if (showStrength) {
        setStrength(calculateStrength(password));
      }
      props.onChange?.(e);
    };
    
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return (
      <div className="space-y-2">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          onChange={handlePasswordChange}
        />
        
        {showStrength && props.value && (
          <div className="space-y-1">
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    level < strength ? strengthColors[strength - 1] : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength: {strengthLabels[strength - 1] || 'Very Weak'}
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

// ==============================================================================
// Textarea Component
// ==============================================================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    helper, 
    required = false,
    showCharCount = false,
    maxLength,
    value,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const charCount = typeof value === 'string' ? value.length : 0;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          id={inputId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {error}
              </p>
            )}
            
            {helper && !error && (
              <p className="text-sm text-muted-foreground">{helper}</p>
            )}
          </div>
          
          {showCharCount && (
            <p className="text-xs text-muted-foreground">
              {charCount}{maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ==============================================================================
// Select Component
// ==============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helper, 
    required = false,
    options,
    placeholder,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <select
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-muted-foreground">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ==============================================================================
// Checkbox Component
// ==============================================================================

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        <div className="flex items-start space-x-2">
          <input
            id={inputId}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {label && (
            <label 
              htmlFor={inputId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-muted-foreground">{helper}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ==============================================================================
// File Upload Component
// ==============================================================================

export interface FileUploadProps {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    label, 
    error, 
    helper, 
    required = false,
    accept,
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = 5,
    value = [],
    onChange,
    onError,
    ...props 
  }, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;
    
    const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
      const valid: File[] = [];
      const errors: string[] = [];
      
      if (multiple && files.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return { valid, errors };
      }
      
      files.forEach((file) => {
        if (file.size > maxSize) {
          errors.push(`${file.name} is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`);
        } else {
          valid.push(file);
        }
      });
      
      return { valid, errors };
    };
    
    const handleFiles = (files: FileList | null) => {
      if (!files) return;
      
      const fileArray = Array.from(files);
      const { valid, errors } = validateFiles(fileArray);
      
      if (errors.length > 0) {
        onError?.(errors.join(', '));
        return;
      }
      
      if (multiple) {
        onChange?.([...value, ...valid].slice(0, maxFiles));
      } else {
        onChange?.(valid.slice(0, 1));
      }
    };
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };
    
    const removeFile = (index: number) => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange?.(newFiles);
    };
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            dragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            error && 'border-red-500'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            id={inputId}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            ref={ref}
            {...props}
          />
          
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept && `Accepted: ${accept} • `}
              Max {Math.round(maxSize / 1024 / 1024)}MB per file
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>
        
        {/* File List */}
        {value.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Uploaded Files:</p>
            {value.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-muted-foreground">{helper}</p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

// ==============================================================================
// Form Group Component
// ==============================================================================

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-medium text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';