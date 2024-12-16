import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth?.getUser();

  if (!data?.user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <div className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
            {data?.user && (
              <h1>
                <Link href={"/todos"} className="font-extrabold">
                  Go here
                </Link>{" "}
                to add TODOs!
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
