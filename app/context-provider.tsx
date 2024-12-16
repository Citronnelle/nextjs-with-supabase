"use client";

import React from "react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export const UserContext = createContext<{ user: User | null } | null>(null);

const supabase = createClient();

export const UserProvider = ({
  children,
  serverUser,
}: {
  children: ReactNode;
  serverUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(serverUser);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session: ", error.message);
        setUser(null);
      } else {
        console.log(
          "Session fetched on client: ",
          data?.session?.user?.id || null
        );
        setUser(data?.session?.user || null);
      }
    };

    if (!serverUser) {
      fetchSession();
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed: ", session?.user?.id || null);
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.subscription?.unsubscribe();
    };
  }, [serverUser]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
