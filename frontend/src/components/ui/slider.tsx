import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

type SliderValue = number | readonly number[]

export interface SliderProps
  extends Omit<SliderPrimitive.Root.Props<SliderValue>, "children"> {}

function getThumbCount(value?: SliderValue) {
  return Array.isArray(value) ? value.length : 1
}

function Slider({ className, value, defaultValue, ...props }: SliderProps) {
  const thumbCount = getThumbCount(value ?? defaultValue)

  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      className={cn("flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center">
        <SliderPrimitive.Track className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Indicator className="absolute h-full bg-black" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            index={thumbCount > 1 ? index : undefined}
            className="block h-4 w-4 rounded-full border-2 border-black bg-black shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}
Slider.displayName = "Slider"

export { Slider }
