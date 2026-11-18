"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { track } from "./insights";

/*
 * Click-to-expand for the book's illustrations. The enlarged copy grows out of the exact spot
 * the illustration occupies on the page and shrinks back into it on close (a FLIP animation:
 * lay out at the final size, then animate a transform from the source rectangle to it).
 */

const SELECTOR = ".book-content figure, .book-content .coverart";
const OPEN_MS = 460;
const CLOSE_MS = 340;
const EASE = "cubic-bezier(0.2, 0.85, 0.25, 1)";

type Open = {
  source: HTMLElement; // the figure on the page
  svgHtml: string;
  captionHtml: string | null;
  label: string;
  aspect: number; // width / height of the illustration
};

// Copy the illustration for the viewer. Some SVGs use arrowhead <marker>s defined in another
// illustration, so copy any borrowed definitions in, then rename every id so the copy is
// self-contained and never collides with the originals.
function copySvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const own = new Set(Array.from(clone.querySelectorAll("[id]"), (el) => el.id));
  const refs = new Set(Array.from(clone.outerHTML.matchAll(/url\(#([^)]+)\)/g), (m) => m[1]));
  let defs = clone.querySelector("defs");
  for (const id of refs) {
    if (own.has(id)) continue;
    const borrowed = document.getElementById(id);
    if (!borrowed) continue;
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      clone.prepend(defs);
    }
    defs.appendChild(borrowed.cloneNode(true));
  }
  return renameIds(clone.outerHTML);
}

function renameIds(html: string): string {
  return html
    .replace(/\sid="([^"]+)"/g, ' id="$1-lb"')
    .replace(/url\(#([^)]+)\)/g, "url(#$1-lb)")
    .replace(/href="#([^"]+)"/g, 'href="#$1-lb"');
}

function aspectOf(svg: SVGSVGElement): number {
  const vb = svg.viewBox?.baseVal;
  if (vb && vb.width && vb.height) return vb.width / vb.height;
  const r = svg.getBoundingClientRect();
  return r.height ? r.width / r.height : 16 / 9;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function FigureLightbox() {
  const [open, setOpen] = useState<Open | null>(null);
  const [closing, setClosing] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const svgBoxRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Make every illustration a keyboard-reachable button, and open on click / Enter / Space.
  useEffect(() => {
    const figures = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    for (const f of figures) {
      const svg = f.querySelector("svg");
      if (!svg) continue;
      f.classList.add("is-zoomable");
      f.tabIndex = 0;
      f.setAttribute("role", "button");
      const what = svg.getAttribute("aria-label");
      f.setAttribute("aria-label", what ? `Expand illustration: ${what}` : "Expand illustration");
    }

    const openFrom = (fig: HTMLElement) => {
      const svg = fig.querySelector<SVGSVGElement>("svg");
      if (!svg) return;
      const cap = fig.querySelector("figcaption");
      track("figure_open");
      setNarrow(window.innerWidth < 700);
      setZoomed(false);
      setClosing(false);
      setOpen({
        source: fig,
        svgHtml: copySvg(svg),
        captionHtml: cap ? cap.innerHTML : null,
        label: svg.getAttribute("aria-label") ?? "Illustration",
        aspect: aspectOf(svg),
      });
    };

    const onClick = (e: MouseEvent) => {
      const fig = (e.target as Element).closest<HTMLElement>(SELECTOR);
      if (!fig || (e.target as Element).closest("a")) return;
      openFrom(fig);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const fig = (e.target as Element).closest?.<HTMLElement>(SELECTOR);
      if (!fig || fig !== e.target) return;
      e.preventDefault();
      openFrom(fig);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Open: lay out at full size, then animate from the source illustration's rectangle.
  useLayoutEffect(() => {
    if (!open || closing) return;
    const plate = plateRef.current;
    const box = svgBoxRef.current;
    const dim = dimRef.current;
    if (!plate || !box || !dim) return;

    open.source.classList.add("is-lifted");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const anims: Animation[] = [];
    if (reducedMotion()) {
      anims.push(plate.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, fill: "both" }));
    } else {
      const from = open.source.querySelector("svg")!.getBoundingClientRect();
      const to = box.getBoundingClientRect();
      const p = plate.getBoundingClientRect();
      const s = from.width / to.width;
      plate.style.transformOrigin = `${to.left - p.left}px ${to.top - p.top}px`;
      anims.push(
        plate.animate(
          [
            { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${s})` },
            { transform: "none" },
          ],
          { duration: OPEN_MS, easing: EASE, fill: "both" }
        )
      );
    }
    // Fade only the dimming layer: fading the whole overlay would make the illustration see-through.
    anims.push(dim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease", fill: "both" }));
    if (capRef.current) {
      anims.push(
        capRef.current.animate(
          [
            { opacity: 0, transform: "translateY(6px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 300, delay: OPEN_MS * 0.55, easing: "ease", fill: "both" }
        )
      );
    }
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 80);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      for (const a of anims) a.cancel();
    };
  }, [open, closing]);

  const finish = useCallback(() => {
    if (!open) return;
    open.source.classList.remove("is-lifted");
    open.source.focus({ preventScroll: true });
    setOpen(null);
    setClosing(false);
    setZoomed(false);
  }, [open]);

  // Close: shrink back into the source rectangle (or fade, when zoomed or motion is reduced).
  const close = useCallback(() => {
    if (!open || closing) return;
    setClosing(true);
    const plate = plateRef.current;
    const box = svgBoxRef.current;
    const dim = dimRef.current;
    if (!plate || !box || !dim) return finish();

    const anims: Animation[] = [];
    if (zoomed || reducedMotion()) {
      anims.push(
        plate.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(0.96)" }], {
          duration: 200,
          easing: "ease",
          fill: "forwards",
        })
      );
    } else {
      const from = open.source.querySelector("svg")!.getBoundingClientRect();
      const to = box.getBoundingClientRect();
      const p = plate.getBoundingClientRect();
      const s = from.width / to.width;
      plate.style.transformOrigin = `${to.left - p.left}px ${to.top - p.top}px`;
      anims.push(
        plate.animate(
          [
            { transform: "none" },
            { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${s})` },
          ],
          { duration: CLOSE_MS, easing: EASE, fill: "forwards" }
        )
      );
    }
    if (capRef.current) {
      anims.push(capRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
    }
    anims.push(
      dim.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: CLOSE_MS,
        easing: "ease",
        fill: "forwards",
      })
    );
    Promise.all(anims.map((a) => a.finished))
      .catch(() => undefined)
      .then(finish);
  }, [open, closing, zoomed, finish]);

  // Escape closes; Tab stays inside the viewer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const items = backdropRef.current?.querySelectorAll<HTMLElement>("button");
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className={`lb-backdrop ${zoomed ? "is-zoomed" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={open.label}
      onClick={(e) => {
        if (!zoomed && !(e.target as Element).closest(".lb-tools")) close();
      }}
    >
      <div ref={dimRef} className="lb-dim" aria-hidden />
      <div className="lb-tools" onClick={(e) => e.stopPropagation()}>
        {narrow ? (
          <button
            type="button"
            className="lb-btn"
            onClick={() => setZoomed((z) => !z)}
            aria-pressed={zoomed}
            aria-label={zoomed ? "Fit to screen" : "Zoom in"}
          >
            {zoomed ? <ZoomOut className="w-4 h-4" aria-hidden /> : <ZoomIn className="w-4 h-4" aria-hidden />}
          </button>
        ) : null}
        <button ref={closeRef} type="button" className="lb-btn" onClick={close} aria-label="Close illustration">
          <X className="w-4 h-4" aria-hidden />
        </button>
      </div>

      <div className="lb-stage">
        <div
          ref={plateRef}
          className="lb-plate"
          style={{ "--lb-aspect": open.aspect } as React.CSSProperties}
        >
          <div ref={svgBoxRef} className="lb-svg" dangerouslySetInnerHTML={{ __html: open.svgHtml }} />
          {open.captionHtml ? (
            <figcaption ref={capRef} className="lb-cap" dangerouslySetInnerHTML={{ __html: open.captionHtml }} />
          ) : null}
        </div>
      </div>
      {!zoomed ? <p className="lb-hint">{narrow ? "Tap anywhere to close" : "Click anywhere to close"}</p> : null}
    </div>
  );
}
