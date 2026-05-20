import { createBrowserRouter } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
// import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //
// Option A: Simple fallback value
const baseName = (import.meta.env && import.meta.env.VITE_APP_BASE_NAME) || '/';

const router = createBrowserRouter([MainRoutes], { basename: baseName });

export default router;


