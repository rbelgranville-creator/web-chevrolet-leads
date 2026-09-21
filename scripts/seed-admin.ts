import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import bcrypt from "bcryptjs";
import { upsertAdmin } from "../lib/db";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) {
    console.error("Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env.local");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  upsertAdmin({ email, passwordHash, name });

  console.log(`Admin listo: ${email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
