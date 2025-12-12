import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import CreateDoctor from "./pages/CreateDoctor";
import DoctorSchedulePage from "./pages/DoctorSchedulePage";
import Slots from "./pages/Slots";
import Bookings from "./pages/Bookings";

import PublicHome from "./pages/public/PublicHome";
import PublicDoctors from "./pages/public/PublicDoctors";
import PublicDoctorProfile from "./pages/public/PublicDoctorProfile";
import PublicDoctorSlots from "./pages/public/PublicDoctorSlots";
import PublicConfirmBooking from "./pages/public/PublicConfirmBooking";
import PublicBookingSuccess from "./pages/public/PublicBookingSuccess";
import PublicMyBookings from "./pages/public/PublicMyBookings";
import PublicNavbar from "./pages/public/PublicNavbar";

import { Sidebar } from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Login from "./pages/Login";

/* ─────────────────────────────────────────────── */
/*                     THEME                       */
/* ─────────────────────────────────────────────── */

type Theme = "light" | "dark";

export const ThemeContext = createContext({
  theme: "light" as Theme,
  toggleTheme: () => {},
});

const useThemeController = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("wimdoc:theme") as Theme) || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem("wimdoc:theme", theme);
    } catch {}
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
};

/* ─────────────────────────────────────────────── */
/*                      AUTH                       */
/* ─────────────────────────────────────────────── */

type Role = "admin" | "user" | "";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string;
  role: Role;
  username: string | null;
  loading: boolean;
  login: (token: string, role: Role, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: "",
  role: "",
  username: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

const useAuthController = (): AuthContextType => {
  const [token, setToken] = useState(localStorage.getItem("wimdoc:token") || "");
  const [role, setRole] = useState<Role>(
    (localStorage.getItem("wimdoc:role") as Role) || ""
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("wimdoc:username") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (tk: string, rl: Role, uname: string) => {
    setToken(tk);
    setRole(rl);
    setUsername(uname);

    localStorage.setItem("wimdoc:token", tk);
    localStorage.setItem("wimdoc:role", rl);
    localStorage.setItem("wimdoc:username", uname);
  };

  const logout = () => {
    setToken("");
    setRole("");
    setUsername(null);

    localStorage.removeItem("wimdoc:token");
    localStorage.removeItem("wimdoc:role");
    localStorage.removeItem("wimdoc:username");
  };

  return {
    isAuthenticated: !!token,
    token,
    role,
    username,
    loading,
    login,
    logout,
  };
};

/* ─────────────────────────────────────────────── */
/*                 PUBLIC SHELL                    */
/* ─────────────────────────────────────────────── */

function PublicShell() {
  return (
    <>
      <PublicNavbar />
      <div className="public-shell page">
        <Routes>
          <Route index element={<PublicHome />} />
<Route path="public" element={<PublicHome />} />
          <Route path="/public/doctors" element={<PublicDoctors />} />
          <Route path="/public/doctors/:id" element={<PublicDoctorProfile />} />
          <Route path="/public/doctors/:id/slots" element={<PublicDoctorSlots />} />
          <Route path="/public/confirm-booking" element={<PublicConfirmBooking />} />
          <Route path="/public/booking-success" element={<PublicBookingSuccess />} />
          <Route path="/public/my-bookings" element={<PublicMyBookings />} />
          <Route path="*" element={<Navigate to="/public" replace />} />
        </Routes>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────── */
/*                 ADMIN SHELL                     */
/* ─────────────────────────────────────────────── */

function AdminShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Topbar />
        <div className="app-scroll">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/create-doctor" element={<CreateDoctor />} />
            <Route path="/doctors/:id/schedule" element={<DoctorSchedulePage />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function RouterLayer() {
  const location = useLocation();
  const { isAuthenticated, role, loading } = useContext(AuthContext);

  if (loading) return null;

  // NEW: redirect root "/" to /public homepage
  if (location.pathname === "/") {
    return <Navigate to="/public" replace />;
  }

  const isPublic = location.pathname.startsWith("/public");
  const isLogin = location.pathname.startsWith("/login");

  if (isLogin && isAuthenticated) {
    return <Navigate to={role === "admin" ? "/" : "/public"} replace />;
  }

  if (isPublic) return <PublicShell />;

  if (!isAuthenticated || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <AdminShell />;
}


/* ─────────────────────────────────────────────── */
/*                 APP ROOT                        */
/* ─────────────────────────────────────────────── */

export default function AppRoutes() {
  const themeController = useThemeController();
  const authController = useAuthController();

  return (
    <ThemeContext.Provider value={themeController}>
      <AuthContext.Provider value={authController}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<RouterLayer />} />
        </Routes>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}