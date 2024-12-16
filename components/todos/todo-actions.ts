"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

export const insertTodoAction = async (formData: FormData) => {
  const supabase = await createClient();

  let title = formData.get("title") as string;
  let priority = parseInt(formData.get("priority") as string);

  let { data, error } = await supabase.from("todos").insert({
    title: title,
    priority: priority,
  });

  if (error) console.log(error.code + " " + error.message);
  revalidatePath("/todos", "layout");
  return redirect("/todos", RedirectType.push);
};

export const updateTodoAction = async (formData: FormData) => {
  const supabase = await createClient();

  let id = formData.get("id") as string;
  let title = formData.get("title") as string;
  let priority = parseInt(formData.get("priority") as string);

  let { data, error } = await supabase
    .from("todos")
    .update({
      title: title,
      priority: priority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) console.log(error.code + " " + error.message);
  else formData.set("resetKey", id);

  revalidatePath("/todos", "layout");
  return redirect("/todos", RedirectType.push);
};

export const deleteTodoAction = async (formData: FormData) => {
  const supabase = await createClient();

  let id = formData.get("id") as string;

  let { data, error } = await supabase
    .from("todos")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) console.log(error.code + " " + error.message);
  revalidatePath("/todos", "layout");
  return redirect("/todos", RedirectType.push);
};
