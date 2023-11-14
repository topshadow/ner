"use server";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
export async function login(
  { username, password }: { username: string; password: string },
) {
  const user = await client.user.findFirst({ where: { name: username } });
  if (user?.email == password) {
    return { ok: true, token: "token", msg: "登陆成功" };
  } else {
    return { ok: false, token: "false", msg: "用户名或密码错误" };
  }
}
