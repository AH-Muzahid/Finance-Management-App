import React, { StrictMode, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast';

import Root from './Layout/Root';
import PrivateRoute from './Components/PrivateRoute';
import ReportsSkeleton from './Components/ReportsSkeleton';
import MyTransactionSkeleton from './Components/MyTransactionSkeleton';

// Lazy load pages
// Lazy load pages
// Lazy load pages
// Lazy load pages
const Profile = React.lazy(() => import('./Pages/Profile'));
// Eager load Home to avoid double skeleton
import Home from './Pages/Home';
const Login = React.lazy(() => import('./Pages/Login'));
const Registration = React.lazy(() => import('./Pages/Regestration'));
const ForgetPass = React.lazy(() => import('./Components/ForgetPass'));
const UpdateProfile = React.lazy(() => import('./Components/UpdateProfile'));
const AddTransaction = React.lazy(() => import('./Pages/AddTransaction'));
const MyTransaction = React.lazy(() => import('./Pages/MyTransaction'));
const Reports = React.lazy(() => import('./Pages/Reports'));
const TransactionDetails = React.lazy(() => import('./Pages/TransactionDetails'));
const About = React.lazy(() => import('./Pages/About'));
const Contact = React.lazy(() => import('./Pages/Contact'));
const NotFound = React.lazy(() => import('./Pages/NotFound'));

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
          <Suspense fallback={<MyTransactionSkeleton />}>
            <PrivateRoute skeleton={<MyTransactionSkeleton />}>
              <MyTransaction />
            </PrivateRoute>
          </Suspense>
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
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/reports",
        element: (
          <Suspense fallback={<ReportsSkeleton />}>
            <PrivateRoute skeleton={<ReportsSkeleton />}>
              <Reports />
            </PrivateRoute>
          </Suspense>
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
