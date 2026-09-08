import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import RootFinding from './pages/RootFinding';
import Integration from './pages/Integration';
import Differentiation from './pages/Differentiation';
import Compare from './pages/Compare';
import History from './pages/History';
import Report from './pages/Report';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/root-finding" element={<RootFinding />} />
              <Route path="/integration" element={<Integration />} />
              <Route path="/differentiation" element={<Differentiation />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/history" element={<History />} />
              <Route path="/report/:id" element={<Report />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
