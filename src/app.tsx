import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Project from './pages/project';
import About from './pages/about';
import Gallery from './pages/gallery';
import Admin from './pages/admin'; // 👈 KITA IMPORT HALAMAN ADMIN
import SplashScreen from './components/SplashScreen';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <>
      <CustomCursor />
      <SplashScreen />
      
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* 👇 KITA DAFTARKAN JALUR /admin DI SINI */}
          <Route path="/admin" element={<Admin />} /> 
        </Routes>
      </Router>
    </>
  );
}

export default App;