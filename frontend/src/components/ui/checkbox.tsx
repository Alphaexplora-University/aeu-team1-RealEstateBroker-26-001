import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  label?: string
}

const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(
  ({ className, id, label, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          "peer flex h-4 w-4 items-center justify-center rounded border border-gray-200 bg-white text-white outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-checked:border-black data-checked:bg-black disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <CheckIcon className="h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label htmlFor={id} className="text-sm cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
