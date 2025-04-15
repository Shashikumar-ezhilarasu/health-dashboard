"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { Heart, ArrowDown, ArrowUp, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { motion } from "framer-motion"
import { HealthMetricsForm } from "@/components/health-metrics-form"
import type { HealthMetricsData } from "@/types/health-metrics"
import { mockHealthData } from "@/lib/mock-data"

// Default heart rate range
const DEFAULT_MIN_HEART_RATE = 60
const DEFAULT_MAX_HEART_RATE = 100

export function HeartRatePage() {
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
      heartRate: item.heart_rate,
    }))
    .reverse() // Reverse to show oldest to newest

  // Calculate stats
  const calculateStats = () => {
    if (healthData.length === 0) return { current: 0, min: 0, max: 0, avg: 0 }

    const current = healthData[0]?.heart_rate || 0
    const heartRates = healthData.map((item) => item.heart_rate)
    const min = Math.min(...heartRates)
    const max = Math.max(...heartRates)
    const avg = Math.round(heartRates.reduce((sum, rate) => sum + rate, 0) / heartRates.length)

    return { current, min, max, avg }
  }

  const stats = calculateStats()

  const getHeartRateStatus = (rate: number) => {
    if (rate < DEFAULT_MIN_HEART_RATE) return "Below normal"
    if (rate > DEFAULT_MAX_HEART_RATE) return "Above normal"
    return "Normal"
  }

  const getStatusColor = (status: string) => {
    if (status === "Normal") return "text-green-500"
    return "text-amber-500"
  }

  return (
    <div className="container mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Heart Rate Monitoring</h1>
        <p className="text-muted-foreground">Track your heart rate (BPM) over time</p>
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
              <CardTitle className="text-sm font-medium">Current Heart Rate</CardTitle>
              <CardDescription>Latest recorded measurement</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-8 w-8 text-red-500" />
                    <div className="text-4xl font-bold">
                      {stats.current} <span className="text-xl font-normal text-muted-foreground">BPM</span>
                    </div>
                  </div>
                  <div className={`mt-2 text-sm ${getStatusColor(getHeartRateStatus(stats.current))}`}>
                    {getHeartRateStatus(stats.current)} ({DEFAULT_MIN_HEART_RATE}-{DEFAULT_MAX_HEART_RATE} BPM is normal range)
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
                    {stats.avg} <span className="text-sm font-normal text-muted-foreground">BPM</span>
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
                    <span className="text-lg font-medium">{stats.min}</span>
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-lg font-medium">{stats.max}</span>
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
              <CardTitle>Heart Rate History</CardTitle>
              <CardDescription>Your heart rate measurements over time</CardDescription>
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
                      <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
                      <Tooltip />
                      <ReferenceLine
                        y={DEFAULT_MIN_HEART_RATE}
                        stroke="#10b981"
                        strokeDasharray="3 3"
                        label={{ value: "Min Normal", position: "left", fill: "#10b981" }}
                      />
                      <ReferenceLine
                        y={DEFAULT_MAX_HEART_RATE}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        label={{ value: "Max Normal", position: "left", fill: "#ef4444" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
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
                    <p className="text-muted-foreground">
                      No data available. Please add heart rate measurements first.
                    </p>
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
              <CardTitle>Record Heart Rate</CardTitle>
              <CardDescription>Add your heart rate measurement</CardDescription>
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
