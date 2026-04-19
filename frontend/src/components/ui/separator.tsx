import * as React from "react"
import { cn } from "@/lib/utils"

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical"
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <hr
      ref={ref}
      className={cn(
        "shrink-0 bg-border",
        orientation === "vertical" ? "h-full w-[1px]" : "h-[1px] w-full",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
