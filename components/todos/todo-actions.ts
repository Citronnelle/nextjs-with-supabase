"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const insertTodoAction = async (formData: FormData) => {
  const supabase = createClient();

  let title = formData.get("title") as string;
  let priority = parseInt(formData.get("priority") as string);

  let { data, error } = await supabase.from("todos").insert({
    title: title,
    priority: priority,
  });

  if (error) console.log(error.code + " " + error.message);
  revalidatePath("/todos");
  return redirect("/todos");
};
