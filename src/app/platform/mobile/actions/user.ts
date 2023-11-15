"use server";
import { db } from "@/shared";
import { decodeJwt } from "@/shared/jwt";

export async function loadUserInfo(token: string) {
  const { forAuth } = decodeJwt(token);
  return await db.rbacUser.findFirst({
    where: { id: forAuth.create_user_id },
    include: { role: true },
    
  });
}

export type UserStockCountOut = {
  /**当前总库存 */
  totalWeight: number;
  /** 总库存批次 */
  totalCount: number;
};

export async function loadUserStockCount(token: string) {
  const { forAuth } = decodeJwt(token);

  const totalWeight = await db.wmsStock.aggregate({
    where: { owner_user_id: forAuth.create_user_id },
    _sum: {
      num: true,
    },
    _count: { id: true },
  });

  console.log("total weight:", totalWeight);

  return {
    totalWeight: totalWeight._sum.num,
    totalCount: totalWeight._count.id,
  };
}
