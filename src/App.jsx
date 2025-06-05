import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navigation/Navbar"
import Footer from "./components/navigation/Footer"
import Home from "./pages/Home";
import InformasiWisata from './pages/informasiWisata';
import Reservasi from './pages/Reservasi';
import Galeri from './pages/Galeri';
import Berita from './pages/Berita';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/informasi-wisata" element={<InformasiWisata />} />
        <Route path="/reservasi" element={<Reservasi />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/berita" element={<Berita />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </Router>
  );
}

// Cara render aplikasi (tergantung setup Anda)
// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
export default App; // Atau cara ekspor lain sesuai setup Anda
