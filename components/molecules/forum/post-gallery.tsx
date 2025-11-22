"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface ForumPostGalleryProps {
  title: string;
  images: string[];
}

export function ForumPostGallery({ title, images }: ForumPostGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images?.length ?? 0;

  const goTo = useCallback(
    (index: number) => {
      if (!totalImages) return;
      if (index < 0) {
        setCurrentIndex(totalImages - 1);
      } else if (index >= totalImages) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(index);
      }
    },
    [totalImages]
  );

  if (!totalImages) return null;

  const hasMultipleImages = totalImages > 1;

  return (
    <div className="mt-6 space-y-4 px-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-100">
        {images!.map((image, idx) => (
          <Image
            key={image}
            src={image}
            alt={`${title} - ảnh ${idx + 1}`}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              idx === currentIndex ? "opacity-100" : "opacity-0"
            )}
            priority={idx === currentIndex}
          />
        ))}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-green-700 shadow hover:bg-white focus:outline-none"
              onClick={() => goTo(currentIndex - 1)}
              aria-label="Ảnh trước"
            >
              <Icons.chevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-green-700 shadow hover:bg-white focus:outline-none"
              onClick={() => goTo(currentIndex + 1)}
              aria-label="Ảnh tiếp theo"
            >
              <Icons.chevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <>
          <div className="flex items-center justify-center gap-2">
            {images!.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                type="button"
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all",
                  idx === currentIndex
                    ? "bg-green-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                onClick={() => goTo(idx)}
                aria-label={`Chuyển đến ảnh ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images!.map((image, idx) => (
              <button
                key={`thumb-${image}`}
                type="button"
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  idx === currentIndex
                    ? "border-green-500"
                    : "border-transparent hover:border-green-200"
                )}
                onClick={() => goTo(idx)}
                aria-label={`Xem ảnh ${idx + 1}`}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

