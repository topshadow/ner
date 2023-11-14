import * as React from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Login } from './passport/Login';
// import { Home } from './pages/Home';
// import { UserCenter } from './pages/UserCenter';
import { SnackbarProvider } from 'notistack';
// import Box from '@mui/material/Box';
location.hash='#';
const router = createHashRouter([
  { path: '/passport/login', element: <Login></Login> },
//   { path: '/', element: <Home></Home> },
//   {path:'/user-center',element:<UserCenter></UserCenter>}
]);


export default function App() {
  return <SnackbarProvider  maxSnack={3}> <RouterProvider router={router} /></SnackbarProvider>

}