import { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiArrowUpRight, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize, FiMinus, FiPlus, FiRefreshCw } from 'react-icons/fi';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { portfolio } from '../data/portfolio';
import PdfPage from '../components/portfolio/PdfPage';

function pageFromHash() {
  return Math.max(1, Math.min(portfolio.pages, Number(location.hash.match(/page=(\d+)/)?.[1]) || 1));
}

export default function PortfolioViewer() {
  const scrollRoot = useRef(null);
  const root = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [current, setCurrent] = useState(pageFromHash);
  const [pageInput, setPageInput] = useState(String(current));
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const count = loaded?.document.numPages || portfolio.pages;
  const padding = stageSize.width <= 767 ? 24 : 64;
  // Fit the entire landscape page below the controls, then apply the visitor's zoom.
  const fittedWidth = Math.max(1, Math.min(1200, stageSize.width - padding, (stageSize.height - padding) * portfolio.width / portfolio.height));
  const width = Math.max(1, Math.floor(fittedWidth * zoom));

  useEffect(() => {
    const resize = new ResizeObserver(() => {
      const bounds = scrollRoot.current.getBoundingClientRect();
      setStageSize({ width: bounds.width, height: bounds.height });
    });
    resize.observe(scrollRoot.current);
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      resize.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let task;
    setLoaded(null);
    setError(false);
    setProgress(0);
    async function load() {
      try {
        const engine = await import('pdfjs-dist/build/pdf.mjs');
        if (cancelled) return;
        engine.GlobalWorkerOptions.workerSrc = workerUrl;
        task = engine.getDocument({ url: portfolio.url, isEvalSupported: false, useWasm: false });
        task.onProgress = ({ loaded: bytes, total }) => {
          if (!cancelled && total > 0) setProgress(Math.min(100, Math.round(bytes / total * 100)));
        };
        const pdf = await task.promise;
        if (!cancelled) setLoaded({ document: pdf, engine });
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => { cancelled = true; task?.destroy().catch(() => {}); };
  }, [attempt]);

  const navigate = useCallback((value) => {
    const next = Math.max(1, Math.min(count, Number(value) || 1));
    setCurrent(next);
    scrollRoot.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [count]);

  useEffect(() => {
    if (zoom <= 1) scrollRoot.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [zoom]);

  useEffect(() => {
    setPageInput(String(current));
    history.replaceState(null, '', `#page=${current}`);
  }, [current]);

  useEffect(() => {
    const onHash = () => navigate(pageFromHash());
    const onKey = (event) => {
      if (event.target.closest('input, textarea, [contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey) return;
      let target;
      if (event.key === 'ArrowRight') target = current + 1;
      if (event.key === 'ArrowLeft') target = current - 1;
      if (event.key === 'Home') target = 1;
      if (event.key === 'End') target = count;
      if (target !== undefined) { event.preventDefault(); navigate(target); }
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('keydown', onKey); };
  }, [current, count, navigate]);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current.requestFullscreen();
    } catch { /* Open PDF remains available when a browser denies fullscreen. */ }
  }

  return (
    <div ref={root} className="portfolio-viewer">
      <header className="viewer-header">
        <a href={portfolio.home} className="viewer-back"><FiArrowLeft aria-hidden="true" /><span>Back to work</span></a>
        <div className="viewer-title"><h1>Portfolio <span>2026</span></h1><p>Yaman Balkesh <span>· {portfolio.size}</span></p></div>
        <a className="viewer-original" href={portfolio.url} target="_blank" rel="noopener noreferrer">Open PDF <FiArrowUpRight aria-hidden="true" /></a>
      </header>
      <nav className="viewer-toolbar" aria-label="Document controls">
        <div className="viewer-pagination">
          <button aria-label="Previous page" title="Previous page" disabled={!loaded || current === 1} onClick={() => navigate(current - 1)}><FiChevronLeft /></button>
          <form onSubmit={(event) => { event.preventDefault(); navigate(Math.round(Number(pageInput))); }}>
            <label className="sr-only" htmlFor="page-number">Page number</label>
            <input id="page-number" type="number" min="1" max={count} inputMode="numeric" value={pageInput} disabled={!loaded} onChange={(event) => setPageInput(event.target.value)} onBlur={() => setPageInput(String(current))} />
            <span aria-hidden="true">/ {count}</span>
          </form>
          <button aria-label="Next page" title="Next page" disabled={!loaded || current === count} onClick={() => navigate(current + 1)}><FiChevronRight /></button>
        </div>
        <div className="viewer-zoom">
          <button aria-label="Zoom out" title="Zoom out" disabled={!loaded || zoom <= 0.75} onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))}><FiMinus /></button>
          <output aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
          <button aria-label="Zoom in" title="Zoom in" disabled={!loaded || zoom >= 2.5} onClick={() => setZoom((value) => Math.min(2.5, value + 0.25))}><FiPlus /></button>
          <button className="viewer-fit" disabled={!loaded} onClick={() => setZoom(1)}>Fit page</button>
        </div>
        {document.fullscreenEnabled && <button className="viewer-fullscreen" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>{fullscreen ? <FiMinimize /> : <FiMaximize />}</button>}
      </nav>
      <main ref={scrollRoot} className="viewer-stage" aria-label="Portfolio pages" tabIndex="0">
        {!loaded && <div className="viewer-loading">
          <img src={portfolio.cover} width="1440" height="810" alt="Yaman Balkesh portfolio cover" />
          {error ? <div role="alert"><h2>The portfolio couldn’t be opened.</h2><p>Please try again, or use “Open PDF” above.</p><button className="viewer-retry" onClick={() => setAttempt((value) => value + 1)}><FiRefreshCw aria-hidden="true" /> Try again</button></div> : <div role="status"><p>Opening the portfolio… <span>{progress > 0 ? `${progress}%` : ''}</span></p><progress max="100" value={progress} aria-label="Loading portfolio" /></div>}
        </div>}
        {loaded && stageSize.width > 0 && <div className="viewer-pages" style={{ minWidth: width + padding }}>
          <PdfPage key={current} document={loaded.document} engine={loaded.engine} number={current} width={width} />
        </div>}
      </main>
      <footer className="viewer-footer"><span aria-live="polite">{loaded ? `Page ${current} of ${count}` : error ? 'Document unavailable' : 'Loading document'}</span><span>Use the arrows to browse</span></footer>
    </div>
  );
}
