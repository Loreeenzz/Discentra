"use client"

import type React from "react"

import { useState } from "react"
import { Mic, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function EmergencyForm() {
  const [isRecording, setIsRecording] = useState(false)
  const [description, setDescription] = useState("")
  const [emergencyType, setEmergencyType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after showing success
      setTimeout(() => {
        setIsSubmitted(false)
        setDescription("")
        setEmergencyType("")
      }, 3000)
    }, 1500)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    // Simulate recording for 3 seconds
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setDescription((prev) => prev + " [Voice input recorded]")
      }, 3000)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="emergency-type" className="text-sm font-medium">
              Emergency Type
            </label>
            <Select value={emergencyType} onValueChange={setEmergencyType} disabled={isSubmitting || isSubmitted}>
              <SelectTrigger id="emergency-type">
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Describe the Emergency
            </label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Please provide details about the emergency..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] pr-12"
                disabled={isSubmitting || isSubmitted}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={`absolute bottom-2 right-2 ${isRecording ? "text-red-500 animate-pulse" : ""}`}
                onClick={toggleRecording}
                disabled={isSubmitting || isSubmitted}
                aria-label="Record voice input"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isSubmitting || isSubmitted || !emergencyType || !description.trim()}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </span>
            ) : isSubmitted ? (
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                Report Submitted
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Emergency Report
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

