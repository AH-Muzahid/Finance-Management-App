import React, { StrictMode, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast';

import Root from './Layout/Root';
import DashboardLayout from './Layout/DashboardLayout';
import PrivateRoute from './Components/PrivateRoute';
import ReportsSkeleton from './Components/ReportsSkeleton';
import MyTransactionSkeleton from './Components/MyTransactionSkeleton';

// Lazy load pages
const Profile = React.lazy(() => import('./Pages/Profile'));
// Eager load Home to avoid double skeleton
import Home from './Pages/Home';
const DashboardHome = React.lazy(() => import('./Pages/DashboardHome')); // Import DashboardHome
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
const Privacy = React.lazy(() => import('./Pages/Privacy'));
const Terms = React.lazy(() => import('./Pages/Terms'));
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
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/privacy",
        Component: Privacy,
      },
      {
        path: "/terms",
        Component: Terms,
      },
    ]
  },
  // Dashboard routes with sidebar
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome // Set DashboardHome as index
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "update-profile",
        Component: UpdateProfile,
      },
      {
        path: "add-transaction",
        Component: AddTransaction,
      },
      {
        path: "my-transactions",
        element: (
          <Suspense fallback={<MyTransactionSkeleton />}>
            <MyTransaction />
          </Suspense>
        ),
      },
      {
        path: "transaction/:id",
        Component: TransactionDetails,
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<ReportsSkeleton />}>
            <Reports />
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

import { ThemeProvider } from 'next-themes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </ThemeProvider>
  </StrictMode>
)
