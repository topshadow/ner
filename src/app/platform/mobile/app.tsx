import * as React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Login } from "./passport/Login";
// import { Home } from './pages/Home';
// import { UserCenter } from './pages/UserCenter';
import { SnackbarProvider } from "notistack";
import Home from "./pages/Home";
import { UserCenter } from "./pages/UserCenter";
// import Box from '@mui/material/Box';
const router = createHashRouter([
  { path: "/passport/login", element: <Login></Login> },
    { path: '/', element: <Home></Home> },
    {path:'/user-center',element:<UserCenter></UserCenter>}
]);

export default function App() {
  React.useEffect(() => {
    location.hash = "#/passport/login";
  });
  return (
    <SnackbarProvider maxSnack={3}>
      {" "}
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
}
