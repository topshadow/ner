import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  IconButton,
  Slide,
  SpeedDial,
  SpeedDialIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import type { TransitionProps } from "notistack";
import React, { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  StockTypes,
  StockTypesToLabel,
  WmsStockUser,
  getToken,
} from "../utils";
import { AddStockDetail } from "./AddStockDetail";
import { stockApi } from "../actions";
import { WmsStock } from "@prisma/client";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export function RecordInfo({
  onClose,
  stockId,
}: {
  onClose: () => void;
  stockId: string;
}) {
  const [stock, setStock] = useState<WmsStockUser>(null as any);
  const reload = () =>
    stockApi.stockDetail(stockId, getToken()).then((rtn) => setStock(rtn));

  useEffect(() => {
    reload();
  }, []);

  return (
    <React.Fragment>
      <Dialog open={true} fullScreen TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              查看进货记录
            </Typography>
          
          </Toolbar>
        </AppBar>

        {stock && (
          <>
            {" "}
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  产品: {stock.product?.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  首次入库: {new Date(stock.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2">入库重量: {stock.num}Kg</Typography>
              </CardContent>
            </Card>
            {stock.details.map((item) => (
              <Card
                sx={{ minWidth: 275 }}
                style={{
                  boxShadow: "5px 5px 5px 5px #e2e2e2",
                  border: "3px solid #e2e2e2",
                }}
              >
                <CardContent>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    日期: {new Date(item.created_at).toLocaleString()}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    类型: {StockTypesToLabel(item.type as StockTypes)}
                  </Typography>

                  <Typography variant="body2">重量: {item.num}Kg</Typography>
                  <Typography variant="body2">备注: {item.note}</Typography>
                </CardContent>
                {/* <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions> */}
              </Card>
            ))}
          </>
        )}
        <AddStockDetailSpeedDial
          stock_id={stockId}
          onRefresh={() => reload()}
        ></AddStockDetailSpeedDial>
      </Dialog>
    </React.Fragment>
  );
}

export function AddStockDetailSpeedDial(props: {
  onRefresh: () => void;
  stock_id: string;
}) {
  let [visible, setVisible] = React.useState(false);

  return (
    <>
      {visible && (
        <AddStockDetail
          stock_id={props.stock_id}
          onClose={() => {
            setVisible(false);
            props.onRefresh();
          }}
        ></AddStockDetail>
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
