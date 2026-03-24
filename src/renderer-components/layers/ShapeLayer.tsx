/**
 * ShapeLayer — renders a decorative SVG shape as a layer.
 *
 * Adapts SVG generation from the legacy Shape.tsx component
 * to work within the layer-based composition system.
 */

import type { ShapeLayerProps } from "@types";
import { seededRandom } from "../utils.ts";

// ── Line coordinate helpers ─────────────────────────────────

function getLineCoordinates(
  layer: ShapeLayerProps,
): { startX: number; startY: number; endX: number; endY: number } {
  if (layer.startX !== undefined && layer.endX !== undefined) {
    return {
      startX: layer.startX,
      startY: layer.startY ?? 50,
      endX: layer.endX,
      endY: layer.endY ?? 50,
    };
  }
  switch (layer.orientation ?? "horizontal") {
    case "horizontal":
      return { startX: 10, startY: 50, endX: 90, endY: 50 };
    case "vertical":
      return { startX: 50, startY: 10, endX: 50, endY: 90 };
    case "diagonal-down":
      return { startX: 10, startY: 10, endX: 90, endY: 90 };
    case "diagonal-up":
      return { startX: 10, startY: 90, endX: 90, endY: 10 };
    default:
      return { startX: 10, startY: 50, endX: 90, endY: 50 };
  }
}

// ── SVG Content ─────────────────────────────────────────────

function ShapeSVGContent(
  { layer, uniqueId }: { layer: ShapeLayerProps; uniqueId: string },
) {
  const { color, strokeWidth = 2, filled = false } = layer;
  const lineCap = layer.lineCap || "round";
  const dashArray = layer.dashStyle === "dashed"
    ? "10 5"
    : layer.dashStyle === "dotted"
    ? "2 4"
    : undefined;

  switch (layer.shapeType) {
    case "circle":
      return <circle cx="50" cy="50" r="45" fill={color} />;

    case "ring":
      return (
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );

    case "rectangle": {
      const rx = layer.borderRadius ?? 0;
      return filled
        ? <rect x="5" y="5" width="90" height="90" rx={rx} fill={color} />
        : (
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx={rx}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );
    }

    case "pill":
      return filled
        ? <rect x="5" y="20" width="90" height="60" rx="30" fill={color} />
        : (
          <rect
            x="5"
            y="20"
            width="90"
            height="60"
            rx="30"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );

    case "curved-line": {
      const { startX, startY, endX, endY } = getLineCoordinates(layer);
      const curvature = layer.curvature ?? 30;
      const orientation = layer.orientation ?? "horizontal";
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      let cpX = midX, cpY = midY;
      if (
        orientation === "horizontal" || orientation === "diagonal-down" ||
        orientation === "diagonal-up"
      ) {
        cpY = midY - curvature;
      } else {
        cpX = midX - curvature;
      }
      return (
        <path
          d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          strokeDasharray={dashArray}
        />
      );
    }

    case "s-curve": {
      const { startX, startY, endX, endY } = getLineCoordinates(layer);
      const curvature = Math.abs(layer.curvature ?? 40);
      const flip = (layer.curvature ?? 40) < 0 ? -1 : 1;
      const cp1X = startX + (endX - startX) * 0.3;
      const cp1Y = startY - curvature * flip;
      const cp2X = startX + (endX - startX) * 0.7;
      const cp2Y = endY + curvature * flip;
      return (
        <path
          d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          strokeDasharray={dashArray}
        />
      );
    }

    case "wave-line": {
      const { startX, startY, endX } = getLineCoordinates(layer);
      const waves = layer.count ?? 3;
      const amplitude = Math.abs(layer.curvature ?? 15);
      const flip = (layer.curvature ?? 15) < 0 ? -1 : 1;
      const segmentWidth = (endX - startX) / waves;
      let path = `M ${startX} ${startY}`;
      for (let i = 0; i < waves; i++) {
        const x1 = startX + segmentWidth * i + segmentWidth * 0.5;
        const y1 = i % 2 === 0
          ? startY - amplitude * flip
          : startY + amplitude * flip;
        const x2 = startX + segmentWidth * (i + 1);
        path += ` Q ${x1} ${y1}, ${x2} ${startY}`;
      }
      return (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          strokeDasharray={dashArray}
        />
      );
    }

    case "chevron": {
      const direction = layer.direction ?? "right";
      const dirAngle = { right: 0, down: 90, left: 180, up: 270 }[direction];
      const halfAngle = (layer.angle ?? 45) / 2;
      const rad1 = (dirAngle + halfAngle) * Math.PI / 180;
      const rad2 = (dirAngle - halfAngle) * Math.PI / 180;
      const len = 40;
      return (
        <path
          d={`M ${50 - Math.cos(rad1) * len} ${
            50 - Math.sin(rad1) * len
          } L 50 50 L ${50 - Math.cos(rad2) * len} ${
            50 - Math.sin(rad2) * len
          }`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          strokeLinejoin="round"
        />
      );
    }

    case "double-chevron": {
      const direction = layer.direction ?? "right";
      const gap = layer.gap ?? 15;
      const dirAngle = { right: 0, down: 90, left: 180, up: 270 }[direction];
      const halfAngle = (layer.angle ?? 45) / 2;
      const rad1 = (dirAngle + halfAngle) * Math.PI / 180;
      const rad2 = (dirAngle - halfAngle) * Math.PI / 180;
      const len = 35;
      const offsetX = Math.cos(dirAngle * Math.PI / 180) * gap / 2;
      const offsetY = Math.sin(dirAngle * Math.PI / 180) * gap / 2;
      const c1 = { x: 50 - offsetX, y: 50 - offsetY };
      const c2 = { x: 50 + offsetX, y: 50 + offsetY };
      return (
        <g>
          <path
            d={`M ${c1.x - Math.cos(rad1) * len} ${
              c1.y - Math.sin(rad1) * len
            } L ${c1.x} ${c1.y} L ${c1.x - Math.cos(rad2) * len} ${
              c1.y - Math.sin(rad2) * len
            }`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            strokeLinejoin="round"
          />
          <path
            d={`M ${c2.x - Math.cos(rad1) * len} ${
              c2.y - Math.sin(rad1) * len
            } L ${c2.x} ${c2.y} L ${c2.x - Math.cos(rad2) * len} ${
              c2.y - Math.sin(rad2) * len
            }`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            strokeLinejoin="round"
          />
        </g>
      );
    }

    case "arrow": {
      const direction = layer.direction ?? "right";
      const dirAngle = { right: 0, down: 90, left: 180, up: 270 }[direction];
      const headAngle = 25;
      const rad1 = (dirAngle + headAngle) * Math.PI / 180;
      const rad2 = (dirAngle - headAngle) * Math.PI / 180;
      const headLen = 20;
      const tailLen = 40;
      const tipX = 50 + Math.cos(dirAngle * Math.PI / 180) * 35;
      const tipY = 50 + Math.sin(dirAngle * Math.PI / 180) * 35;
      const tailX = 50 - Math.cos(dirAngle * Math.PI / 180) * tailLen;
      const tailY = 50 - Math.sin(dirAngle * Math.PI / 180) * tailLen;
      return (
        <g>
          <line
            x1={tailX}
            y1={tailY}
            x2={tipX}
            y2={tipY}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
          />
          <path
            d={`M ${tipX - Math.cos(rad1) * headLen} ${
              tipY - Math.sin(rad1) * headLen
            } L ${tipX} ${tipY} L ${tipX - Math.cos(rad2) * headLen} ${
              tipY - Math.sin(rad2) * headLen
            }`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            strokeLinejoin="round"
          />
        </g>
      );
    }

    case "triangle": {
      const r = 45;
      const pts = [0, 120, 240]
        .map((a) => {
          const rad = (a - 90) * Math.PI / 180;
          return `${50 + Math.cos(rad) * r},${50 + Math.sin(rad) * r}`;
        })
        .join(" ");
      return filled ? <polygon points={pts} fill={color} /> : (
        <polygon
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      );
    }

    case "diamond": {
      const r = 45;
      const pts = [0, 90, 180, 270]
        .map((a) => {
          const rad = a * Math.PI / 180;
          return `${50 + Math.cos(rad) * r},${50 + Math.sin(rad) * r}`;
        })
        .join(" ");
      return filled ? <polygon points={pts} fill={color} /> : (
        <polygon
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      );
    }

    case "hexagon": {
      const r = 45;
      const pts = [0, 60, 120, 180, 240, 300]
        .map((a) => {
          const rad = (a - 30) * Math.PI / 180;
          return `${50 + Math.cos(rad) * r},${50 + Math.sin(rad) * r}`;
        })
        .join(" ");
      return filled ? <polygon points={pts} fill={color} /> : (
        <polygon
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      );
    }

    case "star": {
      const numPoints = layer.points ?? 5;
      const outerR = 45;
      const innerR = outerR * (layer.innerRadius ?? 0.4);
      const pts: string[] = [];
      for (let i = 0; i < numPoints * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * 180 / numPoints - 90) * Math.PI / 180;
        pts.push(`${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`);
      }
      return filled ? <polygon points={pts.join(" ")} fill={color} /> : (
        <polygon
          points={pts.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      );
    }

    case "sparkle": {
      const r = 45;
      const inner = r * 0.25;
      const pts: string[] = [];
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? r : inner;
        const angle = (i * 45 - 90) * Math.PI / 180;
        pts.push(
          `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`,
        );
      }
      return filled ? <polygon points={pts.join(" ")} fill={color} /> : (
        <polygon
          points={pts.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      );
    }

    case "cross": {
      const arm = 35;
      const thickness = 10;
      return filled
        ? (
          <g>
            <rect
              x={50 - thickness / 2}
              y={50 - arm}
              width={thickness}
              height={arm * 2}
              fill={color}
            />
            <rect
              x={50 - arm}
              y={50 - thickness / 2}
              width={arm * 2}
              height={thickness}
              fill={color}
            />
          </g>
        )
        : (
          <g>
            <line
              x1="50"
              y1={50 - arm}
              x2="50"
              y2={50 + arm}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap={lineCap}
            />
            <line
              x1={50 - arm}
              y1="50"
              x2={50 + arm}
              y2="50"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap={lineCap}
            />
          </g>
        );
    }

    case "blob": {
      const complexity = layer.complexity ?? 6;
      const seed = layer.seed ?? 1;
      const r = 40;
      const variation = 10;
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < complexity; i++) {
        const angle = (i / complexity) * Math.PI * 2;
        const radiusVar = r + (seededRandom(seed + i) - 0.5) * variation * 2;
        points.push({
          x: 50 + Math.cos(angle) * radiusVar,
          y: 50 + Math.sin(angle) * radiusVar,
        });
      }
      let path = "";
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const cp1 = {
          x: p1.x + (p2.x - p0.x) * 0.2,
          y: p1.y + (p2.y - p0.y) * 0.2,
        };
        if (i === 0) path = `M ${p1.x} ${p1.y}`;
        const next = points[(i + 1) % points.length];
        const nextNext = points[(i + 2) % points.length];
        const cp2 = {
          x: next.x - (nextNext.x - p1.x) * 0.2,
          y: next.y - (nextNext.y - p1.y) * 0.2,
        };
        path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${next.x} ${next.y}`;
      }
      path += " Z";
      return filled ? <path d={path} fill={color} /> : (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );
    }

    case "crescent": {
      const outerR = 45;
      const innerR = outerR * (layer.innerRadius ?? 0.7);
      const offsetAmount = outerR - innerR;
      return (
        <>
          <defs>
            <mask id={`crescent-mask-${uniqueId}`}>
              <circle cx="50" cy="50" r={outerR} fill="white" />
              <circle cx={50 + offsetAmount} cy="50" r={innerR} fill="black" />
            </mask>
          </defs>
          <circle
            cx="50"
            cy="50"
            r={outerR}
            fill={color}
            mask={`url(#crescent-mask-${uniqueId})`}
          />
        </>
      );
    }

    case "dots-grid": {
      const rows = layer.rows ?? 4;
      const cols = layer.columns ?? 4;
      const dotSize = layer.dotSize ?? 3;
      const spacing = layer.spacing ?? 20;
      const dots: JSX.Element[] = [];
      const sx = 50 - ((cols - 1) * spacing) / 2;
      const sy = 50 - ((rows - 1) * spacing) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push(
            <circle
              key={`${r}-${c}`}
              cx={sx + c * spacing}
              cy={sy + r * spacing}
              r={dotSize}
              fill={color}
            />,
          );
        }
      }
      return <>{dots}</>;
    }

    case "scattered-dots": {
      const count = layer.count ?? 12;
      const dotSize = layer.dotSize ?? 2;
      const seed = layer.seed ?? 1;
      const dots: JSX.Element[] = [];
      for (let i = 0; i < count; i++) {
        const x = 10 + seededRandom(seed + i * 2) * 80;
        const y = 10 + seededRandom(seed + i * 2 + 1) * 80;
        const sizeVar = dotSize * (0.5 + seededRandom(seed + i * 3));
        dots.push(
          <circle key={i} cx={x} cy={y} r={sizeVar} fill={color} />,
        );
      }
      return <>{dots}</>;
    }

    default:
      return <circle cx="50" cy="50" r="45" fill={color} />;
  }
}

// ── Layer component ─────────────────────────────────────────

export const ShapeLayer = (layer: ShapeLayerProps) => {
  const { size, posX, posY, rotation, opacity, blur = 0 } = layer;
  const uniqueId = `shape-${layer.id}`;

  return (
    <div
      style={{
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        width: `${size}px`,
        aspectRatio: "1",
        transform: `translate(-50%, -50%)${
          rotation ? ` rotate(${rotation}deg)` : ""
        }`,
        opacity,
        pointerEvents: "none",
        overflow: "visible",
        ...(blur > 0 && { filter: `blur(${blur}px)` }),
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <ShapeSVGContent layer={layer} uniqueId={uniqueId} />
      </svg>
    </div>
  );
};
