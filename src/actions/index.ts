'use server'
export  async function LogFromServer() {
  console.log("log in server");
  return { ok: true };
}
