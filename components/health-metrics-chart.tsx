"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import type { HealthMetricsData } from "@/types/health-metrics"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { motion } from "framer-motion"

type MetricType = "steps" | "heart_rate" | "oxygen_level" | "hydration" | "sleep_hours"
type ChartType = "line" | "bar" | "area"

export function HealthMetricsChart({ data }: { data: HealthMetricsData[] }) {
  const [metricType, setMetricType] = useState<MetricType>("steps")
  const [chartType, setChartType] = useState<ChartType>("line")

  // Format data for chart
  const chartData = data
    .map((item) => ({
      date: format(parseISO(item.date), "MMM dd"),
      value: item[metricType],
    }))
    .reverse() // Reverse to show oldest to newest

  const metricLabels = {
    steps: "Steps",
    heart_rate: "Heart Rate (BPM)",
    oxygen_level: "Oxygen Level (%)",
    hydration: "Hydration (ml)",
    sleep_hours: "Sleep (hours)",
  }

  const getChartColor = () => {
    switch (metricType) {
      case "steps":
        return "#10b981" // green
      case "heart_rate":
        return "#ef4444" // red
      case "oxygen_level":
        return "#3b82f6" // blue
      case "hydration":
        return "#06b6d4" // cyan
      case "sleep_hours":
        return "#8b5cf6" // purple
      default:
        return "#10b981" // green
    }
  }

  const renderChart = () => {
    const color = getChartColor()

    switch (chartType) {
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={metricLabels[metricType]}
              stroke={color}
              activeDot={{ r: 8 }}
              strokeWidth={2}
              animationDuration={1000}
            />
          </LineChart>
        )
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              name={metricLabels[metricType]}
              fill={color}
              animationDuration={1000}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )
      case "area":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              name={metricLabels[metricType]}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              animationDuration={1000}
            />
          </AreaChart>
        )
      default:
        return null
    }
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-48">
          <Select value={metricType} onValueChange={(value) => setMetricType(value as MetricType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="steps">Steps</SelectItem>
              <SelectItem value="heart_rate">Heart Rate</SelectItem>
              <SelectItem value="oxygen_level">Oxygen Level</SelectItem>
              <SelectItem value="hydration">Hydration</SelectItem>
              <SelectItem value="sleep_hours">Sleep Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant={chartType === "line" ? "default" : "outline"} size="sm" onClick={() => setChartType("line")}>
            Line
          </Button>
          <Button variant={chartType === "bar" ? "default" : "outline"} size="sm" onClick={() => setChartType("bar")}>
            Bar
          </Button>
          <Button variant={chartType === "area" ? "default" : "outline"} size="sm" onClick={() => setChartType("area")}>
            Area
          </Button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No data available. Please add health metrics first.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
