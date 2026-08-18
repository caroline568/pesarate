import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CalculatorPage from "./pages/CalculatorPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <nav className="flex gap-6 px-6 py-4 bg-slate-900 text-white">
          <Link to="/" className="font-semibold hover:text-emerald-400">Home</Link>
          <Link to="/calculator" className="font-semibold hover:text-emerald-400">Calculator</Link>
        </nav>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<CalculatorPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;