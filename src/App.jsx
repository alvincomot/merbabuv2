import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InformasiWisata from './pages/informasiWisata';
import Reservasi from './pages/Reservasi';
import Galeri from './pages/Galeri';
import Berita from './pages/Berita';
import NewsDetail from './pages/DetailBerita';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import { getMe } from './features/auth/authSlice';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/informasi-wisata" element={<InformasiWisata />} />
        <Route path="/reservasi" element={<Reservasi />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
export default App;
