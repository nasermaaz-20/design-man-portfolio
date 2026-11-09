import { useSyncExternalStore } from 'react';

const query = window.matchMedia('(prefers-reduced-motion: reduce)');
const subscribe = (callback) => {
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const snapshot = () => query.matches;

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
