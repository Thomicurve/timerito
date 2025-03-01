import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timeInHours: number) {
  const hours = Math.floor(timeInHours)
  const minutes = Math.round((timeInHours - hours) * 60)

  return `${hours}h ${minutes}m`
}

