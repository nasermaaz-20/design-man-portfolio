import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];

function boot({ reduced = false, hash = '', seen = false, storageBlocked = false } = {}) {
  const handlers = new Map();
  const events = [];
  const timers = new Map();
  const classes = new Set();
  const saved = new Map(seen ? [['design-man:intro:v1', 'seen']] : []);
  let now = 0, timerId = 0, preferenceChange;
  const elements = {
    'intro-screen': { hidden: true },
    root: { inert: false, innerHTML: '', hasChildNodes: () => false },
    'intro-skip': { addEventListener: (name, fn) => handlers.set(name, fn) },
    'main-content': { focus: () => { document.activeElement = elements['main-content']; } },
  };
  const document = {
    getElementById: (id) => elements[id],
    activeElement: null,
    documentElement: { classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) } },
  };
  const preference = { matches: reduced, addEventListener: (_, fn) => { preferenceChange = fn; } };
  const window = { dispatchEvent: (event) => events.push(event.type) };
  runInNewContext(bootstrap, {
    window, document, location: { hash }, Event,
    matchMedia: () => preference,
    sessionStorage: {
      getItem: (key) => { if (storageBlocked) throw Error('blocked'); return saved.get(key); },
      setItem: (key, value) => { if (storageBlocked) throw Error('blocked'); saved.set(key, value); },
    },
    setTimeout: (fn, delay) => { timers.set(++timerId, { fn, at: now + delay }); return timerId; },
    clearTimeout: (id) => timers.delete(id),
  });
  return {
    intro: window.__designIntro, elements, saved, events, classes,
    skip() { document.activeElement = elements['intro-skip']; handlers.get('click')(); },
    reduce() { preference.matches = true; preferenceChange(); },
    advance(ms) {
      const end = now + ms;
      while (true) {
        const next = [...timers.entries()].filter(([, item]) => item.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at;
        timers.delete(next[0]);
        next[1].fn();
      }
      now = end;
    },
  };
}

test('cold opening releases inert and scrolling within the bounded deadline', () => {
  const state = boot();
  assert.equal(state.elements['intro-screen'].hidden, false);
  assert.equal(state.elements.root.inert, true);
  state.advance(2820);
  assert.equal(state.elements['intro-screen'].hidden, true);
  assert.equal(state.elements.root.inert, false);
  assert.equal(state.classes.has('intro-lock'), false);
  assert.equal(state.saved.get('design-man:intro:v1'), 'seen');
});

test('skip is immediate, idempotent, and preserves an intentional focus destination', () => {
  const state = boot();
  state.skip();
  state.skip();
  state.advance(320);
  assert.equal(state.intro.finished, true);
  assert.equal(state.intro.focusAfterSkip, true);
  assert.equal(state.events.filter((name) => name === 'design:intro-ready').length, 1);
  assert.equal(state.events.filter((name) => name === 'design:intro-exit').length, 1);
});

for (const [name, options] of [['reduced motion', { reduced: true }], ['deep link', { hash: '#work' }], ['repeat visit', { seen: true }]]) {
  test(`${name} bypasses the overlay`, () => {
    const state = boot(options);
    assert.equal(state.elements['intro-screen'].hidden, true);
    assert.equal(state.elements.root.inert, false);
    assert.equal(state.intro.finished, true);
  });
}

test('blocked storage cannot trap the visitor', () => {
  const state = boot({ storageBlocked: true });
  state.advance(2820);
  assert.equal(state.intro.finished, true);
  assert.equal(state.elements.root.inert, false);
});

test('enabling reduced motion during the opening releases it immediately', () => {
  const state = boot();
  state.reduce();
  assert.equal(state.intro.finished, true);
  assert.equal(state.classes.size, 0);
});

test('failed application bootstrap presents a recovery link', () => {
  const state = boot();
  state.advance(8000);
  assert.match(state.elements.root.innerHTML, /Try again/);
  assert.match(state.elements.root.innerHTML, /behance.net/);
  assert.equal(state.elements['intro-screen'].hidden, true);
});

test('mounted application is not replaced by the recovery watchdog', () => {
  const state = boot();
  state.intro.markMounted();
  state.advance(10000);
  assert.equal(state.elements.root.innerHTML, '');
});
