"use client";

import React from "react";
import { useUser } from "@/app/context-provider";

export default function DisplayUser() {
  const { user } = useUser();

  if (!user) {
    return <h2>Not logged in</h2>;
  }

  return (
    <div>
      <h2>Logged in as {user.email}</h2>
    </div>
  );
}
