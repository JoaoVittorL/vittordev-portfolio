import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { ErrorValidationMessage } from '../message-error-validation';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 shadow-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:border-accent-400 focus:ring-1 focus:ring-accent-400/40 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/40',
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <ErrorValidationMessage message={error} />}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };