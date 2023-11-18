"use client";
import { useEffect, useRef, useState } from "react";
import { userApi, storageApi } from "../actions";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import { getToken } from "../utils";
import type { JwtTokenObject } from "@/shared/jwt";
import type { UserStockCountOut } from "../actions/user";
import { DateCalendar } from "@mui/x-date-pickers";
import { red } from "@mui/material/colors";
const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};
export function UserCenter() {
  const [userInfo, setUserInfo] = useState(
    {} as { username: string; role: { name: string },avatar:'' }
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<UserStockCountOut>({} as any);

  const navigate = useNavigate();
  const reloadUserInfo=()=>{
    userApi.loadUserInfo(getToken()).then((rtn) => setUserInfo(rtn));
  }
  useEffect(() => {
    reloadUserInfo();
    userApi.loadUserStockCount(getToken()).then((rtn) => setData(rtn));
  }, []);
  const loginOut = () => {
    localStorage.removeItem("token");
    navigate("/passport/login");
  };

  return (
    <div>
      {userInfo && 
         <Card sx={{ maxWidth: 345 }}>
         <CardHeader
           avatar={<Avatar sx={{ bgcolor: red[500] }} src={userInfo.avatar} aria-label="recipe"></Avatar>}
           title={userInfo.username}
           subheader={userInfo.role?.name}
         />
         </Card>
      }
      <div>
      <Fab
        color="secondary"
        aria-label="edit"
        style={{ position: "fixed", top: 30, right: 30 }}
        onClick={()=>fileRef.current?.click()}
      >
        <EditIcon />
      </Fab>
      </div>
      {/* <Button onClick={()=>{}}>上传头像</Button> */}
      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        placeholder="上传文件"
        onChange={async (e) => {
          const form = new FormData();
          let file = e.target.files ? e.target.files[0] : null;
          if (file) {
            form.append("file", file);
            form.append("filename", file.name);
            const { url } = await userApi.updateUserAvatar(form,getToken());
            reloadUserInfo()
          }
        }}
      ></input>
      <Card title={"个人信息"}>
        <CardContent>
          <List style={style}>
            {/* <ListItem button> 用户名:{userInfo?.username}</ListItem>
            <ListItem button>
              {" "}
              角色: <div>{userInfo.role && userInfo.role.name}</div>
            </ListItem> */}
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
