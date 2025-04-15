import type { HealthMetricsData } from "@/types/health-metrics"

// Generate last 30 days of mock data
const generateMockData = (): HealthMetricsData[] => {
  const data: HealthMetricsData[] = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      id: i.toString(),
      user_id: 'mock-user',
      date: date.toISOString(),
      steps: Math.floor(Math.random() * (12000 - 5000) + 5000),
      heart_rate: Math.floor(Math.random() * (100 - 60) + 60),
      oxygen_level: Math.floor(Math.random() * (100 - 95) + 95),
      hydration: Math.floor(Math.random() * (3000 - 1500) + 1500),
      sleep_hours: Math.floor(Math.random() * (10 - 5) + 5),
      mood: ['Happy', 'Neutral', 'Tired'][Math.floor(Math.random() * 3)],
      created_at: date.toISOString()
    })
  }

  return data
}

export const mockHealthData = generateMockData() 