import React from 'react'
import { createBrowserRouter } from 'react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import Root from './Layout/Root';
import Profile from './Components/Profile';
import Home from './Pages/Home';
import Login from './Components/Login';
import Regestration from './Components/Regestration';
import ForgetPass from './Components/ForgetPass';
import UpdateProfile from './Components/UpdateProfile';
import PrivateRoute from './Components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Regestration,
      },
      {
        path: "/forgot-password",
        Component: ForgetPass,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-profile",
        element: (
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        ),
      },

    ]}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
