import { getTodos, searchTodos, toggleTodo, deleteTodo } from '@/app/_actions/todo'
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

export default async function TodoList({ 
  searchQuery, 
  searchFilter 
}: { 
  searchQuery?: string; 
  searchFilter?: string; 
}) {
  // 検索パラメータがある場合は検索、ない場合は全件取得
  const todos = (searchQuery || searchFilter) 
    ? await searchTodos(searchQuery, searchFilter as 'all' | 'completed' | 'pending')
    : await getTodos();

  const allTodos = await getTodos();

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery || (searchFilter && searchFilter !== 'all') ? (
          <>
            <p>検索条件に一致するTODOがありません。</p>
            <p className="text-sm mt-2">
              全{allTodos.length}件中 0件が一致
            </p>
          </>
        ) : (
          "TODOがありません。上のフォームから追加してください。"
        )}
      </div>
    )
  }

  // 検索結果のサマリー
  const isFiltered = searchQuery || (searchFilter && searchFilter !== 'all');
  const summaryText = isFiltered 
    ? `検索結果: ${todos.length}件 (全${allTodos.length}件中)`
    : `TODOリスト (${todos.length}件)`;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{summaryText}</h2>
      
      {/* 検索条件の表示 */}
      {isFiltered && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
          <div className="flex flex-wrap gap-2 text-sm">
            {searchQuery && (
              <span>
                キーワード: <strong>"{searchQuery}"</strong>
              </span>
            )}
            {searchFilter && searchFilter !== 'all' && (
              <span>
                フィルター: <strong>
                  {searchFilter === 'completed' ? '完了済み' : '未完了'}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}
      
      <div>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}