import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { PublicRoute } from './components/auth/PublicRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { GoogleCallbackPage } from './pages/auth/GoogleCallbackPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Events
import { EventsPage } from './pages/events/EventsPage';
import { CreateEventPage } from './pages/events/CreateEventPage';
import { EventDetailsPage } from './pages/events/EventDetailsPage';
import { EditEventPage } from './pages/events/EditEventPage';
import { ManageEventMembersPage } from './pages/events/ManageEventMembersPage';

// Guests
import { ManageGuestsPage } from './pages/guests/ManageGuestsPage';

// Public Pages
import { PublicConfirmationPage } from './pages/public/PublicConfirmationPage';
import { ConfirmChildPage } from './pages/public/ConfirmChildPage';

// Scanner Page
import { CheckInPage } from './pages/scanner/CheckInPage';
import { CheckInListPage } from './pages/scanner/CheckInListPage';

const getRootRedirect = () => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? '/dashboard' : '/login';
};

export const router = createBrowserRouter([
  // Root
  {
    path: '/',
    element: <Navigate to={getRootRedirect()} replace />,
  },

  {
    path: '/:slug/confirmar',
    element: <PublicConfirmationPage />,
  },

  {
    path: '/:slug/confirmar-crianca',
    element: <ConfirmChildPage />,
  },

  // Auth Routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/auth/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/auth/callback',
    element: <GoogleCallbackPage />,
  },
  {
    path: '/auth/google/callback',
    element: <GoogleCallbackPage />,
  },

  // Private Routes
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <PrivateRoute>
        <EventsPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/events/new',
    element: (
      <PrivateRoute>
        <CreateEventPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/events/:id',
    element: (
      <PrivateRoute>
        <EventDetailsPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/events/:id/edit',
    element: (
      <PrivateRoute>
        <EditEventPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/events/:id/members',
    element: (
      <PrivateRoute>
        <ManageEventMembersPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/events/:id/guests',
    element: (
      <PrivateRoute>
        <ManageGuestsPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/events/:id/check-in',
    element: (
      <PrivateRoute>
        <CheckInPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/events/:id/check-in/list',
    element: (
      <PrivateRoute>
        <CheckInListPage />
      </PrivateRoute>
    ),
  },

  // 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Página Não Encontrada
          </h1>
          <p className="text-gray-600">
            A página que você procura não existe.
          </p>
        </div>
      </div>
    ),
  },
]);