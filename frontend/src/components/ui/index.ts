// UI Component Library Exports
// This file provides centralized exports for all UI components

// Legacy UI Components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { Badge, badgeVariants } from './badge';
export { Button, buttonVariants } from './button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export { Input } from './input';
export { Skeleton } from './skeleton';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

export {
  Pagination,
  PaginationContent,
  PaginationButton,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination';

// New Standardized Components
export {
  Button as StandardButton,
  Card as StandardCard,
  CardHeader as StandardCardHeader,
  CardTitle as StandardCardTitle,
  CardDescription as StandardCardDescription,
  CardContent as StandardCardContent,
  CardFooter as StandardCardFooter,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge as StandardBadge,
  Progress as StandardProgress,
  Spinner,
  StatusIndicator,
  EmptyState
} from './StandardComponents';

// Form Components
export {
  Input as FormInput,
  PasswordInput,
  Textarea,
  Select,
  Checkbox,
  FileUpload,
  FormGroup
} from './FormComponents';

// Re-export types
export type {
  ButtonProps,
  CardProps,
  AlertProps,
  BadgeProps,
  ProgressProps,
  SpinnerProps,
  StatusIndicatorProps,
  EmptyStateProps
} from './StandardComponents';

export type {
  InputProps,
  PasswordInputProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  CheckboxProps,
  FileUploadProps,
  FormGroupProps
} from './FormComponents';