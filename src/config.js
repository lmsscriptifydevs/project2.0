// Local backend: set REACT_APP_HOST_API=http://127.0.0.1:8000/api/ in .env so Gig States etc work
const LOCAL_API = "https://portal.grapetask.co/api/";
// Live backend server
export const HOST_API = "https://portal.grapetask.co/api/";

  //  export const PUSHER_HOST ="http://localhost:8000/broadcasting/auth";

//old server
// export const HOST_API="https://grapetask.cs24ryk.com/api/";



// new server (use local API if REACT_APP_HOST_API is set for gig-stats etc)
// export const HOST_API = LOCAL_API || "https://portal.grapetask.co/api/";

// Base URL of Laravel backend (no /api). For Google OAuth server-side redirect use this + /auth/google
// Local: set REACT_APP_BACKEND_URL=http://localhost:8000 in .env
 export const BACKEND_BASE = "https://portal.grapetask.co";

 export const PUSHER_HOST = "https://portal.grapetask.co/broadcasting/auth";