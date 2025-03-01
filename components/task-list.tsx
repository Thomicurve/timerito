"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Minus, Trash } from "lucide-react"
import type { Task } from "@/lib/types"
import { Label } from "@/components/ui/label"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onDeleteAllTasks: () => void
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onDeleteAllTasks }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editHours, setEditHours] = useState(0)
  const [editMinutes, setEditMinutes] = useState(0)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setEditName(task.name)
    setEditDescription(task.description)

    const hours = Math.floor(task.timeSpent)
    const minutes = Math.round((task.timeSpent - hours) * 60)

    setEditHours(hours)
    setEditMinutes(minutes)
  }

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete)
      setTaskToDelete(null)
    }
  }

  const handleDeleteAllConfirm = () => {
    onDeleteAllTasks()
    setShowDeleteAllDialog(false)
  }

  const incrementEditHours = () => {
    setEditHours((prev) => Math.min(prev + 1, 12))
  }

  const decrementEditHours = () => {
    setEditHours((prev) => Math.max(prev - 1, 0))
  }

  const incrementEditMinutes = () => {
    if (editMinutes === 55) {
      setEditMinutes(0)
      incrementEditHours()
    } else {
      setEditMinutes((prev) => prev + 5)
    }
  }

  const decrementEditMinutes = () => {
    if (editMinutes === 0) {
      if (editHours > 0) {
        setEditMinutes(55)
        decrementEditHours()
      }
    } else {
      setEditMinutes((prev) => prev - 5)
    }
  }

  const handleEditHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 12) {
      setEditHours(value)
    }
  }

  const handleEditMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      // Redondear a múltiplos de 5
      setEditMinutes(Math.round(value / 5) * 5)
    }
  }

  const handleSaveEdit = () => {
    if (editingTask && editName) {
      const timeSpent = editHours + editMinutes / 60

      onUpdateTask({
        ...editingTask,
        name: editName,
        description: editDescription,
        timeSpent,
      })

      setEditingTask(null)
    }
  }

  const formatTime = (timeInHours: number) => {
    const hours = Math.floor(timeInHours)
    const minutes = Math.round((timeInHours - hours) * 60)

    return `${hours}h ${minutes}m`
  }

  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground">No hay tareas registradas</p>
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Eliminar todas las tareas
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará todas las tareas y no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAllConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Eliminar todas
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarea</TableHead>
            <TableHead>Tiempo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="font-medium">{task.name}</div>
                {task.description && <div className="text-sm text-muted-foreground">{task.description}</div>}
              </TableCell>
              <TableCell>{formatTime(task.timeSpent)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Tarea</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Nombre de la tarea"
                          />
                        </div>
                        <div>
                          <Textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Descripción"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-hours">Horas</Label>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-r-none"
                                onClick={decrementEditHours}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                id="edit-hours"
                                type="text"
                                inputMode="numeric"
                                className="rounded-none text-center"
                                value={editHours}
                                onChange={handleEditHoursChange}
                                onFocus={(e) => e.target.select()}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-l-none"
                                onClick={incrementEditHours}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-minutes">Minutos</Label>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-r-none"
                                onClick={decrementEditMinutes}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                id="edit-minutes"
                                type="text"
                                inputMode="numeric"
                                className="rounded-none text-center"
                                value={editMinutes}
                                onChange={handleEditMinutesChange}
                                onFocus={(e) => e.target.select()}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-l-none"
                                onClick={incrementEditMinutes}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleSaveEdit}>Guardar</Button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setTaskToDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará la tarea "{task.name}" y no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

