import { client } from "./supabase";

test("测试supabase 上传文件", () => {
  client.storage.from("qwe").upload("a.txt", "hello");
});
