"use client";

import { useId, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * Filters the book cards as you type. The cards stay server-rendered (good for search engines);
 * each one carries `data-book-search` with its title, subtitle, topics and description, and this
 * only hides the ones that do not match every word typed. No animation: results change instantly.
 */
export default function BookSearch({ total }: { total: number }) {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(total);
  const id = useId();

  const search = (value: string) => {
    setQuery(value);
    const words = value.toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    document.querySelectorAll<HTMLElement>("[data-book-search]").forEach((card) => {
      const text = card.dataset.bookSearch ?? "";
      const match = words.every((w) => text.includes(w));
      card.hidden = !match;
      if (match) count += 1;
    });
    setShown(count);
  };

  return (
    <div className="mb-10">
      <label htmlFor={id} className="sr-only">
        Search my books
      </label>
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" aria-hidden />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder="Search by course, topic or title, e.g. CSC207, 2's complement"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl bg-card-bg border border-foreground/15 pl-11 pr-11 py-3 font-inter text-base text-foreground placeholder:text-foreground/40 outline-none focus:border-[#39FF14]/60 focus-visible:ring-2 focus-visible:ring-[#39FF14]/30 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => search("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-foreground/50 hover:text-foreground active:scale-95"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-sm font-mono text-foreground/50" aria-live="polite">
        {query
          ? shown === 0
            ? `No book matches “${query}”. Try a course code like CSC207.`
            : `${shown} of ${total} books`
          : `${total} books`}
      </p>
    </div>
  );
}
