import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Project from './pages/project';
import About from './pages/about';
import Gallery from './pages/gallery';
import SplashScreen from './components/SplashScreen';

function App() {
  return (
    <>
      {/* Splash Screen dipanggil di luar Router agar menutupi seluruh layar */}
      <SplashScreen />
      
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;