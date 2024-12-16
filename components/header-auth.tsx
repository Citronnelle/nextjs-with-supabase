"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { useUser } from "@/app/context-provider";

export default function AuthButton() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  );
}
