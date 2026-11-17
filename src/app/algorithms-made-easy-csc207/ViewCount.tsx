"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const cache = new Map<string, Promise<number | null>>();

function fetchViews(path: string): Promise<number | null> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(`/api/views?path=${encodeURIComponent(path)}`)
      .then((r) => (r.ok ? r.json() : { views: null }))
      .then((d: { views: number | null }) => (typeof d.views === "number" ? d.views : null))
      .catch(() => null);
    cache.set(path, p);
  }
  return p;
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** Live view count from Vercel Web Analytics. Renders nothing until (and unless) a count arrives. */
export default function ViewCount({ path, className }: { path: string; className?: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetchViews(path).then((v) => alive && setViews(v));
    return () => {
      alive = false;
    };
  }, [path]);

  if (views === null) return null;
  const shown = Math.max(views, 1);
  return (
    <span className={className} title={`${shown.toLocaleString()} ${shown === 1 ? "view" : "views"}`}>
      <Eye className="w-[15px] h-[15px]" aria-hidden />
      {compact.format(shown)} {shown === 1 ? "view" : "views"}
    </span>
  );
}
