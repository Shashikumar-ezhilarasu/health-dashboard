"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { Activity, Clock, ArrowDown, ArrowUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { motion } from "framer-motion"
import { HealthMetricsForm } from "@/components/health-metrics-form"
import type { HealthMetricsData } from "@/types/health-metrics"
import { mockHealthData } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"

// Default steps goal
const DEFAULT_STEPS_GOAL = 10000

export function ActivityPage() {
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
      steps: item.steps,
    }))
    .reverse() // Reverse to show oldest to newest

  // Calculate stats
  const calculateStats = () => {
    if (healthData.length === 0) return { current: 0, min: 0, max: 0, avg: 0, percentOfGoal: 0 }

    const current = healthData[0]?.steps || 0
    const steps = healthData.map((item) => item.steps)
    const min = Math.min(...steps)
    const max = Math.max(...steps)
    const avg = Math.round(steps.reduce((sum, step) => sum + step, 0) / steps.length)
    const percentOfGoal = Math.round((current / DEFAULT_STEPS_GOAL) * 100)

    return { current, min, max, avg, percentOfGoal }
  }

  const stats = calculateStats()

  const getActivityStatus = (steps: number) => {
    if (steps < DEFAULT_STEPS_GOAL * 0.5) return "Low"
    if (steps < DEFAULT_STEPS_GOAL) return "Moderate"
    return "Active"
  }

  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-green-500"
    if (status === "Moderate") return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Activity Tracking</h1>
        <p className="text-muted-foreground">Monitor your daily steps and activity level</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Steps</CardTitle>
              <CardDescription>Daily step count</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-8 w-8 text-green-500" />
                    <div className="text-4xl font-bold">
                      {stats.current.toLocaleString()} <span className="text-xl font-normal text-muted-foreground">steps</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className={`text-sm ${getStatusColor(getActivityStatus(stats.current))}`}>
                      {getActivityStatus(stats.current)} ({DEFAULT_STEPS_GOAL.toLocaleString()} steps is recommended)
                    </div>
                    <Progress value={stats.percentOfGoal} className="h-2" />
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
              <CardTitle className="text-sm font-medium">Average</CardTitle>
              <CardDescription>30-day average</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  <div className="text-2xl font-bold">
                    {stats.avg.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">steps</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Range</CardTitle>
              <CardDescription>Min/Max recorded</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowDown className="mr-1 h-4 w-4 text-blue-500" />
                    <span className="text-lg font-medium">{stats.min.toLocaleString()}</span>
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-lg font-medium">{stats.max.toLocaleString()}</span>
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
              <CardTitle>Steps History</CardTitle>
              <CardDescription>Your daily step count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <ReferenceLine
                        y={DEFAULT_STEPS_GOAL}
                        stroke="#10b981"
                        strokeDasharray="3 3"
                        label={{ value: "Daily Goal", position: "left", fill: "#10b981" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="steps"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available. Please add activity measurements first.</p>
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
              <CardTitle>Record Activity</CardTitle>
              <CardDescription>Add your step count</CardDescription>
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
