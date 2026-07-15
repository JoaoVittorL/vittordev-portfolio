
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'h-10 flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-400/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent-400 font-medium text-slate-950 shadow-sm hover:bg-accent-300',
        destructive: 'bg-red-500/90 text-slate-50 shadow-sm hover:bg-red-500',
        secondary: 'bg-slate-800 text-slate-200 shadow-sm hover:bg-slate-700',
        outline: 'border border-accent-400/50 text-accent-300 hover:bg-accent-400/10',
        ghost: 'text-slate-300 hover:bg-slate-800 hover:text-slate-100',
        link: 'text-accent-300 underline-offset-4 hover:underline',
        primary: 'bg-accent-400 font-medium text-slate-950 shadow-sm hover:bg-accent-300',
      },
      size: {
        default: 'px-3 py-2',
        sm: 'rounded-md px-2 text-xs',
        lg: 'rounded-md px-4',
        icon: 'p-2',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, children, label, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {icon && (
          <span className="flex-shrink-0">
            {React.isValidElement(icon) &&
              React.cloneElement(icon as React.ReactElement<any>, {
                className: cn('h-4 w-4', (icon as React.ReactElement<any>).props.className),
              })}
          </span>
        )}
        {label || children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
