"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import type { HealthMetricsData } from "@/types/health-metrics"

const formSchema = z.object({
  steps: z.coerce.number().min(0).max(100000),
  heart_rate: z.coerce.number().min(40).max(220),
  oxygen_level: z.coerce.number().min(80).max(100),
  hydration: z.coerce.number().min(0).max(5000),
  sleep_hours: z.coerce.number().min(0).max(24),
})

export function HealthMetricsForm({
  onSuccess,
}: {
  onSuccess: (data: HealthMetricsData) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      steps: 0,
      heart_rate: 70,
      oxygen_level: 98,
      hydration: 2000,
      sleep_hours: 8,
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const newData: HealthMetricsData = {
        id: Date.now().toString(),
        user_id: 'mock-user',
        date: new Date().toISOString(),
        steps: values.steps,
        heart_rate: values.heart_rate,
        oxygen_level: values.oxygen_level,
        hydration: values.hydration,
        sleep_hours: values.sleep_hours,
        created_at: new Date().toISOString()
      }

      toast({
        title: "Health metrics saved",
        description: "Your health data has been successfully recorded.",
      })

      form.reset()
      onSuccess(newData)
    } catch (error: any) {
      toast({
        title: "Error saving health metrics",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Number of steps walked today</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heart_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Rate (BPM)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="70" {...field} />
                  </FormControl>
                  <FormDescription>Your current heart rate in beats per minute</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oxygen_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oxygen Level (SpO2)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        defaultValue={[field.value]}
                        min={80}
                        max={100}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span>80%</span>
                        <span className="font-medium">{field.value}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Blood oxygen saturation level</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hydration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hydration (ml)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2000" {...field} />
                  </FormControl>
                  <FormDescription>Amount of water consumed today</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sleep_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep (hours)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        defaultValue={[field.value]}
                        min={0}
                        max={12}
                        step={0.5}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span>0h</span>
                        <span className="font-medium">{field.value}h</span>
                        <span>12h</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Hours of sleep last night</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Health Metrics"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}
