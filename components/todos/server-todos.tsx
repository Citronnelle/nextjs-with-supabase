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

export default async function ServerTodos({
  searchParams,
}: {
  searchParams: any;
}) {
  const supabase = createClient();

  const id = searchParams?.id || null;
  const resetKey = searchParams?.resetKey || "";

  let currentTodo: Todo | null = null;

  console.log("id: " + id);
  console.log("resetKey: " + resetKey);
  if (resetKey != "") {
    currentTodo = null;
  } else if (id) {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error.code + " " + error.message);
    } else {
      currentTodo = data;
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .is("deleted_at", null)
      .order("priority", { ascending: true })
      .order("title", { ascending: true });

    if (error) console.log(error.code + " " + error.message);

    return todos;
  };

  const todos = await fetchTodos();

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1>Server TODOs</h1>
        {!todos || todos.length === 0 ? (
          <h3>No todos found</h3>
        ) : (
          /* <pre>{JSON.stringify(todos, null, 2)}</pre> */
          todos.map((t) => (
            <div
              key={t.id}
              className="button-group"
              style={{ display: "inline-flex", gap: "8px" }}
            >
              <b>{t.title}</b> | <b>{t.priority}</b> |
              <form method="GET">
                <Input type="hidden" name="id" value={t.id} />
                <button type="submit">EDIT</button>
              </form>{" "}
              |
              <form method="POST">
                <Input type="hidden" name="id" value={t.id} />
                <SubmitButton type="submit" formAction={deleteTodoAction}>
                  DELETE
                </SubmitButton>
              </form>
            </div>
          ))
        )}
        {user ? (
          <form className="flex-1 flex flex-col min-w-64">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Input type="hidden" name="id" value={currentTodo?.id ?? ""} />
              <Input type="hidden" name="resetKey" value={id ?? ""} />
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
              >
                {currentTodo ? "EDIT" : "ADD"}
              </SubmitButton>
            </div>
          </form>
        ) : null}
      </main>
    </>
  );
}
