export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          height: number | null
          weight: number | null
          date_of_birth: string | null
          gender: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          date_of_birth?: string | null
          gender?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          date_of_birth?: string | null
          gender?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          steps: number
          heart_rate: number | null
          oxygen_level: number | null
          hydration: number | null
          sleep_hours: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          steps?: number
          heart_rate?: number | null
          oxygen_level?: number | null
          hydration?: number | null
          sleep_hours?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          steps?: number
          heart_rate?: number | null
          oxygen_level?: number | null
          hydration?: number | null
          sleep_hours?: number | null
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          steps_goal: number
          heart_rate_min: number
          heart_rate_max: number
          oxygen_level_min: number
          hydration_goal: number
          sleep_hours_goal: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          steps_goal?: number
          heart_rate_min?: number
          heart_rate_max?: number
          oxygen_level_min?: number
          hydration_goal?: number
          sleep_hours_goal?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          steps_goal?: number
          heart_rate_min?: number
          heart_rate_max?: number
          oxygen_level_min?: number
          hydration_goal?: number
          sleep_hours_goal?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type HealthMetric = Database["public"]["Tables"]["health_metrics"]["Row"]
export type Goal = Database["public"]["Tables"]["goals"]["Row"]
