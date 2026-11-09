import { useEffect, useRef } from 'react';
import { animate, createScope, utils } from 'animejs';
import { useReducedMotion } from './useMotionPreferences';
import { useIntroReady } from '../motion/MotionContext';
import { motion } from '../motion/config';

// Observe small pieces, not an entire section taller than the viewport.
export function useScrollAnimation(threshold = 0.12) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const ready = useIntroReady();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || !ready) return;
    const nodes = [...root.querySelectorAll('[data-reveal]')];
    const targets = nodes.length ? nodes : [root];
    // A fully clipped element has no intersection. Observe its stable frame instead.
    const observed = new Map();
    targets.forEach((el) => {
      const frame = el.dataset.reveal === 'image' ? el.parentElement : el;
      observed.set(frame, [...(observed.get(frame) || []), el]);
    });
    let observer;
    const scope = createScope({ root });
    try {
      scope.add(() => {
        targets.forEach((el) => {
          if (el.dataset.revealed === 'true' || el.getBoundingClientRect().bottom < 0) return;
          utils.set(el, el.dataset.reveal === 'image'
            ? { clipPath: 'inset(0 0 100% 0)' }
            : el.dataset.reveal === 'line' ? { scaleX: 0 }
            : { opacity: 0, y: motion.distance });
        });
      });
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target: frame, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(frame);
          observed.get(frame).forEach((target) => {
          if (target.dataset.revealed === 'true') return;
          target.dataset.revealed = 'true';
          scope.add(() => {
            const image = target.dataset.reveal === 'image';
            animate(target, {
              ...(image ? { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] } : target.dataset.reveal === 'line' ? { scaleX: [0, 1] } : { opacity: [0, 1], y: [motion.distance, 0] }),
              duration: image ? 650 : motion.enter,
              delay: Math.min(Number(target.dataset.delay) || 0, 240),
              ease: motion.ease,
            });
          });
          });
        });
      }, { threshold: Math.min(threshold, 0.15), rootMargin: '0px 0px -24px 0px' });
      observed.forEach((_, frame) => observer.observe(frame));
    } catch {
      observer?.disconnect();
      scope.revert();
    }
    return () => {
      observer?.disconnect();
      scope.revert();
    };
  }, [threshold, reduced, ready]);
  return ref;
}

