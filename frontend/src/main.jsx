import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { SocketProvider } from './context/SocketContext';
import './index.css';

const publishablekey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: '#c9a84c',
    colorText: '#e8dcc8',
    colorTextSecondary: 'rgba(232, 220, 200, 0.6)',
    colorBackground: '#2c1f14',
    colorInputBackground: '#1a1410',
    colorInputText: '#e8dcc8',
    colorDanger: '#e57373',
    fontFamily: '"EB Garamond", Garamond, serif',
    fontFamilyButtons: '"EB Garamond", Garamond, serif',
    borderRadius: '0.5rem',
    colorNeutral: 'rgba(232, 220, 200, 0.5)',
  },
  elements: {
    card: {
      backgroundColor: '#2c1f14',
      border: '1px solid rgba(201, 168, 76, 0.25)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(201, 168, 76, 0.06)',
      borderRadius: '0.75rem',
    },
    headerTitle: {
      fontFamily: '"Playfair Display", Lora, Georgia, serif',
      color: '#e8dcc8',
      fontSize: '1.5rem',
      fontWeight: '600',
    },
    headerSubtitle: {
      color: 'rgba(232, 220, 200, 0.5)',
      fontFamily: '"EB Garamond", Garamond, serif',
    },
    formFieldLabel: {
      color: 'rgba(232, 220, 200, 0.5)',
      textTransform: 'uppercase',
      fontSize: '0.7rem',
      letterSpacing: '0.1em',
      fontWeight: '500',
    },
    formFieldInput: {
      backgroundColor: '#1a1410',
      border: '1px solid rgba(201, 168, 76, 0.3)',
      color: '#e8dcc8',
      borderRadius: '0.375rem',
      '&:focus': {
        borderColor: '#c9a84c',
        boxShadow: '0 0 0 2px rgba(201, 168, 76, 0.15)',
      },
    },
    formButtonPrimary: {
      backgroundColor: '#c9a84c',
      color: '#1a1410',
      fontFamily: '"Playfair Display", Lora, Georgia, serif',
      fontWeight: '600',
      letterSpacing: '0.02em',
      '&:hover': {
        backgroundColor: '#a07830',
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: '#1a1410',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      color: '#e8dcc8',
      '&:hover': {
        backgroundColor: 'rgba(201, 168, 76, 0.1)',
        borderColor: 'rgba(201, 168, 76, 0.4)',
      },
    },
    socialButtonsBlockButtonText: {
      color: '#e8dcc8',
      fontWeight: '400',
    },
    dividerLine: {
      background: 'rgba(201, 168, 76, 0.2)',
    },
    dividerText: {
      color: 'rgba(232, 220, 200, 0.4)',
    },
    footerActionLink: {
      color: '#c9a84c',
      '&:hover': {
        color: '#a07830',
      },
    },
    footerActionText: {
      color: 'rgba(232, 220, 200, 0.4)',
    },
    identityPreviewEditButton: {
      color: '#c9a84c',
    },
    formFieldAction: {
      color: '#c9a84c',
    },
    otpCodeFieldInput: {
      backgroundColor: '#1a1410',
      border: '1px solid rgba(201, 168, 76, 0.3)',
      color: '#e8dcc8',
    },
    alert: {
      backgroundColor: 'rgba(201, 168, 76, 0.08)',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      color: '#e8dcc8',
    },
    avatarBox: {
      border: '2px solid rgba(201, 168, 76, 0.4)',
    },
    badge: {
      backgroundColor: 'rgba(201, 168, 76, 0.15)',
      color: '#c9a84c',
    },
    userButtonPopoverCard: {
      backgroundColor: '#2c1f14',
      border: '1px solid rgba(201, 168, 76, 0.25)',
    },
    userButtonPopoverActionButton: {
      '&:hover': {
        backgroundColor: 'rgba(201, 168, 76, 0.08)',
      },
    },
    userButtonPopoverActionButtonText: {
      color: '#e8dcc8',
    },
    userButtonPopoverActionButtonIcon: {
      color: 'rgba(232, 220, 200, 0.6)',
    },
    userButtonPopoverFooter: {
      borderTop: '1px solid rgba(201, 168, 76, 0.15)',
    },
    menuButton: {
      color: '#e8dcc8',
      '&:hover': {
        backgroundColor: 'rgba(201, 168, 76, 0.08)',
      },
    },
    menuList: {
      backgroundColor: '#2c1f14',
      border: '1px solid rgba(201, 168, 76, 0.25)',
    },
    menuItem: {
      color: '#e8dcc8',
      '&:hover': {
        backgroundColor: 'rgba(201, 168, 76, 0.1)',
      },
    },
    profileSectionPrimaryButton: {
      color: '#c9a84c',
    },
    navbarButton: {
      color: '#e8dcc8',
      '&:hover': {
        backgroundColor: 'rgba(201, 168, 76, 0.08)',
      },
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={publishablekey} appearance={clerkAppearance}>
        <SocketProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#2c1f14',
                color: '#e8dcc8',
                border: '1px solid #c9a84c',
                fontFamily: '"EB Garamond", serif',
              },
            }}
          />
        </SocketProvider>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
