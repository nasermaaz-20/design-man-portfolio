import { useEffect } from 'react';
import { animate, createScope, createTimeline } from 'animejs';

// Reuse the early HTML shell: one loader before and after React mounts.
export default function LoadingScreen({ onReady }) {
  useEffect(() => {
    const intro = window.__designIntro;
    const root = document.getElementById('intro-screen');
    if (!intro || intro.finished || !root) {
      onReady();
      return;
    }
    let disposed = false;
    const scope = createScope({ root });
    const done = () => onReady();
    const exit = () => {
      onReady();
      scope.add(() => {
        animate(root.querySelector('.intro-content'), { opacity: 0, y: -12, duration: 170, ease: 'out(3)' });
        animate(root.querySelectorAll('.intro-panel'), {
          scaleY: [1, 0], duration: 300, ease: 'inOut(3)',
          onComplete: () => intro.complete(),
        });
      });
    };
    window.addEventListener('design:intro-ready', done);
    window.addEventListener('design:intro-exit', exit);
    scope.add(() => {
      createTimeline({ defaults: { ease: 'out(3)' } })
        .add('.intro-logo', { opacity: [0, 1], y: [12, 0], duration: 420 }, 0)
        .add('.intro-outline', { strokeDashoffset: [1000, 0], duration: 650 }, 0)
        .add('.intro-label', { opacity: [0, 1], duration: 300 }, 120);
    });
    const image = document.querySelector('[data-hero-image]');
    let imageDone;
    const imageReady = new Promise((resolve) => {
      imageDone = resolve;
      if (!image || image.complete) resolve();
      else {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }
    });
    const fontSheet = document.getElementById('design-fonts');
    let fontsDone;
    const fontsReady = new Promise((resolve) => {
      fontsDone = () => {
        if (!document.fonts) { resolve(); return; }
        Promise.allSettled([document.fonts.load('800 32px "Orbitron"'), document.fonts.load('400 16px "Exo 2"')]).then(resolve);
      };
      if (!fontSheet || fontSheet.media === 'all') fontsDone();
      else {
        fontSheet.addEventListener('load', fontsDone, { once: true });
        fontSheet.addEventListener('error', fontsDone, { once: true });
      }
    });
    Promise.allSettled([imageReady, fontsReady]).then(() => {
      if (!disposed) intro.finish('loaded');
    });
    if (intro.closing) exit();
    return () => {
      disposed = true;
      window.removeEventListener('design:intro-ready', done);
      window.removeEventListener('design:intro-exit', exit);
      image?.removeEventListener('load', imageDone);
      image?.removeEventListener('error', imageDone);
      fontSheet?.removeEventListener('load', fontsDone);
      fontSheet?.removeEventListener('error', fontsDone);
      scope.revert();
    };
  }, [onReady]);
  return null;
}
