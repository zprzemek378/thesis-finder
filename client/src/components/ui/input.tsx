import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  asChild?: boolean;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, asChild = false, error = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input"
    
    return (
      <Comp
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-[var(--o-blue)] focus:ring-offset-0",
          {
            "border-red-500": error
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }