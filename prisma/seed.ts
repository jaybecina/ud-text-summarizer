import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });