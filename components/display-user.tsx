"use client";

import React from "react";
import { useUser } from "@/app/context-provider";

export default function DisplayUser() {
  const { user } = useUser();

  if (!user) {
    return <h2 className="text-center text-xl font-bold">Not logged in</h2>;
  }

  return (
    <div>
      <h2 className="text-center text-xl">
        Logged in as <span className="font-bold">{user.email}</span>
      </h2>
    </div>
  );
}
