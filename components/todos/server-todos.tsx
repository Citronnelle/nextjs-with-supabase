"use server";

import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { insertTodoAction } from "./todo-actions";

export default async function ServerTodos() {
  const supabase = createClient();
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
              <b>{t.title}</b> | <b>{t.priority}</b>
            </div>
          ))
        )}
        {user ? (
          <form className="flex-1 flex flex-col min-w-64">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="title">Title</Label>
              <Input name="title" required />
              <Label htmlFor="priority">Priority</Label>
              <Input type="number" name="priority" required />
              <SubmitButton
                pendingText="Saving..."
                formAction={insertTodoAction}
              >
                {"ADD"}
              </SubmitButton>
            </div>
          </form>
        ) : null}
      </main>
    </>
  );
}
