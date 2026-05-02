import { useEffect, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProjectModal from './components/ui/ProjectModal';
import ScanLines from './components/background/ScanLines';
import Hero from './sections/Hero';
import SelectedWork from './sections/SelectedWork';
import Services from './sections/Services';
import About from './sections/About';
import Process from './sections/Process';
import Stats from './sections/Stats';
import Testimonials from './sections/Testimonials';
import FinalCTA from './sections/FinalCTA';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  useLenis();

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    let cursor;
    let move;

    if (!isMobile) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);

      move = (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      };

      window.addEventListener('mousemove', move);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      if (!isMobile && cursor) {
        window.removeEventListener('mousemove', move);
        cursor.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-ink text-white">
      <ScanLines />
      <Navbar />
      <main>
        <Hero />
        <SelectedWork onSelectProject={setSelectedProject} />
        <Services />
        <About />
        <Process />
        <Stats />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
