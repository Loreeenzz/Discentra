"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export default function SOSButton() {
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = () => {
    setIsPressed(true)

    // Reset the animation after it completes
    setTimeout(() => {
      setIsPressed(false)
    }, 1000)
  }

  return (
    <div className="relative">
      {/* Outer glow effect */}
      <div
        className={`
        absolute inset-0 rounded-full 
        bg-red-500/30 dark:bg-red-600/30
        ${isPressed ? "animate-ping" : ""}
        transition-all duration-300
      `}
      />

      {/* Main button */}
      <button
        onClick={handlePress}
        className={`
          relative z-10
          flex items-center justify-center
          w-48 h-48 md:w-64 md:h-64
          rounded-full
          text-white font-bold text-2xl md:text-3xl
          transition-all duration-300
          shadow-lg
          ${
            isPressed
              ? "bg-red-700 dark:bg-red-800 scale-95 shadow-inner"
              : "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:scale-105"
          }
          focus:outline-none focus:ring-4 focus:ring-red-500/50 dark:focus:ring-red-600/50
        `}
        aria-label="Emergency SOS Button"
      >
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="h-12 w-12 md:h-16 md:w-16" />
          <span>SOS</span>
        </div>
      </button>
    </div>
  )
}
