import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  type Todo = {
    id: string;
    title: string;
    priority: number;
    created_at: number;
    updated_at: number | null;
    deleted_at: number | null;
    user_id: string;
  };

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .is("deleted_at", null);
    if (error) console.log(error);

    return todos;
  };

  const addTodo = async (todo: Todo) => {
    let { data: todos, error } = await supabase.from("todos").insert({
      title: todo.title,
      priority: todo.priority,
    });
    if (error) console.log(error);
  };

  const editTodo = async (todo: Todo) => {
    let { data: todos, error } = await supabase
      .from("todos")
      .update({
        title: todo.title,
        priority: todo.priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", todo.id);
    if (error) console.log(error);
  };

  const deleteTodo = async (todo: Todo) => {
    let { data: todos, error } = await supabase
      .from("todos")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", todo.id);
    if (error) console.log(error);
  };

  let todos = await fetchTodos();
  if (!todos || todos.length === 0) {
    return <h1>No todos found</h1>;
  }

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <pre>{JSON.stringify(todos, null, 2)}</pre>

        <form className="flex-1 flex flex-col min-w-64">
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="title">Title</Label>
            <Input name="title" required />
            <Label htmlFor="priority">Priority</Label>
            <Input type="number" name="priority" required />
            <SubmitButton pendingText="Lisamine...">LISA</SubmitButton>
          </div>
        </form>
      </main>
    </>
  );
}
