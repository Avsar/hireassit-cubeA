import React from "react";

export function CubeAIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M35 8 L62 22 L35 36 L8 22 Z" fill="#A7D7C5" />
      <path d="M8 22 L35 36 L35 64 L8 50 Z" fill="#085344" />
      <path d="M35 36 L62 22 L62 50 L35 64 Z" fill="#0B6E5B" />
    </svg>
  );
}

function HexagramA({ height = 20 }: { height?: number }) {
  const w = (height * 48) / 54;
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 48 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 0 L48 54 L39 54 L32.5 38 L15.5 38 L9 54 L0 54 Z"
        fill="#0B6E5B"
      />
      <path
        d="M24 19 L26 22.5 L30.1 22.5 L28 26 L30.1 29.5 L26 29.5 L24 33 L22 29.5 L17.9 29.5 L20 26 L17.9 22.5 L22 22.5 Z"
        fill="white"
      />
    </svg>
  );
}

export default function CubeALogo({ iconSize = 32 }: { iconSize?: number }) {
  const fontSize = Math.max(14, iconSize * 0.55);
  const aHeight = fontSize * 1.15;
  return (
    <span className="flex items-center gap-2.5">
      <CubeAIcon size={iconSize} />
      <span className="flex items-center" style={{ gap: "0.3em" }}>
        <span
          className="font-extrabold text-neutral-900"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontSize: `${fontSize}px`, letterSpacing: "-0.02em" }}
        >
          Cube
        </span>
        <HexagramA height={aHeight} />
      </span>
    </span>
  );
}
