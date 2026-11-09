import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionContext } from './motion/MotionContext';
import LoadingScreen from './components/ui/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProjectModal from './components/ui/ProjectModal';
import ScanLines from './components/background/ScanLines';
import Hero from './sections/Hero';
import SelectedWork from './sections/SelectedWork';
import Portfolio from './sections/Portfolio';
import Services from './sections/Services';
import About from './sections/About';
import Process from './sections/Process';
import Stats from './sections/Stats';
import Testimonials from './sections/Testimonials';
import FinalCTA from './sections/FinalCTA';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const projectTrigger = useRef(null);
  const selectProject = useCallback((project, trigger) => {
    projectTrigger.current = trigger;
    setSelectedProject(project);
  }, []);
  const [introFinished, setIntroFinished] = useState(() => window.__designIntro?.finished ?? true);
  const [motionReady, setMotionReady] = useState(introFinished);
  const startMotion = useCallback(() => setMotionReady(true), []);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  useLenis(!introFinished || Boolean(selectedProject));

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    window.__designIntro?.markMounted();
    const finish = () => { setIntroFinished(true); setMotionReady(true); };
    window.addEventListener('design:intro-ready', finish);
    if (window.__designIntro?.finished) finish();
    return () => window.removeEventListener('design:intro-ready', finish);
  }, []);

  useEffect(() => {
    if (introFinished && window.__designIntro?.focusAfterSkip) {
      window.__designIntro.focusAfterSkip = false;
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  }, [introFinished]);

  return (
    <MotionContext.Provider value={motionReady}>
      <LoadingScreen onReady={startMotion} />
      <CustomCursor />
      <div id="site-content" inert={!introFinished || Boolean(selectedProject)} className="min-h-screen bg-ink text-white">
        <ScanLines />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <SelectedWork onSelectProject={selectProject} />
          <Portfolio />
          <About />
          <Services />
          <Process />
          <Stats />
          <Testimonials />
          <FinalCTA />
        </main>
        <Footer />
      </div>
      {selectedProject && <ProjectModal key={selectedProject.id} project={selectedProject} onClose={closeProject} trigger={projectTrigger.current} />}
    </MotionContext.Provider>
  );
}
