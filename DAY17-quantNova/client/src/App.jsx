import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Strategies from "./pages/Strategies.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Capital from "./pages/Capital.jsx";
import Technology from "./pages/Technology.jsx";
import Compliance from "./pages/Compliance.jsx";
import Risk from "./pages/Risk.jsx";
import Positioning from "./pages/Positioning.jsx";
import Contact from "./pages/Contact.jsx";
import VolatilityChart from "./pages/VolatilityChart.jsx";

export default function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/capital" element={<Capital />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/chart" element={<VolatilityChart />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/positioning" element={<Positioning />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
}
