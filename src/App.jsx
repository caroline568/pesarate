import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import AppShell from "./layout/AppShell";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Convert from "./pages/Convert";
import Trips from "./pages/Trips";
import TrendsNews from "./pages/TrendsNews";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";

export default function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/signup" element={<AuthPage mode="signup"/>}/><Route element={<RequireAuth><AppShell/></RequireAuth>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/money" element={<Convert/>}/><Route path="/trips" element={<Trips/>}/><Route path="/trends" element={<TrendsNews/>}/><Route path="/alerts" element={<Alerts/>}/><Route path="/profile" element={<Profile/>}/></Route><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes></BrowserRouter></AuthProvider>}
