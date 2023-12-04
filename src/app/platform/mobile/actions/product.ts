'use server'
import { db } from "@/shared";
import { jwt } from "@/shared";
import { WmsProduct } from "@prisma/client";

type AddProductInput = Pick<WmsProduct, "name" | "note">;
/**创建产品 */
export async function addProduct(input: AddProductInput, token: string) {
  const { forAuth } = jwt.decodeJwt(token);
  console.log(forAuth)
  await db.wmsProduct.create({
    data: {
      ...input,
      ...forAuth,
    },
  });
  return { ok: true,msg:'新增产品成功' };
}

/**列出产品 */
export async function listProduct(token: string) {
  const { forAuth } = jwt.decodeJwt(token);
  return await db.wmsProduct.findMany({
    where: { tenant_id: forAuth.tenant_id },
  });
}

export async function detail(productId:string,token:string){
 return await db.wmsProduct.findFirst({where:{id:productId}})
}
export async function update(data:WmsProduct,token:string){
  console.log(data)
  await db.wmsProduct.update({where:{id:data.id},data:{name:data.name,note:data.note}});
  return {ok:true,msg:'更新成功'}
}