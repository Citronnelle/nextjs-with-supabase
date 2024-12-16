"use client";

import { useUser } from "@/app/context-provider";
import Link from "next/link";

export default function Header() {
  const { user } = useUser();

  return (
    <>
      <div className="flex flex-col gap-16 items-center">
        <div className="flex gap-8 justify-center items-center"></div>
        <div className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
          {!user && (
            <h1>
              <Link href={"/sign-in"} className="font-extrabold">
                Log in
              </Link>{" "}
              to add TODOs!
            </h1>
          )}
          {user && (
            <h1>
              <Link href={"/todos"} className="font-extrabold">
                Go here
              </Link>{" "}
              to add TODOs!
            </h1>
          )}
        </div>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
    </>
  );
}
