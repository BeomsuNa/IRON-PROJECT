'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Settings } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.4)] border-2 border-[#8b4513]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-[#d4a017] bg-transparent shadow-xs hover:bg-accent/10 hover:text-accent-foreground text-[#d4a017]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-[#5d4037]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        steampunk: "bg-[#d4a017] text-[#2b1d0e] hover:bg-[#b8860b] shadow-[0_4px_0_#8b4513,0_8px_15px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-none border-2 border-[#8b4513] font-bold uppercase tracking-wider steampunk-cog-shape",
      },
      size: {
        default: "h-16 w-16 px-0 py-0",
        sm: "h-12 w-12 px-0 py-0",
        lg: "h-24 w-24 px-0 py-0 text-[10px]",
        icon: "size-16",
        "icon-sm": "size-12",
        "icon-lg": "size-24",
      },
    },
    defaultVariants: {
      variant: "steampunk",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "steampunk",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const [steams, setSteams] = React.useState<{ id: number; x: number; y: number }[]>([])
  const steamIdRef = React.useRef(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newSteam = { id: steamIdRef.current++, x, y }
    setSteams((prev) => [...prev, newSteam])
    
    setTimeout(() => {
      setSteams((prev) => prev.filter((s) => s.id !== newSteam.id))
    }, 1000)

    if (props.onClick) props.onClick(e)
  }

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none">
        {steams.map((steam) => (
          <div
            key={steam.id}
            className="steam-effect"
            style={{
              left: steam.x,
              top: steam.y,
              width: '10px',
              height: '10px',
            }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-1 relative z-10 text-center px-2">
        {children}
      </div>
    </Comp>
  )
}

export { Button, buttonVariants }
