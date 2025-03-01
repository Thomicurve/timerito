"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface WorkHoursSelectorProps {
  workHours: number
  setWorkHours: (hours: number) => void
}

export function WorkHoursSelector({ workHours, setWorkHours }: WorkHoursSelectorProps) {
  const handleChange = (value: number[]) => {
    setWorkHours(value[0])
  }

  return (
    <div className="w-full max-w-sm mt-6">
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="work-hours">Horas laborales: {workHours}h</Label>
      </div>
      <Slider id="work-hours" min={1} max={12} step={0.5} defaultValue={[workHours]} onValueChange={handleChange} />
    </div>
  )
}

