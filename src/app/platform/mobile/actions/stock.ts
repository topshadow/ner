'use server'
import { decodeJwt } from "@/shared/jwt";
import { db } from "@/shared";
import { Prisma } from "@prisma/client";

/**列出用户stocks */
export async function listUserStock(token: string) {
  const { user_id, is_admin } = await decodeJwt(token);
  // 管理员可以查看所有人
  const where = is_admin ? {} : { owner_user_id: user_id };
  return await db.wmsStock.findMany({
    where,
    include: {
      product: true,
      details: true,
      ownerUser: true,
      createUser: true,
    },
  });
}
type CreateUserStockInputArg =
  & Pick<Prisma.WmsStockUncheckedCreateInput, "num" | "note" | "product_id">
  & { type: string };

/**创建stock */
export async function createUserStock(
  input: CreateUserStockInputArg,
  token: string,
) {
  console.log('create sotcok in server')
  const { forAuth } = await decodeJwt(token);
  const { num, note, product_id, type } = input;
  if (!type || !num || !product_id || !note) {
    return { ok: false, msg: "请完善信息" };
  }
  const stock = await db.wmsStock.create({
    data: {
      owner_user_id: forAuth?.create_user_id,
      ...forAuth,
      origin_num: input.num,

      product_id,
      note,
      num,
    },
  });
  await db.wmsStockDetail.create({
    data: {
      num,
      note,
      type,
      stock_id: stock.id,
      owner_user_id: forAuth?.create_user_id,

      ...forAuth,
      unit: "",
      image_url: "",
    },
  });
  return { ok: true, msg: "新增成功" };
}

/** */
export async function stockDetail(stockId: string, token: string) {
  let { forAuth } = decodeJwt(token);
  console.log(stockId)
  const data = await db.wmsStock.findFirst({
    where: { id: stockId },
    include: { details: true, ownerUser: true, createUser: true, product: true },
  });
  return data;
}

export async function addStockDetail(
  input: { num: number; note: string; stock_id: string; type: string },
  token: string,
) {
  if (!input.note) {
    return { ok: false, msg: '请填写备注' }
  }
  const { forAuth } = decodeJwt(token);
  await db.wmsStockDetail.create({
    data: {
      ...input,
      unit: "kg",
      ...forAuth,
      owner_user_id: forAuth.create_user_id,
      image_url: "",
    },
  });
  await db.wmsStock.update({
    where: { id: input.stock_id },
    data: {
      num: input.num,
    },
  });

  return { ok: true };
}

export async function toggleStockLock(stockId: string, is_lock: boolean) {
  await db.wmsStock.update({ where: { id: stockId }, data: { is_lock } });
  return { ok: true, msg: is_lock ? '封账成功' : '解封成功' }
}