'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function AddUser(

  { name, email }: { name: string; email: string },
) {
    console.log('create use in server')
  await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  });
  return prisma.user.findMany();
}


export async function listUser(){
    return prisma.user.findMany();
}