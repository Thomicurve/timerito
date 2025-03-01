"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task, TaskSummaryItem } from "@/lib/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface TaskSummaryProps {
  tasks: Task[]
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
  // Agrupar tareas con el mismo nombre
  const groupedTasks = useMemo(() => {
    const grouped: Record<string, TaskSummaryItem> = {}

    tasks.forEach((task) => {
      if (!grouped[task.name]) {
        grouped[task.name] = {
          name: task.name,
          totalTime: 0,
          count: 0,
        }
      }

      grouped[task.name].totalTime += task.timeSpent
      grouped[task.name].count += 1
    })

    return Object.values(grouped).sort((a, b) => b.totalTime - a.totalTime)
  }, [tasks])

  const totalTime = useMemo(() => {
    return tasks.reduce((total, task) => total + task.timeSpent, 0)
  }, [tasks])

  const formatTime = (timeInHours: number) => {
    const hours = Math.floor(timeInHours)
    const minutes = Math.round((timeInHours - hours) * 60)

    return `${hours}h ${minutes}m`
  }

  // Datos para el gráfico
  const chartData = useMemo(() => {
    return groupedTasks.map((task) => ({
      name: task.name,
      value: task.totalTime,
    }))
  }, [groupedTasks])

  // Colores para el gráfico
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground">No hay tareas registradas</p>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribución del tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatTime(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea</TableHead>
                <TableHead>Tiempo total</TableHead>
                <TableHead>Ocurrencias</TableHead>
                <TableHead className="text-right">% del total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedTasks.map((task) => (
                <TableRow key={task.name}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>{formatTime(task.totalTime)}</TableCell>
                  <TableCell>{task.count}</TableCell>
                  <TableCell className="text-right">
                    {totalTime > 0 ? ((task.totalTime / totalTime) * 100).toFixed(1) : 0}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="font-bold">{formatTime(totalTime)}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

