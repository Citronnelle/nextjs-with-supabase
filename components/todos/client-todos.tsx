"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientTodos() {
  const supabase = createClient();

  const [user, setUser] = useState<any | null>();
  const [todos, setTodos] = useState<any[] | null>([]);

  useEffect(() => {
    const getUser = async () => {
      let { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.log("No user detected");
      } else {
        setUser(user);
      }
    };

    getUser();

    const fetchTodos = async () => {
      let { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .is("deleted_at", null);

      if (error) {
        console.log("Could not fetch TODOs");
      } else {
        setTodos(todos);
      }
    };

    fetchTodos();

    // (() => console.log("hi"))();
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1>Client TODOs</h1>
        {!todos || todos.length === 0 ? (
          <h3>No todos found</h3>
        ) : (
          <pre>{JSON.stringify(todos, null, 2)}</pre>
        )}
        {user ? (
          <form className="flex-1 flex flex-col min-w-64">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="title">Title</Label>
              <Input name="title" required />
              <Label htmlFor="priority">Priority</Label>
              <Input type="number" name="priority" required />
              <SubmitButton pendingText="Lisamine...">LISA</SubmitButton>
            </div>
          </form>
        ) : null}
      </main>
    </>
  );
}
