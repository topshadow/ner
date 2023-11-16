"use server";
import { supabase } from "@/shared";
export async function upload(form: FormData) {
  console.log("上传图片 服务端");
  let filename = form.get("filename")?.toString().split(".").pop();
  filename = "/" + (Math.random() * 1000000).toFixed(0) + "." + filename;

  await supabase.storage.from("qwe").upload(filename, form);
  let url = "https://kryzbeuppgokwycotrtc.supabase.co/storage/v1/object/public/qwe"+filename;
  return { ok: true ,url};
}
