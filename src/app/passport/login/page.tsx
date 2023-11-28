'use client'
import { useState, useTransition } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { passportApi } from "../actions"; 
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [data, setData] = useState({ username: "", password: "" });
  const submit = async () => {
      passportApi.login(data).then((rtn) => {
        if (rtn.ok) {
          snackbar.enqueueSnackbar({
            message: "登录成功",
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "center" },
            autoHideDuration: 3000,
          });
          localStorage.setItem("token", rtn.token);
          router.push("/");
        } else {
          snackbar.enqueueSnackbar({
            message: rtn.msg,
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
            autoHideDuration: 3000,
          });
        }
      });
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          backgroundColor: "#e2e2e2",
        }}
      >
        <div style={{ width: "400px" }}>
          <div style={{ marginBottom: "20px" }}>
            <TextField
              label="用户名"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(v) => setData({ ...data, username: v.target.value })}
              fullWidth
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <TextField
              fullWidth
              label="密码"
              type="password"
              onChange={(v) => setData({ ...data, password: v.target.value })}
              autoComplete="current-password"
            />
          </div>
          <div>
            <Button
              variant="contained"
              disableElevation
              fullWidth
              onClick={() => submit()}
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
