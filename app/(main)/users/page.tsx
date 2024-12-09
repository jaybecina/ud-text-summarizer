import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UsersPage = async () => {
  const saltRounds = 10;
  const password = "user_password";

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.first_name} {user.last_name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
