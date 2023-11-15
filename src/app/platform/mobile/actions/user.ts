'use server'
import { decodeJwt } from "@/shared/jwt";

export async function loadUserInfo(token: string) {
  return decodeJwt(token);
}
