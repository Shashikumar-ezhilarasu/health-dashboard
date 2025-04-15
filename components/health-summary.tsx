"use client"

import { Activity, Droplets, Heart, Moon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HealthMetricsData } from "@/types/health-metrics"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

// Default goals
const DEFAULT_GOALS = {
  steps_goal: 10000,
  hydration_goal: 3000,
  sleep_hours_goal: 8,
  heart_rate_min: 60,
  heart_rate_max: 100,
  oxygen_level_min: 95,
}

export function HealthSummary({ healthData }: { healthData: HealthMetricsData[] }) {
  // Get the latest health data
  const latestData = healthData.length > 0 ? healthData[0] : null

  if (!latestData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No health data available. Please add your health metrics to see a summary.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate progress percentages
  const stepsProgress = Math.min(Math.round((latestData.steps / DEFAULT_GOALS.steps_goal) * 100), 100)
  const hydrationProgress = Math.min(Math.round((latestData.hydration / DEFAULT_GOALS.hydration_goal) * 100), 100)
  const sleepProgress = Math.min(Math.round((latestData.sleep_hours / DEFAULT_GOALS.sleep_hours_goal) * 100), 100)

  // Heart rate status
  const getHeartRateStatus = () => {
    if (latestData.heart_rate < DEFAULT_GOALS.heart_rate_min) return "Below normal"
    if (latestData.heart_rate > DEFAULT_GOALS.heart_rate_max) return "Above normal"
    return "Normal"
  }

  // Oxygen level status
  const getOxygenStatus = () => {
    if (latestData.oxygen_level < DEFAULT_GOALS.oxygen_level_min) return "Below normal"
    return "Normal"
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-green-500" />
                    <span>Steps</span>
                  </div>
                  <span className="text-sm font-medium">
                    {latestData.steps} / {DEFAULT_GOALS.steps_goal}
                  </span>
                </div>
                <Progress value={stepsProgress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets className="mr-2 h-4 w-4 text-cyan-500" />
                    <span>Hydration</span>
                  </div>
                  <span className="text-sm font-medium">
                    {latestData.hydration} / {DEFAULT_GOALS.hydration_goal} ml
                  </span>
                </div>
                <Progress value={hydrationProgress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4 text-purple-500" />
                    <span>Sleep</span>
                  </div>
                  <span className="text-sm font-medium">
                    {latestData.sleep_hours} / {DEFAULT_GOALS.sleep_hours_goal} hours
                  </span>
                </div>
                <Progress value={sleepProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vital Signs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-red-500" />
                  <span>Heart Rate</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{latestData.heart_rate} BPM</div>
                  <div className={`text-xs ${getHeartRateStatus() === "Normal" ? "text-green-500" : "text-amber-500"}`}>
                    {getHeartRateStatus()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Oxygen Level</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{latestData.oxygen_level}%</div>
                  <div className={`text-xs ${getOxygenStatus() === "Normal" ? "text-green-500" : "text-amber-500"}`}>
                    {getOxygenStatus()}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="mb-2 text-sm font-medium">Health Insights</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {latestData.steps < DEFAULT_GOALS.steps_goal * 0.5 && (
                    <li>• Try to increase your daily steps to at least {DEFAULT_GOALS.steps_goal}</li>
                  )}
                  {latestData.hydration < DEFAULT_GOALS.hydration_goal * 0.7 && (
                    <li>• Drink more water to reach the recommended {DEFAULT_GOALS.hydration_goal} ml</li>
                  )}
                  {latestData.sleep_hours < DEFAULT_GOALS.sleep_hours_goal * 0.9 && (
                    <li>• Aim for {DEFAULT_GOALS.sleep_hours_goal} hours of sleep for better health</li>
                  )}
                  {latestData.oxygen_level < DEFAULT_GOALS.oxygen_level_min && (
                    <li>• Your oxygen level is below normal, consider consulting a doctor</li>
                  )}
                  {latestData.steps >= DEFAULT_GOALS.steps_goal * 0.5 &&
                    latestData.hydration >= DEFAULT_GOALS.hydration_goal * 0.7 &&
                    latestData.sleep_hours >= DEFAULT_GOALS.sleep_hours_goal * 0.9 &&
                    latestData.oxygen_level >= DEFAULT_GOALS.oxygen_level_min && (
                      <li>• Great job! Your health metrics are looking good</li>
                    )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
