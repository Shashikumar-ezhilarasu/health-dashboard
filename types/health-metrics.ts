export interface HealthMetricsData {
  id?: string
  user_id?: string
  date: string
  steps: number
  heart_rate: number
  oxygen_level: number
  hydration: number
  sleep_hours: number
  created_at?: string
}

export interface GoalsData {
  id?: string
  user_id?: string
  steps_goal: number
  heart_rate_min: number
  heart_rate_max: number
  oxygen_level_min: number
  hydration_goal: number
  sleep_hours_goal: number
}
