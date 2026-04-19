import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

export interface SheetProps extends SheetPrimitive.Root.Props {}

const Sheet = ({ children, ...props }: SheetProps) => {
  return <SheetPrimitive.Root {...props}>{children}</SheetPrimitive.Root>
}
Sheet.displayName = "Sheet"

export interface SheetTriggerProps extends SheetPrimitive.Trigger.Props {}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  (props, ref) => <SheetPrimitive.Trigger ref={ref} {...props} />
)
SheetTrigger.displayName = "SheetTrigger"

type SheetSide = "top" | "right" | "bottom" | "left"

const sheetSideClasses: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 border-b",
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l sm:w-full",
  bottom: "inset-x-0 bottom-0 border-t",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r sm:w-full",
}

export interface SheetContentProps extends SheetPrimitive.Popup.Props {
  side?: SheetSide
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "right", ...props }, ref) => (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10" />
      <SheetPrimitive.Popup
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 border-border bg-background p-6 shadow-lg",
          sheetSideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          render={
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <XIcon className="h-4 w-4" />
            </button>
          }
        />
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  )
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetBody = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("py-4", className)} {...props} />
)
SheetBody.displayName = "SheetBody"

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody, SheetFooter }
