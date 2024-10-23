import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Publications from './pages/Publications';
import Projects from './pages/Projects';
import CV from './pages/CV';
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

function App() {
  const isMobile = useIsMobile();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isMobile={isMobile} />} />
        <Route path="/about" element={<About isMobile={isMobile} />} />
        <Route path="/projects" element={<Projects isMobile={isMobile} />} />
        <Route path="/publications" element={<Publications isMobile={isMobile} />} />
        <Route path="/cv" element={<CV isMobile={isMobile} />} />
      </Routes>
    </Router>
  );
}

export default App;
