"use server";
import { db } from "@/shared";
import { decodeJwt } from "@/shared/jwt";
import { storageApi } from ".";


export async function loadUserInfo(token: string) {
  const { forAuth } = decodeJwt(token);
  return await db.rbacUser.findFirst({
    where: { id: forAuth.create_user_id },
    include: { role: true },
  });
}
export async function loadUserInfoById(userId: string) {
  return await db.rbacUser.findFirst({
    where: { id:userId },
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
export async function updateUserAvatar(form: FormData, token: string) {
  const { forAuth } = decodeJwt(token);
  const { url } = await storageApi.upload(form);
  await db.rbacUser.update({
    where: { id: forAuth.create_user_id },
    data: { avatar: url },
  });
  return { ok: true,url };
}

export async function isAdmin(token:string){
  const isAdmin=decodeJwt(token).is_admin;
  console.log(isAdmin)
  return  isAdmin;
}

export async function loadUsers(token:string){
  const {tenant_id}=decodeJwt(token);
  const users= await db.rbacUser.findMany({where:{tenant_id:tenant_id}});
  return users;
}

export async function addUser(newUser:any,token:string){
  const {forAuth}= decodeJwt(token);
  const {nickname,password,username,is_admin}=newUser;
  if(!newUser.nickname||!newUser.password||!newUser.username){
    return {ok:false,msg:'请完善信息'}
  }
  await db.rbacUser.create({data:{
    nickname,
    password,
    username,
    is_admin,
    tenant_id:forAuth.tenant_id,
    role_id:'82517f8c-8e2b-496a-9f1e-4eec7030f6ab'
  }});
  return {ok:true,msg:'新增用户成功'}
}
 export async function updateUserInfo(user:any,token:string){
await db.rbacUser.update({where:{id:user.id},data:{nickname:user.nickname,is_admin:user.is_admin,password:user.password,username:user.username} })
  return {ok:true,msg:'更新成功'}
}