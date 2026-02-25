import React from "react";

/**
 * Isometric cube logo mark (Concept 2 — "The Dimension").
 * Three-toned cube: top #99f6e4, left #0d9488, right #14b8a6.
 */
export function CubeAIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top face */}
      <path d="M35 8 L62 22 L35 36 L8 22 Z" fill="#99f6e4" />
      {/* Left face */}
      <path d="M8 22 L35 36 L35 64 L8 50 Z" fill="#0d9488" />
      {/* Right face */}
      <path d="M35 36 L62 22 L62 50 L35 64 Z" fill="#14b8a6" />
    </svg>
  );
}

/** Full logo: isometric cube + "Cube A" wordmark. */
export default function CubeALogo({ iconSize = 32 }: { iconSize?: number }) {
  return (
    <span className="flex items-center gap-2">
      <CubeAIcon size={iconSize} />
      <span
        className="font-bold tracking-tight text-neutral-900"
        style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem" }}
      >
        Cube{" "}
        <span className="font-extrabold" style={{ color: "#0d9488" }}>
          A
        </span>
      </span>
    </span>
  );
}
