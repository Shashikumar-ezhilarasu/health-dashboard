"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { Activity, Heart, Droplets, Moon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import type { HealthMetricsData } from "@/types/health-metrics"
import { mockHealthData } from "@/lib/mock-data"

// Default goals
const DEFAULT_GOALS = {
  steps_goal: 10000,
  hydration_goal: 3000,
  sleep_hours_goal: 8,
  heart_rate_min: 60,
  heart_rate_max: 100,
  oxygen_level_min: 95,
}

export function ReportsPage() {
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

  // Format data for charts
  const formatChartData = (key: keyof HealthMetricsData) => {
    return healthData
      .map((item) => ({
        date: format(parseISO(item.date), "MMM dd"),
        value: item[key],
      }))
      .reverse() // Reverse to show oldest to newest
  }

  const stepsData = formatChartData("steps")
  const heartRateData = formatChartData("heart_rate")
  const hydrationData = formatChartData("hydration")
  const sleepData = formatChartData("sleep_hours")

  // Calculate averages
  const calculateAverages = () => {
    if (healthData.length === 0) return { steps: 0, heartRate: 0, hydration: 0, sleep: 0 }

    const steps = healthData.reduce((sum, item) => sum + item.steps, 0) / healthData.length
    const heartRate = healthData.reduce((sum, item) => sum + item.heart_rate, 0) / healthData.length
    const hydration = healthData.reduce((sum, item) => sum + item.hydration, 0) / healthData.length
    const sleep = healthData.reduce((sum, item) => sum + item.sleep_hours, 0) / healthData.length

    return {
      steps: Math.round(steps),
      heartRate: Math.round(heartRate),
      hydration: Math.round(hydration),
      sleep: Math.round(sleep * 10) / 10,
    }
  }

  const averages = calculateAverages()

  return (
    <div className="container mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Health Reports</h1>
        <p className="text-muted-foreground">Comprehensive view of your health metrics</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Activity Report</CardTitle>
              <CardDescription>Daily step count trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : stepsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stepsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
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
                    <p className="text-muted-foreground">No activity data available</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-500" />
                  <span>30-day average: {averages.steps.toLocaleString()} steps</span>
                </div>
                <span className="text-sm text-muted-foreground">Goal: {DEFAULT_GOALS.steps_goal.toLocaleString()} steps</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Report</CardTitle>
              <CardDescription>Heart rate trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : heartRateData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No heart rate data available</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  <span>30-day average: {averages.heartRate} BPM</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Normal range: {DEFAULT_GOALS.heart_rate_min}-{DEFAULT_GOALS.heart_rate_max} BPM
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hydration Report</CardTitle>
              <CardDescription>Daily water intake trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : hydrationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hydrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No hydration data available</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-cyan-500" />
                  <span>30-day average: {averages.hydration} ml</span>
                </div>
                <span className="text-sm text-muted-foreground">Goal: {DEFAULT_GOALS.hydration_goal} ml</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sleep Report</CardTitle>
              <CardDescription>Sleep duration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : sleepData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No sleep data available</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="mr-2 h-5 w-5 text-purple-500" />
                  <span>30-day average: {averages.sleep} hours</span>
                </div>
                <span className="text-sm text-muted-foreground">Goal: {DEFAULT_GOALS.sleep_hours_goal} hours</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
