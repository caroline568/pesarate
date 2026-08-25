import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppShell from "./layout/AppShell";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Convert from "./pages/Convert";
import Rates from "./pages/Rates";
import News from "./pages/News";
import Explore from "./pages/Explore";
import CountryDetail from "./pages/CountryDetail";
import Monitor from "./pages/Monitor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* PesaRate workspace */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Money */}
          <Route path="/money" element={<Convert />} />

          {/* Rates + alerts */}
          <Route path="/rates" element={<Rates />} />

          {/* Financial news */}
          <Route path="/news" element={<News />} />

          {/* Explore + context */}
          <Route path="/explore" element={<Explore />} />
          <Route
            path="/explore/:code"
            element={<CountryDetail />}
          />

          {/* Rate monitoring */}
          <Route path="/monitor" element={<Monitor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;