'use server'
import { db } from "@/shared";
import { jwt } from "@/shared";
import { WmsProduct } from "@prisma/client";

type AddProductInput = Pick<WmsProduct, "name" | "note">;
/**创建产品 */
export async function addProduct(input: AddProductInput, token: string) {
  const { forAuth } = jwt.decodeJwt(token);
  await db.wmsProduct.create({
    data: {
      ...input,
      ...forAuth,
    },
  });
  return { ok: true };
}

/**列出产品 */
export async function listProduct(token: string) {
  const { forAuth } = jwt.decodeJwt(token);
  return await db.wmsProduct.findMany({
    where: { tenant_id: forAuth.tenant_id },
  });
}
