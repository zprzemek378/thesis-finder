import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  error?: boolean | string;
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, error = false, id, ...props }, ref) => (
    <div className="flex items-center">
      <CheckboxPrimitive.Root
        id={id}
        ref={ref}
        className={cn(
          "mr-2 h-4 w-4 border border-gray-200 bg-white focus:ring-0 appearance-none rounded relative",
          "peer data-[state=checked]:bg-[var(--o-blue-light)] data-[state=checked]:border-[var(--o-blue)]",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white text-xs">
          ✓
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label 
          htmlFor={id} 
          className={cn(
            "text-sm text-gray-700",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}
        >
          {label}
        </label>
      )}
      {error && typeof error === 'string' && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }