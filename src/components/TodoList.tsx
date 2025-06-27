import { getTodos, toggleTodo, deleteTodo } from '@/app/_actions/todo'
import { revalidatePath } from 'next/cache'

// 個別のTODOアイテムコンポーネント
async function TodoItem({ todo }: { todo: any }) {
  // 完了状態を切り替えるServer Action
  async function handleToggle() {
    'use server'
    await toggleTodo(todo.id)
    revalidatePath('/')
  }

  // TODOを削除するServer Action
  async function handleDelete() {
    'use server'
    await deleteTodo(todo.id)
    revalidatePath('/')
  }

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded mb-2">
      <form action={handleToggle}>
        <button
          type="submit"
          className={`w-4 h-4 rounded border-2 ${
            todo.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {todo.completed && '✓'}
        </button>
      </form>
      
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
        {todo.title}
      </span>
      
      <span className="text-sm text-gray-400">
        {todo.createdAt.toLocaleDateString('ja-JP')}
      </span>
      
      <form action={handleDelete}>
        <button
          type="submit"
          className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
        >
          削除
        </button>
      </form>
    </div>
  )
}

export default async function TodoList() {
  const todos = await getTodos()

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        TODOがありません。上のフォームから追加してください。
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">TODOリスト ({todos.length}件)</h2>
      <div>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}