import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './useMotionPreferences';

export function useLenis(locked = false) {
  const reduced = useReducedMotion();
  const instance = useRef(null);
  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      anchors: true,
      prevent: (node) => node.closest?.('[data-lenis-prevent]'),
    });
    instance.current = lenis;
    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      instance.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    if (locked) instance.current?.stop();
    else instance.current?.start();
    if (!locked) return;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [locked, reduced]);
}
