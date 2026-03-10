/**
 * Shape Component
 * 
 * Renders decorative SVG shapes for screenshot backgrounds.
 */

import React from 'react';
import type { Shape as ShapeType } from './types.ts';
import { seededRandom } from './utils.ts';

/**
 * Get line coordinates from orientation preset or explicit values
 */
function getLineCoordinates(shape: ShapeType): { startX: number; startY: number; endX: number; endY: number } {
  if (shape.startX !== undefined && shape.endX !== undefined) {
    return {
      startX: shape.startX,
      startY: shape.startY ?? 50,
      endX: shape.endX,
      endY: shape.endY ?? 50
    };
  }
  
  const orientation = shape.orientation ?? 'horizontal';
  switch (orientation) {
    case 'horizontal':
      return { startX: 10, startY: 50, endX: 90, endY: 50 };
    case 'vertical':
      return { startX: 50, startY: 10, endX: 50, endY: 90 };
    case 'diagonal-down':
      return { startX: 10, startY: 10, endX: 90, endY: 90 };
    case 'diagonal-up':
      return { startX: 10, startY: 90, endX: 90, endY: 10 };
    default:
      return { startX: 10, startY: 50, endX: 90, endY: 50 };
  }
}

interface ShapeSVGProps {
  shape: ShapeType;
  uniqueId: string;
}

/**
 * SVG content for a shape
 */
function ShapeSVG({ shape, uniqueId }: ShapeSVGProps): React.ReactElement {
  const { type, color, opacity = 0.2, strokeWidth = 2, filled = false } = shape;
  const lineCap = shape.lineCap || 'round';
  const dashArray = shape.dashStyle === 'dashed' ? '10 5' : 
                    shape.dashStyle === 'dotted' ? '2 4' : undefined;
  
  switch (type) {
    case 'circle':
      return <circle cx="50%" cy="50%" r="45%" fill={color} opacity={opacity} />;
    
    case 'ring':
      return <circle cx="50%" cy="50%" r="45%" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />;
    
    case 'rectangle': {
      const rx = shape.borderRadius ?? 0;
      if (filled) {
        return <rect x="5%" y="5%" width="90%" height="90%" rx={`${rx}%`} fill={color} opacity={opacity} />;
      }
      return <rect x="5%" y="5%" width="90%" height="90%" rx={`${rx}%`} fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />;
    }
    
    case 'pill':
      if (filled) {
        return <rect x="5%" y="20%" width="90%" height="60%" rx="30%" fill={color} opacity={opacity} />;
      }
      return <rect x="5%" y="20%" width="90%" height="60%" rx="30%" fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />;
    
    case 'curved-line': {
      const { startX, startY, endX, endY } = getLineCoordinates(shape);
      const curvature = shape.curvature ?? 30;
      const orientation = shape.orientation ?? 'horizontal';
      
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      let cpX = midX, cpY = midY;
      
      if (orientation === 'horizontal' || orientation === 'diagonal-down' || orientation === 'diagonal-up') {
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
          opacity={opacity}
        />
      );
    }
    
    case 's-curve': {
      const { startX, startY, endX, endY } = getLineCoordinates(shape);
      const curvature = Math.abs(shape.curvature ?? 40);
      const flip = (shape.curvature ?? 40) < 0 ? -1 : 1;
      
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
          opacity={opacity}
        />
      );
    }
    
    case 'wave-line': {
      const { startX, startY, endX } = getLineCoordinates(shape);
      const waves = shape.count ?? 3;
      const amplitude = Math.abs(shape.curvature ?? 15);
      const flip = (shape.curvature ?? 15) < 0 ? -1 : 1;
      
      const segmentWidth = (endX - startX) / waves;
      let path = `M ${startX} ${startY}`;
      
      for (let i = 0; i < waves; i++) {
        const x1 = startX + segmentWidth * i + segmentWidth * 0.5;
        const y1 = i % 2 === 0 ? startY - amplitude * flip : startY + amplitude * flip;
        const x2 = startX + segmentWidth * (i + 1);
        const y2 = startY;
        path += ` Q ${x1} ${y1}, ${x2} ${y2}`;
      }
      
      return (
        <path 
          d={path}
          fill="none" 
          stroke={color} 
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          strokeDasharray={dashArray}
          opacity={opacity}
        />
      );
    }
    
    case 'chevron': {
      const direction = shape.direction ?? 'right';
      const dirAngle = { right: 0, down: 90, left: 180, up: 270 }[direction];
      const angle = (shape.angle ?? 45) / 2;
      
      const rad1 = (dirAngle + angle) * Math.PI / 180;
      const rad2 = (dirAngle - angle) * Math.PI / 180;
      const len = 40;
      
      const x1 = 50 - Math.cos(rad1) * len;
      const y1 = 50 - Math.sin(rad1) * len;
      const x2 = 50 - Math.cos(rad2) * len;
      const y2 = 50 - Math.sin(rad2) * len;
      
      return (
        <path 
          d={`M ${x1} ${y1} L 50 50 L ${x2} ${y2}`}
          fill="none" 
          stroke={color} 
          strokeWidth={strokeWidth}
          strokeLinecap={lineCap}
          strokeLinejoin="round"
          opacity={opacity}
        />
      );
    }
    
    case 'double-chevron': {
      const direction = shape.direction ?? 'right';
      const gap = shape.gap ?? 15;
      const dirAngle = { right: 0, down: 90, left: 180, up: 270 }[direction];
      const angle = (shape.angle ?? 45) / 2;
      
      const rad1 = (dirAngle + angle) * Math.PI / 180;
      const rad2 = (dirAngle - angle) * Math.PI / 180;
      const len = 35;
      
      const offsetX = Math.cos(dirAngle * Math.PI / 180) * gap / 2;
      const offsetY = Math.sin(dirAngle * Math.PI / 180) * gap / 2;
      
      const c1 = { x: 50 - offsetX, y: 50 - offsetY };
      const c2 = { x: 50 + offsetX, y: 50 + offsetY };
      
      return (
        <g opacity={opacity}>
          <path 
            d={`M ${c1.x - Math.cos(rad1) * len} ${c1.y - Math.sin(rad1) * len} L ${c1.x} ${c1.y} L ${c1.x - Math.cos(rad2) * len} ${c1.y - Math.sin(rad2) * len}`}
            fill="none" 
            stroke={color} 
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            strokeLinejoin="round"
          />
          <path 
            d={`M ${c2.x - Math.cos(rad1) * len} ${c2.y - Math.sin(rad1) * len} L ${c2.x} ${c2.y} L ${c2.x - Math.cos(rad2) * len} ${c2.y - Math.sin(rad2) * len}`}
            fill="none" 
            stroke={color} 
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            strokeLinejoin="round"
          />
        </g>
      );
    }
    
    case 'arrow': {
      const direction = shape.direction ?? 'right';
      const dirAngle = { right: 0, down: 90, left: 180, up: 270 }[direction];
      const angle = 25;
      
      const rad1 = (dirAngle + angle) * Math.PI / 180;
      const rad2 = (dirAngle - angle) * Math.PI / 180;
      const headLen = 20;
      const tailLen = 40;
      
      const tipX = 50 + Math.cos(dirAngle * Math.PI / 180) * 35;
      const tipY = 50 + Math.sin(dirAngle * Math.PI / 180) * 35;
      const tailX = 50 - Math.cos(dirAngle * Math.PI / 180) * tailLen;
      const tailY = 50 - Math.sin(dirAngle * Math.PI / 180) * tailLen;
      const h1X = tipX - Math.cos(rad1) * headLen;
      const h1Y = tipY - Math.sin(rad1) * headLen;
      const h2X = tipX - Math.cos(rad2) * headLen;
      const h2Y = tipY - Math.sin(rad2) * headLen;
      
      return (
        <g opacity={opacity}>
          <line x1={tailX} y1={tailY} x2={tipX} y2={tipY} stroke={color} strokeWidth={strokeWidth} strokeLinecap={lineCap} />
          <path d={`M ${h1X} ${h1Y} L ${tipX} ${tipY} L ${h2X} ${h2Y}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap={lineCap} strokeLinejoin="round" />
        </g>
      );
    }
    
    case 'triangle': {
      const r = 45;
      const points = [0, 120, 240].map(a => {
        const rad = (a - 90) * Math.PI / 180;
        return `${50 + Math.cos(rad) * r},${50 + Math.sin(rad) * r}`;
      }).join(' ');
      
      if (filled) {
        return <polygon points={points} fill={color} opacity={opacity} />;
      }
      return <polygon points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" opacity={opacity} />;
    }
    
    case 'diamond': {
      const r = 45;
      const points = [0, 90, 180, 270].map(a => {
        const rad = a * Math.PI / 180;
        return `${50 + Math.cos(rad) * r},${50 + Math.sin(rad) * r}`;
      }).join(' ');
      
      if (filled) {
        return <polygon points={points} fill={color} opacity={opacity} />;
      }
      return <polygon points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" opacity={opacity} />;
    }
    
    case 'hexagon': {
      const r = 45;
      const points = [0, 60, 120, 180, 240, 300].map(a => {
        const rad = (a - 30) * Math.PI / 180;
        return `${50 + Math.cos(rad) * r},${50 + Math.sin(rad) * r}`;
      }).join(' ');
      
      if (filled) {
        return <polygon points={points} fill={color} opacity={opacity} />;
      }
      return <polygon points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" opacity={opacity} />;
    }
    
    case 'star': {
      const numPoints = shape.points ?? 5;
      const outerR = 45;
      const innerR = outerR * (shape.innerRadius ?? 0.4);
      const pts: string[] = [];
      
      for (let i = 0; i < numPoints * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * 180 / numPoints - 90) * Math.PI / 180;
        pts.push(`${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`);
      }
      
      if (filled) {
        return <polygon points={pts.join(' ')} fill={color} opacity={opacity} />;
      }
      return <polygon points={pts.join(' ')} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" opacity={opacity} />;
    }
    
    case 'sparkle': {
      const r = 45;
      const inner = r * 0.25;
      const pts: string[] = [];
      
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? r : inner;
        const angle = (i * 45 - 90) * Math.PI / 180;
        pts.push(`${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`);
      }
      
      if (filled) {
        return <polygon points={pts.join(' ')} fill={color} opacity={opacity} />;
      }
      return <polygon points={pts.join(' ')} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" opacity={opacity} />;
    }
    
    case 'cross': {
      const arm = 35;
      const thickness = 10;
      
      return (
        <g opacity={opacity}>
          {filled ? (
            <>
              <rect x={50 - thickness / 2} y={50 - arm} width={thickness} height={arm * 2} fill={color} />
              <rect x={50 - arm} y={50 - thickness / 2} width={arm * 2} height={thickness} fill={color} />
            </>
          ) : (
            <>
              <line x1="50" y1={50 - arm} x2="50" y2={50 + arm} stroke={color} strokeWidth={strokeWidth} strokeLinecap={lineCap} />
              <line x1={50 - arm} y1="50" x2={50 + arm} y2="50" stroke={color} strokeWidth={strokeWidth} strokeLinecap={lineCap} />
            </>
          )}
        </g>
      );
    }
    
    case 'blob': {
      const complexity = shape.complexity ?? 6;
      const seed = shape.seed ?? 1;
      const r = 40;
      const variation = 10;
      
      let path = '';
      const points: { x: number; y: number }[] = [];
      
      for (let i = 0; i < complexity; i++) {
        const angle = (i / complexity) * Math.PI * 2;
        const radiusVar = r + (seededRandom(seed + i) - 0.5) * variation * 2;
        points.push({
          x: 50 + Math.cos(angle) * radiusVar,
          y: 50 + Math.sin(angle) * radiusVar
        });
      }
      
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        
        const cp1 = { x: p1.x + (p2.x - p0.x) * 0.2, y: p1.y + (p2.y - p0.y) * 0.2 };
        
        if (i === 0) {
          path = `M ${p1.x} ${p1.y}`;
        }
        
        const next = points[(i + 1) % points.length];
        const nextNext = points[(i + 2) % points.length];
        const cp2 = { x: next.x - (nextNext.x - p1.x) * 0.2, y: next.y - (nextNext.y - p1.y) * 0.2 };
        
        path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${next.x} ${next.y}`;
      }
      path += ' Z';
      
      if (filled) {
        return <path d={path} fill={color} opacity={opacity} />;
      }
      return <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} opacity={opacity} />;
    }
    
    case 'crescent': {
      const outerR = 45;
      const innerR = outerR * (shape.innerRadius ?? 0.7);
      const offsetAmount = outerR - innerR;
      
      return (
        <>
          <defs>
            <mask id={`crescent-mask-${uniqueId}`}>
              <circle cx="50%" cy="50%" r={`${outerR}%`} fill="white" />
              <circle cx={`${50 + offsetAmount}%`} cy="50%" r={`${innerR}%`} fill="black" />
            </mask>
          </defs>
          <circle 
            cx="50%" 
            cy="50%" 
            r={`${outerR}%`} 
            fill={color} 
            mask={`url(#crescent-mask-${uniqueId})`} 
            opacity={opacity} 
          />
        </>
      );
    }
    
    case 'dots-grid': {
      const rows = shape.rows ?? 4;
      const cols = shape.columns ?? 4;
      const dotSize = shape.dotSize ?? 3;
      const spacing = shape.spacing ?? 20;
      
      const dots: React.ReactElement[] = [];
      const startX = 50 - ((cols - 1) * spacing) / 2;
      const startY = 50 - ((rows - 1) * spacing) / 2;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;
          dots.push(
            <circle key={`${r}-${c}`} cx={`${x}%`} cy={`${y}%`} r={`${dotSize}%`} fill={color} opacity={opacity} />
          );
        }
      }
      return <>{dots}</>;
    }
    
    case 'scattered-dots': {
      const count = shape.count ?? 12;
      const dotSize = shape.dotSize ?? 2;
      const seed = shape.seed ?? 1;
      
      const dots: React.ReactElement[] = [];
      for (let i = 0; i < count; i++) {
        const x = 10 + seededRandom(seed + i * 2) * 80;
        const y = 10 + seededRandom(seed + i * 2 + 1) * 80;
        const sizeVar = dotSize * (0.5 + seededRandom(seed + i * 3));
        dots.push(
          <circle key={i} cx={`${x}%`} cy={`${y}%`} r={`${sizeVar}%`} fill={color} opacity={opacity} />
        );
      }
      return <>{dots}</>;
    }
    
    default:
      return <circle cx="50%" cy="50%" r="45%" fill={color} opacity={opacity} />;
  }
}

interface ShapeProps {
  shape: ShapeType;
  index: number;
}

/**
 * Single Decorative Shape
 */
export function Shape({ shape, index }: ShapeProps): React.ReactElement {
  const size = shape.size ?? 20;
  const rotation = shape.rotation ?? 0;
  const blur = shape.blur ?? 0;
  const zIndex = shape.zIndex ?? 5;
  const posX = shape.posX ?? 50;
  const posY = shape.posY ?? 50;
  
  const transformParts = ['translate(-50%, -50%)'];
  if (rotation !== 0) {
    transformParts.push(`rotate(${rotation}deg)`);
  }
  
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${posX}%`,
    top: `${posY}%`,
    width: `${size}%`,
    aspectRatio: '1',
    transform: transformParts.join(' '),
    zIndex,
    pointerEvents: 'none',
    overflow: 'visible',
    ...(blur > 0 && { filter: `blur(${blur}px)` }),
  };
  
  const uniqueId = `shape-${index}`;
  
  return (
    <div style={containerStyle}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <ShapeSVG shape={shape} uniqueId={uniqueId} />
      </svg>
    </div>
  );
}

interface ShapesProps {
  shapes: ShapeType[] | undefined;
}

/**
 * Multiple Decorative Shapes
 */
export function Shapes({ shapes }: ShapesProps): React.ReactElement | null {
  if (!shapes || shapes.length === 0) return null;
  
  return (
    <>
      {shapes.map((shape, index) => (
        <Shape key={index} shape={shape} index={index} />
      ))}
    </>
  );
}
