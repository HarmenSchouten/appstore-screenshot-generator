/**
 * ShapeLayer — renders a decorative SVG shape as a layer.
 *
 * One component per shape family. Each resolves its family's defaults from
 * `SHAPE_DEFAULTS` once; the geometry lives in shape-geometry.ts.
 */

import type { ReactElement } from "react";
import type {
  ArrowShapeProps,
  BasicShapeProps,
  GeometricShapeProps,
  LineShapeProps,
  OrganicShapeProps,
  PatternShapeProps,
  ShapeLayerProps,
} from "@app-types";
import { assertNever, resolveShape } from "@lib";
import { PositionedLayer } from "./PositionedLayer.tsx";
import {
  blobPath,
  CENTER,
  chevronPath,
  curvePath,
  DASH_ARRAY,
  DIRECTION_ANGLE,
  fillOrStroke,
  gridDots,
  LINE_ENDS,
  type LineEnds,
  lineStroke,
  offset,
  ORIGIN,
  polygonPoints,
  RADIUS,
  scatteredDots,
  sCurvePath,
  starPoints,
  strokeOnly,
  wavePath,
} from "./shape-geometry.ts";

// ── Basic ───────────────────────────────────────────────────

function BasicShape({ layer }: { layer: BasicShapeProps }): ReactElement {
  const s = resolveShape(layer);
  switch (s.shapeType) {
    case "circle":
      return <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={s.color} />;
    case "ring":
      return <circle cx={CENTER} cy={CENTER} r={RADIUS} {...strokeOnly(s)} />;
    case "rectangle":
      return (
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx={s.borderRadius}
          {...fillOrStroke(s)}
        />
      );
    case "pill":
      return (
        <rect
          x="5"
          y="20"
          width="90"
          height="60"
          rx="30"
          {...fillOrStroke(s)}
        />
      );
    default:
      return assertNever(s.shapeType);
  }
}

// ── Lines ───────────────────────────────────────────────────

/** Custom endpoints when both X values are set, else the orientation preset. */
function lineEnds(
  s: ReturnType<typeof resolveShape<LineShapeProps>>,
): LineEnds {
  if (s.startX !== undefined && s.endX !== undefined) {
    return {
      startX: s.startX,
      startY: s.startY ?? CENTER,
      endX: s.endX,
      endY: s.endY ?? CENTER,
    };
  }
  return LINE_ENDS[s.orientation];
}

function LineShape({ layer }: { layer: LineShapeProps }): ReactElement {
  const s = resolveShape(layer);
  const ends = lineEnds(s);
  const paint = {
    ...strokeOnly(s, s.lineCap),
    strokeDasharray: DASH_ARRAY[s.dashStyle],
  };
  switch (s.shapeType) {
    case "curved-line":
      return (
        <path
          d={curvePath(ends, s.curvature, s.orientation)}
          {...paint}
        />
      );
    case "s-curve":
      return <path d={sCurvePath(ends, s.curvature)} {...paint} />;
    case "wave-line":
      return <path d={wavePath(ends, s.count, s.curvature)} {...paint} />;
    default:
      return assertNever(s.shapeType);
  }
}

// ── Arrows & chevrons ───────────────────────────────────────

const CHEVRON_LENGTH = 40;
const DOUBLE_CHEVRON_LENGTH = 35;
const ARROW_TIP = 35;
const ARROW_TAIL = 40;
const ARROW_HEAD_ANGLE = 25;
const ARROW_HEAD_LENGTH = 20;

function ArrowShape({ layer }: { layer: ArrowShapeProps }): ReactElement {
  const s = resolveShape(layer);
  const dir = DIRECTION_ANGLE[s.direction];
  const paint = {
    ...strokeOnly(s, s.lineCap),
    strokeLinejoin: "round" as const,
  };
  const half = s.angle / 2;
  switch (s.shapeType) {
    case "chevron":
      return (
        <path d={chevronPath(ORIGIN, dir, half, CHEVRON_LENGTH)} {...paint} />
      );
    case "double-chevron": {
      const first = offset(dir, -s.gap / 2, ORIGIN);
      const second = offset(dir, s.gap / 2, ORIGIN);
      return (
        <g>
          <path
            d={chevronPath(first, dir, half, DOUBLE_CHEVRON_LENGTH)}
            {...paint}
          />
          <path
            d={chevronPath(second, dir, half, DOUBLE_CHEVRON_LENGTH)}
            {...paint}
          />
        </g>
      );
    }
    case "arrow": {
      const tip = offset(dir, ARROW_TIP, ORIGIN);
      const tail = offset(dir, -ARROW_TAIL, ORIGIN);
      return (
        <g>
          <line
            x1={tail.x}
            y1={tail.y}
            x2={tip.x}
            y2={tip.y}
            {...lineStroke(s, s.lineCap)}
          />
          <path
            d={chevronPath(tip, dir, ARROW_HEAD_ANGLE, ARROW_HEAD_LENGTH)}
            {...paint}
          />
        </g>
      );
    }
    default:
      return assertNever(s.shapeType);
  }
}

// ── Geometric ───────────────────────────────────────────────

/** A sparkle is a four-pointed star with a deep inner radius. */
const SPARKLE_INNER_RATIO = 0.25;
const CROSS_ARM = 35;
const CROSS_THICKNESS = 10;

function GeometricShape(
  { layer }: { layer: GeometricShapeProps },
): ReactElement {
  const s = resolveShape(layer);
  const paint = fillOrStroke(s, "round");
  switch (s.shapeType) {
    case "triangle":
      return <polygon points={polygonPoints(3, RADIUS, -90)} {...paint} />;
    case "diamond":
      return <polygon points={polygonPoints(4, RADIUS, 0)} {...paint} />;
    case "hexagon":
      return <polygon points={polygonPoints(6, RADIUS, -30)} {...paint} />;
    case "star":
      return (
        <polygon
          points={starPoints(s.points, RADIUS, RADIUS * s.innerRadius)}
          {...paint}
        />
      );
    case "sparkle":
      return (
        <polygon
          points={starPoints(4, RADIUS, RADIUS * SPARKLE_INNER_RATIO)}
          {...paint}
        />
      );
    case "cross":
      return s.filled
        ? (
          <g>
            <rect
              x={CENTER - CROSS_THICKNESS / 2}
              y={CENTER - CROSS_ARM}
              width={CROSS_THICKNESS}
              height={CROSS_ARM * 2}
              fill={s.color}
            />
            <rect
              x={CENTER - CROSS_ARM}
              y={CENTER - CROSS_THICKNESS / 2}
              width={CROSS_ARM * 2}
              height={CROSS_THICKNESS}
              fill={s.color}
            />
          </g>
        )
        : (
          <g>
            <line
              x1={CENTER}
              y1={CENTER - CROSS_ARM}
              x2={CENTER}
              y2={CENTER + CROSS_ARM}
              {...lineStroke(s, s.lineCap)}
            />
            <line
              x1={CENTER - CROSS_ARM}
              y1={CENTER}
              x2={CENTER + CROSS_ARM}
              y2={CENTER}
              {...lineStroke(s, s.lineCap)}
            />
          </g>
        );
    default:
      return assertNever(s.shapeType);
  }
}

// ── Organic ─────────────────────────────────────────────────

function OrganicShape({ layer }: { layer: OrganicShapeProps }): ReactElement {
  const s = resolveShape(layer);
  switch (s.shapeType) {
    case "blob":
      return <path d={blobPath(s.complexity, s.seed)} {...fillOrStroke(s)} />;
    case "crescent": {
      const innerR = RADIUS * s.innerRadius;
      const bite = RADIUS - innerR;
      const maskId = `crescent-mask-shape-${s.id}`;
      return (
        <>
          <defs>
            <mask id={maskId}>
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="white" />
              <circle cx={CENTER + bite} cy={CENTER} r={innerR} fill="black" />
            </mask>
          </defs>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill={s.color}
            mask={`url(#${maskId})`}
          />
        </>
      );
    }
    default:
      return assertNever(s.shapeType);
  }
}

// ── Patterns ────────────────────────────────────────────────

function PatternShape({ layer }: { layer: PatternShapeProps }): ReactElement {
  const s = resolveShape(layer);
  const dots = s.shapeType === "dots-grid"
    ? gridDots(s.rows, s.columns, s.spacing, s.dotSize)
    : s.shapeType === "scattered-dots"
    ? scatteredDots(s.count, s.dotSize, s.seed)
    : assertNever(s.shapeType);
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={s.color} />
      ))}
    </>
  );
}

// ── Dispatch ────────────────────────────────────────────────

function ShapeContent({ layer }: { layer: ShapeLayerProps }): ReactElement {
  switch (layer.shapeType) {
    case "circle":
    case "ring":
    case "rectangle":
    case "pill":
      return <BasicShape layer={layer} />;
    case "curved-line":
    case "s-curve":
    case "wave-line":
      return <LineShape layer={layer} />;
    case "chevron":
    case "double-chevron":
    case "arrow":
      return <ArrowShape layer={layer} />;
    case "triangle":
    case "diamond":
    case "hexagon":
    case "star":
    case "sparkle":
    case "cross":
      return <GeometricShape layer={layer} />;
    case "blob":
    case "crescent":
      return <OrganicShape layer={layer} />;
    case "dots-grid":
    case "scattered-dots":
      return <PatternShape layer={layer} />;
    default:
      return assertNever(layer);
  }
}

// ── Layer component ─────────────────────────────────────────

export const ShapeLayer = (layer: ShapeLayerProps) => {
  const { size, blur } = resolveShape(layer);

  return (
    <PositionedLayer
      layer={layer}
      style={{
        width: `${size}px`,
        aspectRatio: "1",
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
        <ShapeContent layer={layer} />
      </svg>
    </PositionedLayer>
  );
};
