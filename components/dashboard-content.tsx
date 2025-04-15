"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthMetricsForm } from "@/components/health-metrics-form"
import { HealthMetricsChart } from "@/components/health-metrics-chart"
import { AiAssistant } from "@/components/ai-assistant"
import { HealthSummary } from "@/components/health-summary"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import type { HealthMetricsData } from "@/types/health-metrics"
import { mockHealthData } from "@/lib/mock-data"

export function DashboardContent() {
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

  const getLatestMetric = () => {
    return healthData.length > 0 ? healthData[0] : null
  }

  const latestMetric = getLatestMetric()

  const handleFormSuccess = (newData: HealthMetricsData) => {
    setHealthData([newData, ...healthData.slice(0, -1)])
  }

  return (
    <div className="container mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <p className="text-muted-foreground">Track your health metrics and get AI-powered insights</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Steps"
              value={latestMetric ? latestMetric.steps.toString() : "0"}
              unit="steps"
              change="+12%"
              positive
              icon="steps"
            />
            <MetricCard
              title="Heart Rate"
              value={latestMetric ? latestMetric.heart_rate.toString() : "0"}
              unit="bpm"
              change="-5%"
              positive={false}
              icon="heart"
            />
            <MetricCard
              title="Oxygen Level"
              value={latestMetric ? latestMetric.oxygen_level.toString() : "0"}
              unit="%"
              change="+1%"
              positive
              icon="oxygen"
            />
            <MetricCard
              title="Hydration"
              value={latestMetric ? latestMetric.hydration.toString() : "0"}
              unit="ml"
              change="+20%"
              positive
              icon="hydration"
            />
          </>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <HealthSummary healthData={healthData} />
          )}
        </TabsContent>
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Enter Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <HealthMetricsForm onSuccess={handleFormSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[400px] w-full" /> : <HealthMetricsChart data={healthData} />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assistant">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <AiAssistant healthData={healthData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({
  title,
  value,
  unit,
  change,
  positive,
  icon,
}: {
  title: string
  value: string
  unit: string
  change: string
  positive: boolean
  icon: "steps" | "heart" | "oxygen" | "hydration"
}) {
  const iconColors = {
    steps: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    heart: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    oxygen: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    hydration: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  }

  const iconMap = {
    steps: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M19 5.93 19 19"></path>
        <path d="M5 19V5.93"></path>
        <path d="M12 19V9.93"></path>
        <path d="M12 4h0"></path>
        <path d="M5 9.93V4"></path>
        <path d="M19 9.93V4"></path>
      </svg>
    ),
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    ),
    oxygen: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 2v8"></path>
        <path d="m4.93 10.93 1.41 1.41"></path>
        <path d="M2 18h2"></path>
        <path d="M20 18h2"></path>
        <path d="m19.07 10.93-1.41 1.41"></path>
        <path d="M22 22H2"></path>
        <path d="m16 6-4 4-4-4"></path>
        <path d="M16 18a4 4 0 0 0-8 0"></path>
      </svg>
    ),
    hydration: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
      </svg>
    ),
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={cn("rounded-full p-1.5", iconColors[icon])}>{iconMap[icon]}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
          </div>
          <p className={cn("text-xs", positive ? "text-green-500" : "text-red-500")}>{change} from last week</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-24" />
        <Skeleton className="h-4 w-16" />
      </CardContent>
    </Card>
  )
}
