"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chartContainerVariants = cva("relative", {
  variants: {
    size: {
      default: "h-64 w-full",
      sm: "h-48 w-full",
      lg: "h-96 w-full",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartContainerVariants> {}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(({ className, size, ...props }, ref) => {
  return <div className={cn(chartContainerVariants({ size, className }))} ref={ref} {...props} />
})
ChartContainer.displayName = "ChartContainer"

const chartTooltipVariants = cva(
  "absolute z-10 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in duration-75",
  {
    variants: {
      side: {
        top: "bottom-[100%] translate-y-2",
        bottom: "top-[100%] -translate-y-2",
        left: "right-[100%] translate-x-2",
        right: "left-[100%] -translate-x-2",
      },
      align: {
        start: "[&[data-side='top']]:bottom-0 [&[data-side='left']]:right-0",
        end: "[&[data-side='top']]:bottom-0 [&[data-side='right']]:left-0",
      },
    },
    compoundVariants: [
      {
        side: "top",
        align: "start",
        className: "translate-x-0",
      },
      {
        side: "top",
        align: "end",
        className: "translate-x-0",
      },
    ],
    defaultVariants: {
      side: "top",
    },
  },
)

export interface ChartTooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartTooltipVariants> {}

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ className, side, align, ...props }, ref) => {
    return <div className={cn(chartTooltipVariants({ side, align, className }))} ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex flex-col space-y-1", className)} ref={ref} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }

export const Chart = () => null
