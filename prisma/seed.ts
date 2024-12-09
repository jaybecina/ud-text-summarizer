import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const prisma = new PrismaClient();
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const saltRounds = 10;

  const users = [
    {
      email: "admin@admin.com",
      password: "password@123",
      first_name: "Admin",
      last_name: "Admin",
    },
    {
      email: "user@test.com",
      password: "password@123",
      first_name: "User",
      last_name: "Test",
    },
  ];

  const createUsersPromises = users.map((user) => {
    return bcrypt.hash(user.password, saltRounds).then((hashedPassword) => {
      supabaseSignUp(user.email, user.password);
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          password: hashedPassword,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    });
  });

  await Promise.all(createUsersPromises);

  console.log("Seeding completed.");
}

async function supabaseSignUp(email: string, password: string) {
  try {
    await supabase.auth.signUp({
      email,
      password,
    });
    return;
  } catch (error) {
    console.error("Error: ", error);
    return { error: { message: "An unexpected error occurred during signup" } };
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
