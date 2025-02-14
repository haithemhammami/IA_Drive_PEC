"use client";

import Image from "next/image";

export default function CategoryImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/default-image.png";
      }}
    />
  );
}
