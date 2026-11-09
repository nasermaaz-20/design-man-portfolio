import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useMotionPreferences';

export default function CustomCursor() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const query = matchMedia('(hover: hover) and (pointer: fine)');
    let cursor, frame = 0;
    const move = (event) => {
      if (!cursor) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.classList.toggle('is-interactive', Boolean(event.target.closest?.('a,button')));
        document.documentElement.classList.add('cursor-ready');
      });
    };
    const leave = () => document.documentElement.classList.remove('cursor-ready');
    const update = () => {
      cursor?.remove();
      leave();
      if (!query.matches) { cursor = null; return; }
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cursor);
    };
    update();
    query.addEventListener('change', update);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      cancelAnimationFrame(frame);
      cursor?.remove();
      leave();
      query.removeEventListener('change', update);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
    };
  }, [reduced]);
  return null;
}
