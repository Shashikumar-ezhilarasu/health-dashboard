"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import type { HealthMetricsData } from "@/types/health-metrics"
import { AiAssistant } from "@/components/ai-assistant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockHealthData } from "@/lib/mock-data"

export function AssistantPage() {
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

  return (
    <div className="container mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">AI Health Assistant</h1>
        <p className="text-muted-foreground">Get personalized health insights and recommendations</p>
      </motion.div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with Your Health Assistant</CardTitle>
              <CardDescription>Ask questions about your health metrics and get personalized advice</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[500px] w-full" /> : <AiAssistant healthData={healthData} />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Health Insights</CardTitle>
              <CardDescription>Personalized analysis based on your health data</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : healthData.length > 0 ? (
                <div className="space-y-6">
                  <HealthInsightSection
                    title="Activity Analysis"
                    icon="steps"
                    data={healthData}
                    metricKey="steps"
                    goal={10000}
                    unit="steps"
                  />
                  <HealthInsightSection
                    title="Heart Rate Analysis"
                    icon="heart"
                    data={healthData}
                    metricKey="heart_rate"
                    goal={null}
                    unit="BPM"
                    minGoal={60}
                    maxGoal={100}
                  />
                  <HealthInsightSection
                    title="Hydration Analysis"
                    icon="hydration"
                    data={healthData}
                    metricKey="hydration"
                    goal={3000}
                    unit="ml"
                  />
                  <HealthInsightSection
                    title="Sleep Analysis"
                    icon="sleep"
                    data={healthData}
                    metricKey="sleep_hours"
                    goal={8}
                    unit="hours"
                  />
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-muted-foreground">No data available. Please add health metrics first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HealthInsightSection({
  title,
  icon,
  data,
  metricKey,
  goal,
  unit,
  minGoal,
  maxGoal,
}: {
  title: string
  icon: "steps" | "heart" | "oxygen" | "hydration" | "sleep"
  data: HealthMetricsData[]
  metricKey: keyof HealthMetricsData
  goal: number | null
  unit: string
  minGoal?: number
  maxGoal?: number
}) {
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
    sleep: (
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
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    ),
  }

  const iconColors = {
    steps: "text-green-500",
    heart: "text-red-500",
    oxygen: "text-blue-500",
    hydration: "text-cyan-500",
    sleep: "text-purple-500",
  }

  const generateInsight = () => {
    if (data.length === 0) return "No data available"

    const latest = data[0]
    const value = latest[metricKey] as number
    const average = data.reduce((sum, item) => sum + (item[metricKey] as number), 0) / data.length

    if (goal !== null) {
      const percentage = (value / goal) * 100
      if (percentage >= 100) {
        return `Excellent! You've exceeded your ${goal} ${unit} goal. Keep up the great work!`
      } else if (percentage >= 80) {
        return `Good progress! You're at ${Math.round(percentage)}% of your ${goal} ${unit} goal.`
      } else if (percentage >= 50) {
        return `You're halfway there! Currently at ${Math.round(percentage)}% of your ${goal} ${unit} goal.`
      } else {
        return `Keep working on it! You're at ${Math.round(percentage)}% of your ${goal} ${unit} goal.`
      }
    }

    if (minGoal !== undefined && maxGoal !== undefined) {
      if (value < minGoal) {
        return `Your ${metricKey} is below the normal range (${minGoal}-${maxGoal} ${unit}). Consider consulting a healthcare provider.`
      } else if (value > maxGoal) {
        return `Your ${metricKey} is above the normal range (${minGoal}-${maxGoal} ${unit}). Consider consulting a healthcare provider.`
      } else {
        return `Your ${metricKey} is within the normal range (${minGoal}-${maxGoal} ${unit}).`
      }
    }

    return `Your average ${metricKey} is ${Math.round(average)} ${unit}.`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className={iconColors[icon]}>{iconMap[icon]}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground">{generateInsight()}</p>
    </div>
  )
}
