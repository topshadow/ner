'use client'
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { StockTypes, StockTypesToLabel, getToken } from "../utils";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { productApi, stockApi } from "../actions";
import type { WmsProduct } from "@prisma/client";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props: { onClose: () => void }) {
  const [open, setOpen] = React.useState(true);
  const [num, setNum] = React.useState(0);
  const [products, setProducts] = React.useState([] as WmsProduct[]);
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [productId, setProductId] = React.useState("");
  const [type, setType] = React.useState(StockTypes.OriginWeight);
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };
  const submit = () => {
    setLoading(true);
    stockApi
      .createUserStock({ type, num:Number.parseInt(num), note, product_id: productId }, getToken())
      .then((res) => {
        if (res.ok) {
          if (res.msg) {
            snackbar.enqueueSnackbar({
              message: res.msg,
              variant: "success",
              anchorOrigin: { vertical: "top", horizontal: "center" },
              autoHideDuration: 3000,
            });
          }
          handleClose();
        } else {
          snackbar.enqueueSnackbar({
            message: res.msg,
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
            autoHideDuration: 3000,
          });
        }
      });
  };

  React.useEffect(() => {
    productApi.listProduct(getToken()).then((res) => {
      setProducts(res);
    });
  }, []);

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              新增进货记录
            </Typography>
        
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
        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel id="demo-simple-select-label">产品种类</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={productId}
            label="产品种类"
            onChange={(e) => {
              console.log(e);
              setProductId(e.target.value);
            }}
          >
            {products.map((p) => (
              <MenuItem value={p.id} key={p.id}> {p.name}</MenuItem>
            ))}
          </Select>
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
              setType(e.target.value as any);
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
          disabled={loading}
          variant={"contained"}
          style={{ position: "fixed", bottom: "30px" }}
          onClick={() => submit()}
        >
          提交
        </Button>
      </Dialog>
    </React.Fragment>
  );
}
