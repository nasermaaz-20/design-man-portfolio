import { useEffect, useRef, useState } from 'react';

export default function PdfPage({ document, engine, number, width }) {
  const canvasHost = useRef(null);
  const textHost = useRef(null);
  const [status, setStatus] = useState('loading');
  const [links, setLinks] = useState([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus('loading');
    setLinks([]);
    if (!width) return;
    let cancelled = false;
    let renderTask;
    let textLayer;
    // A fresh canvas prevents a cancelled render from sharing the next render's surface.
    const canvas = window.document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const canvasContainer = canvasHost.current;
    const textContainer = textHost.current;
    canvasContainer.replaceChildren(canvas);
    textContainer.replaceChildren();

    async function render() {
      try {
        const page = await document.getPage(number);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
        const density = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(16000000 / (viewport.width * viewport.height)));
        canvas.width = Math.ceil(viewport.width * density);
        canvas.height = Math.ceil(viewport.height * density);
        renderTask = page.render({
          canvasContext: canvas.getContext('2d'), viewport,
          transform: density === 1 ? null : [density, 0, 0, density, 0, 0],
        });
        await renderTask.promise;
        if (cancelled) return;
        textContainer.style.setProperty('--total-scale-factor', viewport.scale);
        textLayer = new engine.TextLayer({
          textContentSource: page.streamTextContent(), container: textContainer, viewport,
        });
        await textLayer.render();
        const annotations = await page.getAnnotations({ intent: 'display' });
        if (cancelled) return;
        setLinks(annotations.filter((item) => item.subtype === 'Link' && /^(https?:|mailto:|tel:)/i.test(item.url || '')).map((item) => {
          const rect = [...viewport.convertToViewportPoint(item.rect[0], item.rect[1]), ...viewport.convertToViewportPoint(item.rect[2], item.rect[3])];
          return {
            id: item.id, url: item.url,
            style: { left: Math.min(rect[0], rect[2]), top: Math.min(rect[1], rect[3]), width: Math.abs(rect[2] - rect[0]), height: Math.abs(rect[3] - rect[1]) },
          };
        }));
        setStatus('ready');
      } catch (error) {
        if (!cancelled && error.name !== 'RenderingCancelledException' && error.name !== 'AbortException') setStatus('error');
      }
    }
    render();
    return () => {
      cancelled = true;
      renderTask?.cancel();
      textLayer?.cancel();
      canvasContainer.replaceChildren();
      textContainer.replaceChildren();
      canvas.width = canvas.height = 1;
    };
  }, [document, engine, number, width, attempt]);

  return (
    <article id={`pdf-page-${number}`} data-page={number} className="pdf-page" aria-label={`Page ${number}`} style={{ width }}>
      <div className="pdf-paper" data-status={status}>
        {status !== 'ready' && <div className="pdf-placeholder">
          {status === 'error' ? <><p>This page could not be displayed.</p><button onClick={() => setAttempt((value) => value + 1)}>Retry page {number}</button></> : <span>Page {number}</span>}
        </div>}
        <div ref={canvasHost} className="pdf-canvas" />
        <div ref={textHost} className="textLayer" />
        <div className="pdf-links">{links.map((link) => <a key={link.id} href={link.url} style={link.style} target="_blank" rel="noopener noreferrer" aria-label={`Open ${link.url}`} />)}</div>
      </div>
    </article>
  );
}
