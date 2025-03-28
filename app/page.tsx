"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkHoursSelector } from "@/components/work-hours-selector"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskSummary } from "@/components/task-summary"
import type { Task, TaskFormData } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { formatTime } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function TimeTracker() {
  const [workHours, setWorkHours] = useState<number>(8)
  const [tasks, setTasks] = useState<Task[]>([])
  const [remainingHours, setRemainingHours] = useState<number>(workHours)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [formData, setFormData] = useState<TaskFormData>({
    name: "",
    description: "",
    hours: 0,
    minutes: 0
  })
  const { toast } = useToast()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedWorkHours = localStorage.getItem("workHours")
    const savedTasks = localStorage.getItem("tasks")
    const savedFormData = localStorage.getItem("formData")

    if (savedWorkHours) {
      setWorkHours(Number(savedWorkHours))
      setRemainingHours(Number(savedWorkHours))
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }
  }, [])

  // Actualizar localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem("workHours", workHours.toString())
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("formData", JSON.stringify(formData))

    const totalHoursSpent = tasks.reduce((total, task) => total + task.timeSpent, 0)
    const newRemainingHours = Math.max(0, workHours - totalHoursSpent)

    if (remainingHours !== newRemainingHours) {
      setIsAnimating(true)
      setRemainingHours(newRemainingHours)

      setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
    }
  }, [workHours, tasks, remainingHours, formData])

  const addTask = (task: Task) => {
    const newTask = { ...task, id: Date.now().toString() }
    setTasks([...tasks, newTask])

    // Limpiar formulario después de agregar tarea
    setFormData({
      name: "",
      description: "",
      hours: 0,
      minutes: 0
    })

    toast({
      title: "Tarea agregada",
      description: `${task.name} - ${formatTime(task.timeSpent)}`,
      variant: "success",
    })
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    toast({
      title: "Tarea actualizada",
      description: `${updatedTask.name} - ${formatTime(updatedTask.timeSpent)}`,
    })
  }

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)
    setTasks(tasks.filter((task) => task.id !== taskId))

    if (taskToDelete) {
      toast({
        title: "Tarea eliminada",
        description: `${taskToDelete.name}`,
        variant: "destructive",
      })
    }
  }

  const deleteAllTasks = () => {
    setTasks([])
    toast({
      title: "Todas las tareas eliminadas",
      description: "Se han eliminado todas las tareas",
      variant: "destructive",
    })
  }

  const updateFormData = (newFormData: TaskFormData) => {
    setFormData(newFormData)
  }

  const formatRemainingTime = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return `${wholeHours}.${minutes.toString().padStart(2, '0')}`
  }

  return (
    <div className={`container mx-auto py-6 space-y-6 ${inter.className}`}>
      <Card>
        <CardHeader className="text-center relative">
          <ThemeToggle />
          <CardTitle className="text-3xl">Timerito</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div
            className={`text-6xl font-bold mb-4 transition-all duration-500 ${
              isAnimating ? "scale-110 text-primary" : ""
            }`}
          >
            {formatRemainingTime(remainingHours)}h
          </div>
          <p className="text-muted-foreground">Horas restantes de {workHours}h laborales</p>
          <WorkHoursSelector workHours={workHours} setWorkHours={setWorkHours} />
        </CardContent>
      </Card>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="add">Agregar Tarea</TabsTrigger>
          <TabsTrigger value="list">Lista de Tareas</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <Card>
            <CardContent className="pt-6">
              <TaskForm onAddTask={addTask} formData={formData} updateFormData={updateFormData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <TaskList 
                tasks={tasks} 
                onUpdateTask={updateTask} 
                onDeleteTask={deleteTask} 
                onDeleteAllTasks={deleteAllTasks} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              <TaskSummary tasks={tasks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

