import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppShell from "./layout/AppShell";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Convert from "./pages/Convert";
import TravelMoney from "./pages/TravelMoney";
import Rates from "./pages/Rates";
import Monitor from "./pages/Monitor";
import Explore from "./pages/Explore";
import CountryDetail from "./pages/CountryDetail";
import News from "./pages/News";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/money" element={<Convert />} />
            <Route path="/travel" element={<TravelMoney />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:code" element={<CountryDetail />} />
            <Route path="/news" element={<News />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
