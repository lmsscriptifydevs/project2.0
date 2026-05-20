import "bootstrap/dist/css/bootstrap.css";
// PERF STARTUP: Bootstrap JS deferred to App.js useEffect – no sync script before React.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
import { store } from './redux/store/store';
import reportWebVitals from './reportWebVitals';

// Client ID is public; load from .env (restart dev server after changing .env) or use fallback
const googleClientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  '1088123101819-7jshnrop98cp2o6d3tstq48kdi1h1jsh.apps.googleusercontent.com';

// Prevent [object Object] in error overlay: normalize thrown/rejected values to Error with message
function normalizeError(value) {
  if (value instanceof Error) return value;
  if (value && typeof value === 'object') {
    const msg = value.message || value.error || value.msg || value.statusText || (value.data && (value.data.message || value.data.error)) || JSON.stringify(value);
    return new Error(typeof msg === 'string' ? msg : 'Something went wrong');
  }
  return new Error(String(value));
}
function handleUnhandledRejection(event) {
  const reason = event.reason;
  const is401 = reason?.response?.status === 401;
  if (is401) {
    event.preventDefault();
    return;
  }
  if (reason && typeof reason === 'object' && !(reason instanceof Error)) {
    event.preventDefault();
    const err = normalizeError(reason);
    console.error('Unhandled rejection:', err.message);
  }
}
function handleWindowError(event) {
  if (event.error && typeof event.error === 'object' && !(event.error instanceof Error)) {
    event.preventDefault();
    const err = normalizeError(event.error);
    console.error('Error:', err.message);
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleWindowError);
}

// Create root immediately - don't wait for token validation
const root = ReactDOM.createRoot(document.getElementById('root'));

const app = (
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// Only use Google OAuth provider when client_id is set (avoids "Missing required parameter client_id" error)
root.render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    ) : (
      app
    )}
  </React.StrictMode>
);

// PERF STARTUP: Defer reportWebVitals until after first paint so it never blocks UI
if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(() => reportWebVitals(), { timeout: 2000 });
} else {
  setTimeout(reportWebVitals, 0);
}