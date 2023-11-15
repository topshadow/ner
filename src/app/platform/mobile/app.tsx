"use client";
import * as React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Login } from "./passport/Login";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Home } from './pages/Home';
// import { UserCenter } from './pages/UserCenter';
import { SnackbarProvider } from "notistack";
import Home from "./pages/Home";
import { UserCenter } from "./pages/UserCenter";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import 'dayjs/locale/zh-cn';

// import Box from '@mui/material/Box';
const router = createHashRouter([
  { path: "/passport/login", element: <Login></Login> },
  { path: "/", element: <Home></Home> },
  { path: "/user-center", element: <UserCenter></UserCenter> },
]);

export default function App() {
  React.useEffect(() => {
    location.hash = "#/passport/login";
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <SnackbarProvider maxSnack={3}>


        <RouterProvider router={router} />
      </SnackbarProvider>
    </LocalizationProvider>
  );
}
