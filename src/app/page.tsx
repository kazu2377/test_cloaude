import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import SearchBox from '@/components/SearchBox'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: Props) {
  // URLから検索パラメータを取得
  const resolvedSearchParams = await searchParams
  const searchQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined
  const searchFilter = typeof resolvedSearchParams.filter === 'string' ? resolvedSearchParams.filter : undefined
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Next.js 15 Server Actions TODOアプリ
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* TODOフォーム */}
        <TodoForm />
        
        {/* 検索ボックス */}
        <SearchBox />
        
        {/* TODOリスト */}
        <TodoList searchQuery={searchQuery} searchFilter={searchFilter} />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">この例で学べること：</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><code>'use server'</code> ディレクティブでServer Actionsを定義</li>
          <li>FormDataを使ったフォーム送信の処理</li>
          <li><code>useFormStatus</code> でフォームの送信状態を管理</li>
          <li><code>revalidatePath</code> でページの再検証</li>
          <li>Server ComponentとClient Componentの使い分け</li>
          <li><code>useTransition</code> でリアルタイム検索とローディング状態管理</li>
          <li>URLSearchParamsを使った検索状態の永続化</li>
          <li>デバウンス処理による検索パフォーマンス最適化</li>
        </ul>
      </div>
    </main>
  )
}