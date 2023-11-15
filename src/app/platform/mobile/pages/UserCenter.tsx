import { useEffect, useState } from "react";
import { userApi } from "../actions";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils";
import type { JwtTokenObject } from "@/shared/jwt";

export function UserCenter() {
  const [userInfo, setUserInfo] = useState({} as JwtTokenObject);
  const navigate = useNavigate();
  useEffect(() => {
    userApi.loadUserInfo(getToken()).then((rtn) => setUserInfo(rtn));
  }, []);
  const loginOut = () => {
    localStorage.removeItem("token");
    navigate("/passport/login");
  };

  return (
    <div>
      <div>
        <div>用户名</div>
        <div>{userInfo?.username}</div>
      </div>
      <Button
        color={"error"}
        variant={"contained"}
        fullWidth
        style={{ position: "fixed", left: 0, bottom: "30px" }}
        onClick={() => loginOut()}
      >
        退出
      </Button>
    </div>
  );
}
