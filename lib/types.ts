export interface Task {
  id: string
  name: string
  description: string
  timeSpent: number
  date: string
}

export interface TaskSummaryItem {
  name: string
  totalTime: number
  count: number
}

