"use server"
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
import { jwt } from "@/shared/index";
export async function login(
  { username, password }: { username: string; password: string },
) {
  const user = await client.rbacUser.findFirst({
    where: { username: username },
  });

  if (user?.password == password) {
    const token = jwt.encodeJwt({
      user_id: user.id,
      tenant_id: user.tenant_id,
      role_id: user.role_id,
      username,
      forAuth:{create_user_id:user.id,tenant_id:user.tenant_id},
      is_admin:!!user.is_admin
    });
    debugger;
    console.log('is admin login:',!!user.is_admin)
    return { ok: true, token: token, msg: "登陆成功" };
  } else {
    return { ok: false, token: "false", msg: "用户名或密码错误" };
  }
}
