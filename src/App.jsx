import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppShell from "./layout/AppShell";

import Home from "./pages/Home";
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
        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* PesaRate workspace */}
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