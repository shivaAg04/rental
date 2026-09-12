"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ItemMedia } from "./item-media";

const AUTO_ADVANCE_MS = 4000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function ImageCarousel({
  images,
  gradient,
  alt,
}: {
  images: string[];
  gradient: [string, string];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (images.length <= 1 || isPaused || prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [images.length, isPaused, prefersReducedMotion, index]);

  if (images.length === 0) {
    return (
      <ItemMedia
        imageUrl={null}
        gradient={gradient}
        alt={alt}
        className="h-full w-full"
      />
    );
  }

  const goTo = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  return (
    <div
      className="group/carousel relative h-full w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded images from an arbitrary/unknown host */}
      <img
        src={images[index]}
        alt={`${alt} — photo ${index + 1} of ${images.length}`}
        className="h-full w-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100 cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`size-2 rounded-full transition-all cursor-pointer ${
                  i === index ? "w-5 bg-white" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
