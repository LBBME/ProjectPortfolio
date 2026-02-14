"use client";

import { useEffect, useMemo, useState } from "react";

type CarouselImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ImageCarouselProps = {
  images?: unknown;
};

function toRawImageList(input: unknown): unknown[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return toRawImageList(parsed);
    } catch {
      return [];
    }
  }

  if (typeof input === "object") {
    const wrapped = input as { images?: unknown };
    if (wrapped.images) return toRawImageList(wrapped.images);

    const maybeValue = (input as { value?: unknown }).value;
    if (typeof maybeValue === "string") {
      try {
        const parsed = JSON.parse(maybeValue);
        return toRawImageList(parsed);
      } catch {
        // Continue with object parsing fallback.
      }
    }

    if (Symbol.iterator in (input as Record<string, unknown>)) {
      try {
        return Array.from(input as Iterable<unknown>);
      } catch {
        // Fall through to object values.
      }
    }

    return Object.values(input as Record<string, unknown>);
  }

  return [];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const rawImages = toRawImageList(images);
  const safeImages = rawImages.reduce<CarouselImage[]>((acc, raw) => {
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) return acc;
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          const nested = toRawImageList(parsed);
          for (const item of nested) {
            if (item && typeof item === "object") {
              const candidate = item as { src?: unknown; alt?: unknown; caption?: unknown };
              const src = typeof candidate.src === "string" ? candidate.src.trim() : "";
              if (!src) continue;
              const caption =
                typeof candidate.caption === "string" && candidate.caption.trim().length > 0
                  ? candidate.caption.trim()
                  : undefined;
              const alt =
                typeof candidate.alt === "string" && candidate.alt.trim().length > 0
                  ? candidate.alt.trim()
                  : caption ?? "project image";
              acc.push({ src, alt, caption });
            }
          }
          return acc;
        } catch {
          // Fall through to simple string handling.
        }
      }
    }

    if (typeof raw === "string" && raw.trim().length > 0) {
      acc.push({ src: raw.trim(), alt: "project image" });
      return acc;
    }

    if (!raw || typeof raw !== "object") return acc;
    const candidate = raw as { src?: unknown; alt?: unknown; caption?: unknown };
    const src = typeof candidate.src === "string" ? candidate.src.trim() : "";
    if (!src) return acc;
    const caption =
      typeof candidate.caption === "string" && candidate.caption.trim().length > 0
        ? candidate.caption.trim()
        : undefined;
    const alt =
      typeof candidate.alt === "string" && candidate.alt.trim().length > 0
        ? candidate.alt.trim()
        : caption ?? "project image";
    acc.push({ src, alt, caption });
    return acc;
  }, []);

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

  if (total === 0) {
    return (
      <section className="my-6 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 p-4">
        <p className="text-sm text-zinc-600">Carousel media unavailable for this project.</p>
      </section>
    );
  }
  const current = safeImages[index] ?? safeImages[0];
  if (!current) return null;
  const progress = useMemo(() => `${((index + 1) / total) * 100}%`, [index, total]);

  return (
    <section className="my-6 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white py-3">
      <div className="px-3 md:px-4">
        <div className="mb-2 h-1.5 w-full rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 transition-all duration-500"
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
            className="absolute inset-0 h-full w-full rounded-md border border-zinc-300 object-contain object-center shadow-lg transition-all duration-500"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 overflow-hidden px-4 md:px-8">
        <p className="max-w-full text-sm text-zinc-700 break-words">{current.caption ?? current.alt}</p>
        <div className="flex items-center gap-2">
          {safeImages.map((image, dotIndex) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Go to image ${dotIndex + 1}`}
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                dotIndex === index ? "w-6 bg-zinc-800" : "bg-zinc-300 hover:bg-zinc-400"
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
                  ? "border-zinc-800 shadow-[0_0_0_1px_rgba(24,24,27,0.35)]"
                  : "border-zinc-300 hover:border-zinc-500"
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
