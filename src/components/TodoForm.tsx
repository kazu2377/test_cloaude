"use client";

import { addTodo } from "@/app/_actions/todo";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

// 送信ボタンコンポーネント（pending状態を管理）
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {pending ? "追加中..." : "TODOを追加"}
    </button>
  );
}

export default function TodoForm() {
  const router = useRouter();

  // addTodo をラップして Promise<void> を返す
  const handleAddTodo = async (formData: FormData) => {
    await addTodo(formData);
    router.refresh(); // ← 追加
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">新しいTODOを追加</h2>
      <form action={handleAddTodo} className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="TODOのタイトルを入力..."
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SubmitButton />
      </form>
    </div>
  );
}
