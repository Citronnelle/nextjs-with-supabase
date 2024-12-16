"use server";

import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteTodoAction,
  insertTodoAction,
  updateTodoAction,
} from "./todo-actions";
import { Todo } from "./todo-entity";
import { UUID } from "crypto";

export default async function ServerTodos({
  searchParams,
}: {
  searchParams: any;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let id: UUID | null = params?.id || null;
  let edit = params?.edit || null;
  let success = params?.success || null;
  let currentTodo: Todo | null = null;

  let id1 = id;
  let edit1 = edit;
  let success1 = success;

  if (edit === "1" && id) {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", user?.id)
      .single();

    if (error) {
      console.log(error.code + " " + error.message);
    } else {
      currentTodo = data;
    }
  }

  if (success === "1") {
    currentTodo = null;
    id = null;
    edit = null;
    success = null;
    console.log("Form reset...allegedly");
  }

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .is("deleted_at", null)
      .eq("user_id", user?.id)
      .order("priority", { ascending: true })
      .order("title", { ascending: true });

    if (error) console.log(error.code + " " + error.message);

    return todos;
  };

  const todos = await fetchTodos();

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="text-xl font-bold">Server TODOs</h2>
        {!todos || todos.length === 0 ? (
          <h3>No todos found</h3>
        ) : (
          /* <pre>{JSON.stringify(todos, null, 2)}</pre> */

          todos.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[2fr_1fr_auto_auto] gap-4 items-center bg-gray-50 p-2 rounded-md"
            >
              <span className="font-medium truncate">{t.title}</span>
              <span className="text-gray-500">⭐️ {t.priority}</span>
              <div className="flex justify-end gap-2">
                <form method="GET">
                  <Input type="hidden" name="edit" value="1" />
                  <Input type="hidden" name="id" value={t.id} />
                  <SubmitButton
                    type="submit"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded"
                    title="Edit"
                  >
                    ✏️
                  </SubmitButton>
                </form>{" "}
                <form method="POST">
                  <Input type="hidden" name="id" value={t.id} />
                  <SubmitButton
                    type="submit"
                    formAction={deleteTodoAction}
                    className="bg-red-200 hover:bg-red-300 text-red-700 py-1 px-3 rounded"
                    title="Delete"
                  >
                    ❌
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))
        )}
        {user ? (
          <form className="flex-1 flex flex-col min-w-64">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Input type="hidden" name="edit" value="0" />
              <Input type="hidden" name="success" value="0" />
              {currentTodo ? (
                <Input type="hidden" name="id" value={currentTodo?.id} />
              ) : (
                ""
              )}
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                defaultValue={currentTodo?.title ?? ""}
                required
              />
              <Label htmlFor="priority">Priority</Label>
              <Input
                type="number"
                name="priority"
                defaultValue={currentTodo?.priority ?? 0}
                required
              />

              <SubmitButton
                pendingText="Saving..."
                formAction={currentTodo ? updateTodoAction : insertTodoAction}
                className={`py-2 px-4 rounded text-white font-semibold transition-colors ${
                  id
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                title={`${id ? "Edit" : "Add"}`}
              >
                {currentTodo ? (
                  "🖉 EDIT"
                ) : (
                  <>
                    <span className="font-extrabold text-xl">＋</span>{" "}
                    <span>ADD</span>
                  </>
                )}
              </SubmitButton>
            </div>
          </form>
        ) : null}
      </main>
    </>
  );
}
