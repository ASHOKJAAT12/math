import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PwaManager from './components/common/PwaManager';

import Home from './pages/Home';
import RootFinding from './pages/RootFinding';
import Integration from './pages/Integration';
import Differentiation from './pages/Differentiation';
import Compare from './pages/Compare';
import AdvancedAnalysis from './pages/AdvancedAnalysis';
import History from './pages/History';
const Report = lazy(() => import('./pages/Report'));
const About = lazy(() => import('./pages/About'));
const ExperimentLab = lazy(() => import('./pages/lab/ExperimentLab'));

// Learning Section
const LearnHome = lazy(() => import('./pages/learn/LearnHome'));
const MethodGuide = lazy(() => import('./pages/learn/MethodGuide'));
const VivaPractice = lazy(() => import('./pages/learn/VivaPractice'));
const QuizMode = lazy(() => import('./pages/learn/QuizMode'));
const EducationalArticle = lazy(() => import('./pages/learn/EducationalArticle'));
const WorkedExample = lazy(() => import('./pages/learn/WorkedExample'));

// Present Section
const PresentationHome = lazy(() => import('./pages/present/PresentationHome'));
const PresentationViewer = lazy(() => import('./pages/present/PresentationViewer'));

import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      {/* Global PWA Service Worker UI implicitly smartly thoughtfully gracefully quietly optimally neatly firmly safely smoothly identical naturally natively */}
      <PwaManager />
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
          <Navbar />
          <main className="flex-grow pt-16">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/root-finding" element={<RootFinding />} />
                <Route path="/integration" element={<Integration />} />
                <Route path="/differentiation" element={<Differentiation />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/advanced-analysis" element={<AdvancedAnalysis />} />
                <Route path="/history" element={<History />} />
                <Route path="/report/:id" element={<Report />} />
                <Route path="/about" element={<About />} />
                <Route path="/lab" element={<ExperimentLab />} />

                {/* Learning Section Routes */}
                <Route path="/learn" element={<LearnHome />} />
                <Route path="/learn/method/:methodId" element={<MethodGuide />} />
                <Route path="/learn/example/:methodId" element={<WorkedExample />} />
                <Route path="/learn/viva" element={<VivaPractice />} />
                <Route path="/learn/quiz" element={<QuizMode />} />
                <Route path="/learn/article/:topic" element={<EducationalArticle />} />

                {/* Presentation Routes */}
                <Route path="/present" element={<PresentationHome />} />
                <Route path="/present/viewer" element={<PresentationViewer />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
