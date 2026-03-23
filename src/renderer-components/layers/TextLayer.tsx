import type { TextLayerProps } from "../../types.ts";

export const TextLayer = ({
  text,
  posX,
  posY,
  rotation,
  opacity,
  fontSize = 48,
  fontWeight = 700,
  lineHeight = 1.2,
  letterSpacing,
  textColor = "#ffffff",
  textAlign = "center",
  textTransform,
  horizontalPadding = 6,
}: TextLayerProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        transform: `translate(-50%, -50%)${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`,
        width: `${100 - horizontalPadding * 2}%`,
        opacity,
        fontSize: `${fontSize}px`,
        fontWeight,
        lineHeight,
        letterSpacing: letterSpacing != null ? `${letterSpacing}px` : undefined,
        color: textColor,
        textAlign,
        textTransform: textTransform ?? undefined,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text}
    </div>
  );
};
