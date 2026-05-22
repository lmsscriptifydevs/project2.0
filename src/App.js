import { Component, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import { validateToken } from './redux/slices/userSlice';
import AppRoutes from './routes';
import Chatbot from './components/Chatbot'; 

// Catches render errors and normalizes [object Object] to a readable message
class AppErrorBoundary extends Component {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error) {
    const msg = error instanceof Error
      ? error.message
      : (error && typeof error === 'object')
        ? (error.message || error.error || error.msg || JSON.stringify(error))
        : String(error);
    return { hasError: true, message: msg || 'Something went wrong' };
  }

  componentDidCatch(error, info) {
    console.error('AppErrorBoundary:', error, info);
    
    // Auto-reload on chunk load errors (usually due to new deployments)
    if (
      error?.message?.includes('Loading chunk') || 
      error?.name === 'ChunkLoadError'
    ) {
      const isReloaded = sessionStorage.getItem('chunk_reloaded');
      if (!isReloaded) {
        sessionStorage.setItem('chunk_reloaded', 'true');
        window.location.reload();
      }
    }
  }

  render() {
    // Clear chunk_reloaded flag on successful mount/render
    if (!this.state.hasError) {
      sessionStorage.removeItem('chunk_reloaded');
    }

    if (this.state.hasError) {
      return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <h1 className="display-6 text-danger">Something went wrong</h1>
            <p className="lead text-muted">{this.state.message}</p>
            <button className="btn btn-primary mt-3" onClick={() => this.setState({ hasError: false, message: '' })}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // PERF STARTUP: Defer Bootstrap JS until after first paint. No sync script blocks React mount.
  useEffect(() => {
    const loadBootstrap = () => {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').catch(() => {});
    };
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(loadBootstrap, { timeout: 500 });
    } else {
      setTimeout(loadBootstrap, 0);
    }
  }, []);

  // PERF STARTUP: Defer token validation until after first paint
  useEffect(() => {
    if (location.pathname === '/auth/callback') return;

    const checkAndValidate = () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const deferValidation = () => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              dispatch(validateToken()).catch((err) => console.error('Token validation error:', err));
            }, { timeout: 1000 });
          } else {
            setTimeout(() => {
              dispatch(validateToken()).catch((err) => console.error('Token validation error:', err));
            }, 0);
          }
        };
        deferValidation();
      } catch (error) {
        // Silently fail - don't block UI
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(checkAndValidate, { timeout: 0 });
    } else {
      setTimeout(checkAndValidate, 0);
    }
  }, [dispatch, location.pathname]);

  const showChatbot = !['inbox', 'chat'].some(keyword => 
    location.pathname.toLowerCase().includes(keyword)
  );

  return (
    <AppErrorBoundary>
      <ScrollToTop />
      <AppRoutes />

      {/* 🤖 Chatbot Component (Hidden on Inbox & Chat pages) */}
      {showChatbot && <Chatbot />}

    </AppErrorBoundary>
  );
}

export default App;