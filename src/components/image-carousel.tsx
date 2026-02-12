"use client";

import { useEffect, useMemo, useState } from "react";

type CarouselImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ImageCarouselProps = {
  images?: CarouselImage[];
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  const safeImages = Array.isArray(images)
    ? images.filter(
        (image): image is CarouselImage =>
          Boolean(image) &&
          typeof image.src === "string" &&
          image.src.trim().length > 0 &&
          typeof image.alt === "string" &&
          image.alt.trim().length > 0
      )
    : [];

  const [index, setIndex] = useState(0);
  const total = safeImages.length;

  useEffect(() => {
    if (total === 0) return;
    if (index >= total) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    if (total <= 1) return undefined;
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 2600);
    return () => clearTimeout(timer);
  }, [index, total]);

  useEffect(() => {
    if (total <= 1) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % total);
      }
      if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + total) % total);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (total === 0) return null;
  const current = safeImages[index] ?? safeImages[0];
  if (!current) return null;
  const progress = useMemo(() => `${((index + 1) / total) * 100}%`, [index, total]);

  return (
    <section className="my-6 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-slate-500/50 bg-slate-900/60 py-3">
      <div className="px-3 md:px-4">
        <div className="mb-2 h-1.5 w-full rounded-full bg-slate-700/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 transition-all duration-500"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="px-3 md:px-4">
        <div className="relative h-[340px] w-full overflow-hidden rounded-md md:h-[560px]">
          {/* Background layer keeps portrait images from looking isolated */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${current.src}-bg`}
            src={current.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-35 blur-md"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="absolute inset-0 h-full w-full rounded-md border border-slate-500/60 object-contain object-center shadow-lg transition-all duration-500"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 overflow-hidden px-4 md:px-8">
        <p className="max-w-full text-sm text-slate-100 break-words">{current.caption ?? current.alt}</p>
        <div className="flex items-center gap-2">
          {safeImages.map((image, dotIndex) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Go to image ${dotIndex + 1}`}
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                dotIndex === index ? "w-6 bg-cyan-300" : "bg-slate-400/80 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 overflow-x-auto px-3 pb-1 md:px-4">
        <div className="flex min-w-max items-center gap-2">
          {safeImages.map((image, thumbIndex) => (
            <button
              key={`${image.src}-thumb`}
              type="button"
              aria-label={`Preview image ${thumbIndex + 1}`}
              onClick={() => setIndex(thumbIndex)}
              className={`overflow-hidden rounded border transition-all ${
                thumbIndex === index
                  ? "border-cyan-300 shadow-[0_0_0_1px_rgba(103,232,249,0.6)]"
                  : "border-slate-500/70 hover:border-slate-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="h-14 w-24 object-cover md:h-16 md:w-28"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
