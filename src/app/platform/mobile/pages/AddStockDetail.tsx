'use client'
import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { StockTypes, StockTypesToLabel, getToken } from "../utils";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "notistack";
import type { WmsStock } from "@prisma/client";
import { passportApi, productApi, stockApi } from "../actions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export function AddStockDetail({
  onClose,
  stock_id,
}: {
  onClose: () => void;
  stock_id: string;
}) {
  const [open, setOpen] = React.useState(true);
  const [num, setNum] = React.useState(0);

  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [productId, setProductId] = React.useState("");
  const [type, setType] = React.useState(StockTypes.OriginWeight);
  const submit = () => {
    stockApi
      .addStockDetail({ num:Number.parseInt(num), note, type, stock_id }, getToken())
      .then(() => onClose());
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={() => onClose()}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => onClose()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              新增称重记录
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={onClose}>
              提交
            </Button>
             */}
          </Toolbar>
        </AppBar>
        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <TextField
            id="filled-basic"
            type="number"
            label="出货重量(kg)"
            defaultValue={num}
            onChange={(e) => setNum(e.target.value as any)}
            variant="filled"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">入库类型</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="入库类型"
            onChange={(e) => {
              console.log(e);
              setType(e.target.value as StockTypes);
            }}
          >
            <MenuItem value={StockTypes.OriginWeight}>
              {StockTypesToLabel(StockTypes.OriginWeight)}
            </MenuItem>
            <MenuItem value={StockTypes.OutCarWeight}>
              {StockTypesToLabel(StockTypes.OutCarWeight)}
            </MenuItem>
            <MenuItem value={StockTypes.OutContainerWeight}>
              {StockTypesToLabel(StockTypes.OutContainerWeight)}
            </MenuItem>
            <MenuItem value={StockTypes.OutFixedWeight}>
              {StockTypesToLabel(StockTypes.OutFixedWeight)}
            </MenuItem>
            <MenuItem value={StockTypes.LastWeight}>
              {StockTypesToLabel(StockTypes.LastWeight)}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="filled-multiline-static"
            label="备注"
            multiline
            rows={4}
            defaultValue={note}
            onChange={(e) => setNote(e.target.value)}
            variant="filled"
          />
        </FormControl>
        <Button
          fullWidth
          style={{ position: "fixed", bottom: "30px" }}
          variant="contained"
          onClick={() => submit()}
        >
          提交
        </Button>
      </Dialog>
    </>
  );
}
