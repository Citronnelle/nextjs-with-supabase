import { UUID } from "crypto";

export type Todo = {
  id: UUID;
  title: string;
  priority: number;
  created_at: number;
  updated_at: number | null;
  deleted_at: number | null;
  user_id: UUID;
};
