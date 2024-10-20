"use client";

import { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientTodos() {
  //const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any | null>();
  const [todos, setTodos] = useState<any[] | null>([]);

  const [id, setId] = useState<UUID | null>();
  const [title, setTitle] = useState<string | null>();
  const [priority, setPriority] = useState<number | null>();

  useEffect(() => {
    getUser();
    fetchTodos();

    // (() => console.log("hi"))();
  }, []);

  const getUser = async () => {
    let { data: user, error } = await supabase.auth.getUser();
    if (error) {
      console.log("No user detected");
    } else {
      setUser(user);
    }
  };

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .is("deleted_at", null)
      .order("priority", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      console.log("Could not fetch TODOs");
    } else {
      setTodos(todos);
    }
  };

  const addTodo = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("todos")
      .insert({ title: title, priority: priority })
      .select();

    if (error) console.log(error.code + " " + error.message);

    //router.refresh();
    fetchTodos();
  };

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1>Client TODOs</h1>
        {!todos || todos.length === 0 ? (
          <h3>No todos found</h3>
        ) : (
          /* <pre>{JSON.stringify(todos, null, 2)}</pre> */
          todos.map((t) => (
            <p key={t.id}>
              <b>{t.title}</b> | <b>{t.priority}</b>
            </p>
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
              <SubmitButton pendingText="Saving..." formAction={addTodo}>
                ADD
              </SubmitButton>
            </div>
          </form>
        ) : null}
      </main>
    </>
  );
}
