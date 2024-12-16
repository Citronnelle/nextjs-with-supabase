"use client";

import { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Todo } from "./todo-entity";
import { useUser } from "@/app/context-provider";

export default function ClientTodos() {
  //const router = useRouter();
  const supabase = createClient();
  const { user } = useUser();

  const [todos, setTodos] = useState<any[] | null>([]);
  const [id, setId] = useState<UUID | null>();
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }

    // (() => console.log("hi"))();
  }, [user]);

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .is("deleted_at", null)
      .eq("user_id", user?.id)
      .order("priority", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      console.log("Could not fetch TODOs: " + error.message);
      alert("Failed to fetch TODOs. Please refresh the page");
    } else {
      setTodos(todos || []);
    }
  };

  const addTodo = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("todos")
      .insert({
        title: title,
        priority: priority,
        user_id: user?.id,
      })
      .select();

    if (error) {
      console.log(error.code + " " + error.message);
      alert("Failed to add TODO");
    }

    //router.refresh();
    fetchTodos();
    resetForm();
  };

  const editTodo = async () => {
    if (!user || !id) return;

    let { data, error } = await supabase
      .from("todos")
      .update({
        title: title,
        priority: priority,
        updated_at: new Date().toISOString(),
        user_id: user?.id,
      })
      .eq("user_id", user?.id)
      .eq("id", id);

    if (error) {
      console.log(error.code + " " + error.message);
      alert("Failed to update TODO");
    }

    fetchTodos();
    resetForm();
  };

  const deleteTodo = async (id: UUID) => {
    if (!user || !id) return;
    console.log(id);
    let { data, error } = await supabase
      .from("todos")
      .update({
        deleted_at: new Date().toISOString(),
        user_id: user?.id,
      })
      .eq("user_id", user?.id)
      .eq("id", id);

    if (error) {
      console.log(error.code + " " + error.message);
      alert("Failed to delete TODO");
    }

    fetchTodos();
    //resetForm();
  };

  const setToEdit = (todo: Todo) => {
    setId(todo.id);
    setTitle(todo.title);
    setPriority(todo.priority);

    //router.refresh();
  };

  const resetForm = () => {
    setId(null);
    setTitle("");
    setPriority(0);
  };

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="text-xl font-bold">Client TODOs</h2>
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
                <Button
                  onClick={() => setToEdit(t)}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-1 px-3 rounded"
                  title="Edit"
                >
                  ✏️
                </Button>
                <Button
                  onClick={() => deleteTodo(t.id)}
                  className="bg-red-200 hover:bg-red-300 text-red-700 py-1 px-3 rounded"
                  title="Delete"
                >
                  ❌
                </Button>
              </div>
            </div>
          ))
        )}
        {user ? (
          <form className="flex-1 flex flex-col min-w-64">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                value={title || ""}
                required
                onChange={(ev) => setTitle(ev.target.value)}
              />
              <Label htmlFor="priority">Priority</Label>
              <Input
                type="number"
                name="priority"
                value={priority || 0}
                required
                onChange={(ev) => setPriority(parseInt(ev.target.value) ?? 0)}
              />
              <SubmitButton
                pendingText="Saving..."
                formAction={id ? editTodo : addTodo}
                className={`py-2 px-4 rounded text-white font-semibold transition-colors ${
                  id
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                title={`${id ? "Edit" : "Add"}`}
              >
                {id ? (
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
