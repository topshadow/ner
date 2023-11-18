"use client";
import { useEffect, useState } from "react";
import { userApi, storageApi } from "../actions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils";
import type { JwtTokenObject } from "@/shared/jwt";
import type { UserStockCountOut } from "../actions/user";
import { DateCalendar } from "@mui/x-date-pickers";
const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};
export function UserCenter() {
  const [userInfo, setUserInfo] = useState(
    {} as { username: string; role: { name: string } }
  );
  const [data, setData] = useState<UserStockCountOut>({} as any);
  const [avatar,setAvatar]=useState('');
  const navigate = useNavigate();
  useEffect(() => {
    userApi.loadUserInfo(getToken()).then((rtn) => setUserInfo(rtn));
    userApi.loadUserStockCount(getToken()).then((rtn) => setData(rtn));
  }, []);
  const loginOut = () => {
    localStorage.removeItem("token");
    navigate("/passport/login");
  };

  return (
    <div>
      {avatar&&<img src={avatar} />}
      {/* <Button onClick={()=>{}}>上传头像</Button> */}
      <input
        type="file"
        placeholder="上传文件"
        onChange={async (e) => {
          const form = new FormData();
          let file = e.target.files ? e.target.files[0] : null;
          if (file) {
            form.append("file", file);
            form.append('filename',file.name);
          const {url}=   await storageApi.upload(form);
          setAvatar(url)
          }
        }}
      ></input>
      <Card title={"个人信息"}>
        <CardHeader title={"个人信息"}></CardHeader>
        <CardContent>
          <List style={style}>
            <ListItem button> 用户名:{userInfo?.username}</ListItem>
            <ListItem button>
              {" "}
              角色: <div>{userInfo.role && userInfo.role.name}</div>
            </ListItem>
            <ListItem button>
              {" "}
              当前总库存:<div>{data.totalWeight}kg</div>
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <div>
        <DateCalendar />
      </div>

      <Button
        color={"error"}
        variant={"contained"}
        fullWidth
        style={{ position: "fixed", left: 0, bottom: "80px" }}
        onClick={() => loginOut()}
      >
        退出
      </Button>
      <Button
        color={"secondary"}
        variant={"contained"}
        fullWidth
        style={{ position: "fixed", left: 0, bottom: "30px" }}
        onClick={() => navigate("/")}
      >
        返回
      </Button>
    </div>
  );
}
