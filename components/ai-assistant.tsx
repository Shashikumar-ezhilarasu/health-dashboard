"use client"

import { useState, useRef, useEffect } from "react"
import { Brain, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { HealthMetricsData } from "@/types/health-metrics"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Simulated AI responses based on health data
const getAIResponse = (message: string, healthData: HealthMetricsData[]): string => {
  const lastMetrics = healthData.length > 0 ? healthData[0] : null

  if (!lastMetrics) {
    return "I don't have any health data to analyze yet. Please add your health metrics first."
  }

  const lowercaseMessage = message.toLowerCase()

  if (lowercaseMessage.includes("steps") || lowercaseMessage.includes("walking")) {
    if (lastMetrics.steps < 5000) {
      return `You've walked ${lastMetrics.steps} steps today, which is below the recommended 10,000 steps. Try to incorporate more walking into your day, perhaps by taking the stairs instead of the elevator or going for a short walk during your lunch break.`
    } else if (lastMetrics.steps >= 5000 && lastMetrics.steps < 10000) {
      return `You've walked ${lastMetrics.steps} steps today, which is good but still below the recommended 10,000 steps. You're on the right track! Try to add a short evening walk to reach your goal.`
    } else {
      return `Great job! You've walked ${lastMetrics.steps} steps today, exceeding the recommended 10,000 steps. Keep up the good work!`
    }
  }

  if (lowercaseMessage.includes("heart") || lowercaseMessage.includes("bpm")) {
    if (lastMetrics.heart_rate < 60) {
      return `Your heart rate is ${lastMetrics.heart_rate} BPM, which is below the normal resting range (60-100 BPM). This could be normal for athletes, but if you're experiencing symptoms like dizziness or fatigue, consider consulting a healthcare professional.`
    } else if (lastMetrics.heart_rate >= 60 && lastMetrics.heart_rate <= 100) {
      return `Your heart rate is ${lastMetrics.heart_rate} BPM, which is within the normal resting range (60-100 BPM). This indicates good cardiovascular health.`
    } else {
      return `Your heart rate is ${lastMetrics.heart_rate} BPM, which is above the normal resting range (60-100 BPM). This could be due to recent physical activity, stress, or caffeine intake. If it persists at rest, consider consulting a healthcare professional.`
    }
  }

  if (lowercaseMessage.includes("oxygen") || lowercaseMessage.includes("spo2")) {
    if (lastMetrics.oxygen_level < 95) {
      return `Your oxygen level is ${lastMetrics.oxygen_level}%, which is below the normal range (95-100%). If this reading is accurate and consistent, consider consulting a healthcare professional.`
    } else {
      return `Your oxygen level is ${lastMetrics.oxygen_level}%, which is within the normal range (95-100%). This indicates good respiratory function.`
    }
  }

  if (lowercaseMessage.includes("water") || lowercaseMessage.includes("hydration")) {
    if (lastMetrics.hydration < 1500) {
      return `You've consumed ${lastMetrics.hydration} ml of water today, which is below the recommended daily intake (2000-3000 ml). Try to drink more water throughout the day to stay properly hydrated.`
    } else if (lastMetrics.hydration >= 1500 && lastMetrics.hydration < 2500) {
      return `You've consumed ${lastMetrics.hydration} ml of water today, which is good but could be improved. Aim for at least 2500 ml daily for optimal hydration.`
    } else {
      return `Great job! You've consumed ${lastMetrics.hydration} ml of water today, which meets or exceeds the recommended daily intake. Staying well-hydrated supports overall health and cognitive function.`
    }
  }

  if (lowercaseMessage.includes("sleep") || lowercaseMessage.includes("rest")) {
    if (lastMetrics.sleep_hours < 6) {
      return `You slept for ${lastMetrics.sleep_hours} hours last night, which is below the recommended 7-9 hours for adults. Chronic sleep deprivation can affect your health and cognitive function. Try to establish a regular sleep schedule and create a relaxing bedtime routine.`
    } else if (lastMetrics.sleep_hours >= 6 && lastMetrics.sleep_hours < 7) {
      return `You slept for ${lastMetrics.sleep_hours} hours last night, which is slightly below the recommended 7-9 hours for adults. Try to get to bed a bit earlier tonight.`
    } else {
      return `You slept for ${lastMetrics.sleep_hours} hours last night, which is within the recommended 7-9 hours for adults. Good quality sleep is essential for physical and mental health.`
    }
  }

  if (lowercaseMessage.includes("health") || lowercaseMessage.includes("overall")) {
    const concerns = []
    const positives = []

    if (lastMetrics.steps < 5000) concerns.push("low step count")
    else if (lastMetrics.steps >= 10000) positives.push("excellent step count")

    if (lastMetrics.heart_rate < 60 || lastMetrics.heart_rate > 100) concerns.push("heart rate outside normal range")
    else positives.push("healthy heart rate")

    if (lastMetrics.oxygen_level < 95) concerns.push("oxygen level below recommended range")
    else positives.push("good oxygen levels")

    if (lastMetrics.hydration < 2000) concerns.push("insufficient hydration")
    else positives.push("good hydration")

    if (lastMetrics.sleep_hours < 7) concerns.push("insufficient sleep")
    else positives.push("healthy sleep duration")

    if (concerns.length === 0) {
      return `Your overall health metrics look excellent! You're maintaining ${positives.join(", ")}. Keep up the great work and continue with your healthy habits.`
    } else if (positives.length === 0) {
      return `I've noticed several areas for improvement in your health metrics: ${concerns.join(", ")}. Consider focusing on these areas to improve your overall health.`
    } else {
      return `Your health metrics show some strengths and areas for improvement. Positives: ${positives.join(", ")}. Areas to focus on: ${concerns.join(", ")}. Small improvements in these areas can lead to significant health benefits.`
    }
  }

  // Default response
  return "I'm your AI health assistant. I can provide insights based on your health metrics and answer questions about steps, heart rate, oxygen levels, hydration, and sleep. How can I help you today?"
}

export function AiAssistant({ healthData }: { healthData: HealthMetricsData[] }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI health assistant. I can provide insights based on your health metrics and answer questions about steps, heart rate, oxygen levels, hydration, and sleep. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsTyping(true)

      // Simulate AI response with typing effect
      setTimeout(() => {
        const aiResponse = getAIResponse(input, healthData)

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  return (
    <div className="flex h-[500px] flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <p>{message.content}</p>
                    <span className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-muted p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-primary"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-primary"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ask about your health metrics..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend()
              }
            }}
            disabled={isTyping}
          />
          <Button size="icon" onClick={handleSend} disabled={isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
