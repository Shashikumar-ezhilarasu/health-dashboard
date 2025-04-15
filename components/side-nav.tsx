"use client"

import { cn } from "@/lib/utils"
import { Activity, Brain, Droplets, Heart, Home, LineChart, Moon, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Heart Rate", href: "/heart-rate", icon: Heart },
  { name: "Oxygen Level", href: "/oxygen", icon: Activity },
  { name: "Hydration", href: "/hydration", icon: Droplets },
  { name: "Sleep", href: "/sleep", icon: Moon },
  { name: "AI Assistant", href: "/assistant", icon: Brain },
  { name: "Reports", href: "/reports", icon: LineChart },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex h-full flex-col p-2">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <motion.li key={item.name} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </nav>
  )
}
