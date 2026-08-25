import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppShell from "./layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Convert from "./pages/Convert";
import Understand from "./pages/Understand";
import Monitor from "./pages/Monitor";
import Save from "./pages/Save";
import Explore from "./pages/Explore";
import CountryDetail from "./pages/CountryDetail";
import Plan from "./pages/Plan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/understand" element={<Understand />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/save" element={<Save />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:code" element={<CountryDetail />} />
          <Route path="/plan" element={<Plan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;