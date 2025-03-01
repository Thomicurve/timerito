"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Task, TaskFormData } from "@/lib/types"
import { Plus, Minus } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: Task) => void
  formData: TaskFormData
  updateFormData: (formData: TaskFormData) => void
}

export function TaskForm({ onAddTask, formData, updateFormData }: TaskFormProps) {
  const { name, description, hours, minutes } = formData
  const isFormValid = name.trim() !== "" && (hours > 0 || minutes > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      return
    }

    const timeSpent = hours + minutes / 60

    onAddTask({
      id: "",
      name,
      description,
      timeSpent,
      date: new Date().toISOString().split("T")[0],
    })
  }

  const incrementHours = () => {
    updateFormData({
      ...formData,
      hours: Math.min(hours + 1, 12)
    })
  }

  const decrementHours = () => {
    updateFormData({
      ...formData,
      hours: Math.max(hours - 1, 0)
    })
  }

  const incrementMinutes = () => {
    if (minutes === 55) {
      updateFormData({
        ...formData,
        minutes: 0,
        hours: Math.min(hours + 1, 12)
      })
    } else {
      updateFormData({
        ...formData,
        minutes: minutes + 5
      })
    }
  }

  const decrementMinutes = () => {
    if (minutes === 0) {
      if (hours > 0) {
        updateFormData({
          ...formData,
          minutes: 55,
          hours: hours - 1
        })
      }
    } else {
      updateFormData({
        ...formData,
        minutes: minutes - 5
      })
    }
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 12) {
      updateFormData({
        ...formData,
        hours: value
      })
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      // Redondear a múltiplos de 5
      updateFormData({
        ...formData,
        minutes: Math.round(value / 5) * 5
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="task-name">Nombre de la tarea</Label>
        <Input
          id="task-name"
          value={name}
          onChange={(e) => updateFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Reunión con cliente"
          required
        />
      </div>

      <div>
        <Label htmlFor="task-description">Descripción (opcional)</Label>
        <Textarea
          id="task-description"
          value={description}
          onChange={(e) => updateFormData({ ...formData, description: e.target.value })}
          placeholder="Detalles adicionales sobre la tarea"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-hours">Horas</Label>
          <div className="flex items-center">
            <Button type="button" variant="outline" size="icon" className="rounded-r-none" onClick={decrementHours}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="task-hours"
              type="text"
              inputMode="numeric"
              className="rounded-none text-center"
              value={hours}
              onChange={handleHoursChange}
              onFocus={(e) => e.target.select()}
            />
            <Button type="button" variant="outline" size="icon" className="rounded-l-none" onClick={incrementHours}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="task-minutes">Minutos</Label>
          <div className="flex items-center">
            <Button type="button" variant="outline" size="icon" className="rounded-r-none" onClick={decrementMinutes}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="task-minutes"
              type="text"
              inputMode="numeric"
              className="rounded-none text-center"
              value={minutes}
              onChange={handleMinutesChange}
              onFocus={(e) => e.target.select()}
            />
            <Button type="button" variant="outline" size="icon" className="rounded-l-none" onClick={incrementMinutes}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={!isFormValid}>
        Agregar Tarea
      </Button>
    </form>
  )
}

