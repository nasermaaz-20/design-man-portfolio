import { FiX } from 'react-icons/fi';
import Button from './Button';
import ProjectArt from './ProjectArt';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createScope, createTimeline } from 'animejs';
import { useReducedMotion } from '../../hooks/useMotionPreferences';

export default function ProjectModal({ project, onClose, trigger }) {
  const root = useRef(null);
  const panel = useRef(null);
  const closeButton = useRef(null);
  const [closing, setClosing] = useState(false);
  const reduced = useReducedMotion();
  const requestClose = useCallback(() => setClosing(true), []);

  useEffect(() => {
    const scope = createScope({ root });
    const source = trigger?.querySelector('img');
    const destination = panel.current.querySelector('img');
    const from = source?.getBoundingClientRect();
    const to = destination?.getBoundingClientRect();
    let imageBridge;
    const originalVisibility = destination?.style.visibility ?? '';
    if (!reduced && source?.complete && source.naturalWidth && destination && from?.width && to?.width && from.bottom > 0 && from.top < innerHeight) {
      imageBridge = document.createElement('img');
      imageBridge.src = source.currentSrc || source.src;
      imageBridge.alt = '';
      imageBridge.setAttribute('aria-hidden', 'true');
      imageBridge.className = 'project-image-bridge';
      Object.assign(imageBridge.style, { width: `${to.width}px`, height: `${to.height}px` });
      document.body.appendChild(imageBridge);
      destination.style.visibility = 'hidden';
    }
    scope.add(() => {
      const timeline = createTimeline({ defaults: { ease: 'out(3)' }, onComplete: () => {
        imageBridge?.remove();
        if (destination) destination.style.visibility = originalVisibility;
        if (closing) onClose();
      } })
        .add(root.current, { opacity: closing ? [1, 0] : [0, 1], duration: reduced ? 0 : closing ? 180 : 280 }, 0)
        .add(panel.current, { y: closing ? [0, 12] : [20, 0], scale: closing ? [1, 0.99] : [0.98, 1], duration: reduced ? 0 : closing ? 180 : 350 }, 0);
      if (imageBridge) {
        const initial = closing ? to : from;
        const final = closing ? from : to;
        timeline.add(imageBridge, {
          x: [initial.left, final.left], y: [initial.top, final.top],
          scaleX: [initial.width / to.width, final.width / to.width],
          scaleY: [initial.height / to.height, final.height / to.height],
          duration: closing ? 220 : 350,
        }, 0);
      }
    });
    return () => {
      scope.revert();
      imageBridge?.remove();
      if (destination) destination.style.visibility = originalVisibility;
    };
  }, [closing, reduced, onClose, trigger]);

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
    const keyboard = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); requestClose(); }
      if (event.key !== 'Tab') return;
      const focusable = [...root.current.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('keydown', keyboard);
      // Wait until React removes inert from the page; also safe in StrictMode cleanup.
      requestAnimationFrame(() => {
        if (!document.querySelector('[role="dialog"]') && trigger?.isConnected) trigger.focus({ preventScroll: true });
      });
    };
  }, [requestClose, trigger]);

  const projectLinks = project.links ?? (project.link ? [{ label: 'View Project', href: project.link }] : []);

  return (
    <div ref={root} onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
      <div ref={panel} data-lenis-prevent className="hud-corners relative max-h-[92svh] w-full max-w-5xl overscroll-contain overflow-y-auto border border-neon/25 bg-[#06090d] shadow-cyanLg">
        <button
          type="button"
          ref={closeButton}
          onClick={requestClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center border border-neon/30 bg-black/60 text-neon transition hover:border-neon hover:shadow-cyanSm"
          aria-label="Close project details"
        >
          <FiX />
        </button>
        <div className="grid gap-0 md:grid-cols-[1.1fr_.9fr]">
          <ProjectArt project={project} loading="eager" fetchPriority="high" />
          <div className="p-7 md:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">{project.category}</p>
            <h3 id="project-dialog-title" className="mt-4 font-orbitron text-3xl font-black uppercase text-white md:text-4xl">{project.title}</h3>
            <p className="mt-4 text-lg leading-8 text-steel">{project.summary}</p>
            <div className="mt-7 space-y-5">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-neon">Challenge</h4>
                <p className="mt-2 leading-7 text-white/78">{project.challenge}</p>
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-neon">Solution</h4>
                <p className="mt-2 leading-7 text-white/78">{project.solution}</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.deliverables.map((item) => (
                <span key={item} className="border border-neon/20 bg-neon/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-softCyan">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {projectLinks.map((link, index) => (
                <Button
                  key={`${link.label}-${link.href}`}
                  as="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={index === 0 ? 'primary' : 'secondary'}
                >
                  {link.label}
                </Button>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
