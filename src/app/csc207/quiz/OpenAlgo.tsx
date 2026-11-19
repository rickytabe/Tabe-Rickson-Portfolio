"use client";

import { useEffect } from "react";

/** Forward to the book with Algo open, keeping ?ref= and any other tags. */
export default function OpenAlgo() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("quiz", "1");
    window.location.replace(`/algorithms-made-easy-csc207?${params.toString()}`);
  }, []);
  return null;
}
