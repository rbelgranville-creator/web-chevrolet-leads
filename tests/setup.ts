import { afterEach } from "vitest";
import { resetDbConnection } from "@/lib/db";

afterEach(() => {
  resetDbConnection();
});
