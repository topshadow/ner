import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlusOne from "@mui/icons-material/PlusOne";

import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import SupervisedUserCircle from "@mui/icons-material/SupervisedUserCircle";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddRecord from "./AddRecord";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StockTypesToLabel, WmsStockUser, checkLogin, getToken } from "../utils";
import { Grid } from "@mui/material";
import { RecordInfo } from "./RecordInfo";
import { stockApi } from "../actions";

const defaultTheme = createTheme();

export default function FixedBottomNavigation() {
  const navigate =useNavigate();
  const [value, setValue] = React.useState(0);
  const [selectedRecordId, setSelectedRecordId] = React.useState("");
  const [stocks, setStockts] = useState([] as WmsStockUser[]);
  const reload = () => {
    stockApi.listUserStock(getToken()).then((res) => {
      setStockts(res);
    });
  };
  useEffect(() => {
    if(checkLogin()){
      reload();
    }else{
      navigate('/passport/login')
    }
    
  }, []);

  return (
    <>
      <CssBaseline />
      <List style={{ paddingBottom: "80px" }}>
        {stocks.map((item, index) => (
          <ListItem
            button
            key={item.id}
            onClick={() => setSelectedRecordId(item.id)}
          >
            <ListItemAvatar>
              <Avatar
                alt="Profile Picture"
                src={
                  item.ownerUser
                    ? (item.ownerUser.avatar as string)
                    : "https://mui.com/static/images/avatar/1.jpg"
                }
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  {new Date(item.created_at).toLocaleString()}{" "}
                  <Chip label={item.product?.name} />
                </div>
              }
              secondary={<RecordItem details={item.details}></RecordItem>}
            />
          </ListItem>
        ))}
        <BasicSpeedDial onRefresh={() => reload()}></BasicSpeedDial>
      </List>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="最近进货" icon={<RestoreIcon />} />
          <BottomNavigationAction label="入货" icon={<PlusOne />} />
          <BottomNavigationAction
            label="我的"
            icon={<SupervisedUserCircle />}
            onClick={() => navigate("/user-center")}
          />
        </BottomNavigation>
      </Paper>
      {selectedRecordId && (
        <RecordInfo
          stockId={selectedRecordId}
          onClose={() => {
            setSelectedRecordId("");
            reload();
          }}
        ></RecordInfo>
      )}
    </>
    // </Box>
  );
}


export const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/passport/login");
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <FixedBottomNavigation></FixedBottomNavigation>
    </ThemeProvider>
  );
};

export function RecordItem(prop: { details: any[] }) {
  return (
    <Grid container spacing={1} style={{ paddingTop: "10px" }}>
      {prop.details.map((i) => (
        <Grid xs={4}>
          <Chip
            label={StockTypesToLabel(i.type) + "" + i.num + "kg"}
            color="primary"
            size={"small"}
          />
        </Grid>
      ))}
    </Grid>
  );
}

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export function BasicSpeedDial(props: { onRefresh: () => void }) {
  let [visible, setVisible] = React.useState(false);

  return (
    <>
      {visible && (
        <AddRecord
          onClose={() => {
            setVisible(false);
            props.onRefresh();
          }}
        ></AddRecord>
      )}
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 100, right: 30 }}
        icon={<SpeedDialIcon />}
        onClick={() => setVisible(true)}
      ></SpeedDial>
    </>
  );
}
