'use server'

// TODOアイテムの型定義
export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

// メモリ内データストア（実際のプロジェクトではデータベースを使用）
let todos: Todo[] = [
  { id: '1', title: 'Next.js 15を学習する', completed: false, createdAt: new Date() },
  { id: '2', title: 'Server Actionsを理解する', completed: true, createdAt: new Date() }
]

// TODOを追加するServer Action
export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string
  
  if (!title || title.trim() === '') {
    return { error: 'タイトルを入力してください' }
  }
  
  const newTodo: Todo = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date()
  }
  
  todos.push(newTodo)
  
  return { success: true, todo: newTodo }
}

// TODOの完了状態を切り替えるServer Action
export async function toggleTodo(id: string) {
  const todo = todos.find(t => t.id === id)
  
  if (!todo) {
    return { error: 'TODOが見つかりません' }
  }
  
  todo.completed = !todo.completed
  
  return { success: true, todo }
}

// TODOを削除するServer Action
export async function deleteTodo(id: string) {
  const index = todos.findIndex(t => t.id === id)
  
  if (index === -1) {
    return { error: 'TODOが見つかりません' }
  }
  
  todos.splice(index, 1)
  
  return { success: true }
}

// 全TODOを取得するServer Action
export async function getTodos() {
  return todos
}