import React from 'react'
import { createBrowserRouter } from 'react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import { Toaster } from 'react-hot-toast';

import Root from './Layout/Root';
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Regestration';
import ForgetPass from './Components/ForgetPass';
import UpdateProfile from './Components/UpdateProfile';
import AddTransaction from './Pages/AddTransaction';
import MyTransaction from './Pages/MyTransaction';
import Reports from './Pages/Reports';
import TransactionDetails from './Pages/TransactionDetails';
import NotFound from './Pages/NotFound';
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
        Component: Registration,
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
      {
        path: "/add-transaction",
        element: (
          <PrivateRoute>
            <AddTransaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-transactions",
        element: (
          <PrivateRoute>
            <MyTransaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/transaction/:id",
        element: (
          <PrivateRoute>
            <TransactionDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
    ]
  },
  {
    path: "*",
    Component: NotFound,
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
  </StrictMode>
)
