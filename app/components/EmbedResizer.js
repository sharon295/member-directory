"use client";

import { useEffect } from "react";

// When the directory is shown inside an iframe (e.g. on a GHL page), tell the
// parent page how tall the content is so it can size the iframe to fit and
// avoid an inner scrollbar. Measures the last child of <main> rather than
// <body>, because body stretches to at least the iframe's current height.
export default function EmbedResizer() {
  useEffect(() => {
    if (window.parent === window) return;

    const main = document.querySelector("main");
    if (!main) return;

    const send = () => {
      const last = main.lastElementChild;
      if (!last) return;
      const height = Math.ceil(last.getBoundingClientRect().bottom + window.scrollY);
      window.parent.postMessage({ type: "pw-directory-height", height }, "*");
    };

    send();
    const observer = new ResizeObserver(send);
    observer.observe(main);
    window.addEventListener("load", send);
    window.addEventListener("resize", send);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", send);
      window.removeEventListener("resize", send);
    };
  }, []);

  return null;
}
