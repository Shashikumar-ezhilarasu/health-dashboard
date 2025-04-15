"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { Droplets, Clock, Plus } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { motion } from "framer-motion"
import { HealthMetricsForm } from "@/components/health-metrics-form"
import type { HealthMetricsData } from "@/types/health-metrics"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { mockHealthData } from "@/lib/mock-data"

// Default hydration goal
const DEFAULT_HYDRATION_GOAL = 3000

export function HydrationPage() {
  const [healthData, setHealthData] = useState<HealthMetricsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setHealthData(mockHealthData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Format data for chart
  const chartData = healthData
    .map((item) => ({
      date: format(parseISO(item.date), "MMM dd"),
      hydration: item.hydration,
    }))
    .reverse() // Reverse to show oldest to newest

  // Calculate stats
  const calculateStats = () => {
    if (healthData.length === 0) return { current: 0, avg: 0, percentOfGoal: 0 }

    const current = healthData[0]?.hydration || 0
    const hydrationLevels = healthData.map((item) => item.hydration)
    const avg = Math.round(hydrationLevels.reduce((sum, level) => sum + level, 0) / hydrationLevels.length)
    const percentOfGoal = Math.round((current / DEFAULT_HYDRATION_GOAL) * 100)

    return { current, avg, percentOfGoal }
  }

  const stats = calculateStats()

  // Quick add functions
  const quickAdd = (amount: number) => {
    if (!healthData.length) return

    const currentHydration = healthData[0].hydration
    const newHydration = currentHydration + amount

    // Update the first item in the array with new hydration value
    const updatedData = [
      { ...healthData[0], hydration: newHydration },
      ...healthData.slice(1),
    ]

    setHealthData(updatedData)
  }

  return (
    <div className="container mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Hydration Tracking</h1>
        <p className="text-muted-foreground">Monitor your daily water intake</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Hydration</CardTitle>
              <CardDescription>Water intake progress</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Droplets className="mr-2 h-8 w-8 text-cyan-500" />
                      <div className="text-4xl font-bold">
                        {stats.current} <span className="text-xl font-normal text-muted-foreground">ml</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Goal: {DEFAULT_HYDRATION_GOAL} ml</div>
                      <div className="text-lg font-medium">{stats.percentOfGoal}%</div>
                    </div>
                  </div>
                  <Progress value={stats.percentOfGoal} className="h-2" />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => quickAdd(250)}>
                      <Plus className="mr-1 h-4 w-4" /> 250ml
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => quickAdd(500)}>
                      <Plus className="mr-1 h-4 w-4" /> 500ml
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => quickAdd(1000)}>
                      <Plus className="mr-1 h-4 w-4" /> 1000ml
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Intake</CardTitle>
              <CardDescription>30-day average</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  <div className="text-2xl font-bold">
                    {stats.avg} <span className="text-sm font-normal text-muted-foreground">ml</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Hydration History</CardTitle>
              <CardDescription>Your daily water intake over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <ReferenceLine
                        y={DEFAULT_HYDRATION_GOAL}
                        stroke="#10b981"
                        strokeDasharray="3 3"
                        label={{ value: "Daily Goal", position: "right", fill: "#10b981" }}
                      />
                      <Bar dataKey="hydration" fill="#06b6d4" radius={[4, 4, 0, 0]} animationDuration={1000} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available. Please add hydration measurements first.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Record Hydration</CardTitle>
              <CardDescription>Add your water intake</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthMetricsForm
                onSuccess={(newData) => {
                  setHealthData([newData, ...healthData.slice(0, -1)])
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
