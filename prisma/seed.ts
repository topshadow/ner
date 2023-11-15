import { parseArgs } from "node:util";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const options = {
  environment: { type: "string" },
};

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options: options as any }) as any;
  seedUsers();
  switch (environment) {
    case "development":
      /** data for your development */
      break;
    case "test":
      /** data for your test environment */
      break;
    default:
      break;
  }
}

async function seedUsers() {
  const tenant = await prisma.tenant.create({ data: { name: "租户a" } });
  const role = await prisma.rbacRole.create({
    data: { name: "管理员", code: "admin" },
  });

  await prisma.rbacUser.create({
    data: {
      username: "13419597065",
      password: "123456",
      nickname: "jack young",
      tenant_id: tenant.id,
      role_id: role.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
