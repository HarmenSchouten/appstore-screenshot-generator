/**
 * TextEditor — edit text content, typography, color, and position.
 *
 * Uses the project theme's fontFamily for preview coherence.
 * All fields are optional and fall back to sensible defaults.
 */

import type { TextLayerProps } from "@app-types";
import { useLayerSetter } from "@hooks";
import {
  ColorInput,
  SegmentedControl,
  Slider,
} from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";
import { OpacitySlider, PositionControls } from "./PositionControls.tsx";

interface TextEditorProps {
  layer: TextLayerProps;
  onUpdate: (updates: Partial<TextLayerProps>) => void;
}

// ── Option lists ────────────────────────────────────────────

const WEIGHT_OPTIONS: { value: number; label: string }[] = [
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra" },
];

const ALIGN_OPTIONS: {
  value: "left" | "center" | "right";
  label: string;
  icon: string;
}[] = [
  { value: "left", label: "Left", icon: "fa-solid fa-align-left" },
  { value: "center", label: "Center", icon: "fa-solid fa-align-center" },
  { value: "right", label: "Right", icon: "fa-solid fa-align-right" },
];

const TRANSFORM_OPTIONS: {
  value: "none" | "uppercase" | "capitalize";
  label: string;
}[] = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "ABC" },
  { value: "capitalize", label: "Abc" },
];

// ── Component ───────────────────────────────────────────────

export function TextEditor({ layer, onUpdate }: TextEditorProps) {
  const set = useLayerSetter(onUpdate);

  return (
    <div className="space-y-6">
      {/* ── Content ──────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Content</SectionHeading>
        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Text</label>
          <textarea
            value={layer.text}
            onChange={(e) => set("text", e.target.value)}
            rows={3}
            placeholder="Enter text…"
            className="input resize-y"
          />
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Typography</SectionHeading>

        <Slider
          label="Font Size"
          value={layer.fontSize ?? 48}
          onChange={(v: number) => set("fontSize", v)}
          min={12}
          max={150}
          step={1}
          unit="px"
        />

        <SegmentedControl
          label="Weight"
          options={WEIGHT_OPTIONS}
          value={layer.fontWeight ?? 700}
          onChange={(v: number) => set("fontWeight", v)}
        />

        <SegmentedControl
          label="Alignment"
          options={ALIGN_OPTIONS}
          value={layer.textAlign ?? "center"}
          onChange={(v: "left" | "center" | "right") => set("textAlign", v)}
        />

        <SegmentedControl
          label="Transform"
          options={TRANSFORM_OPTIONS}
          value={layer.textTransform ?? "none"}
          onChange={(v: "none" | "uppercase" | "capitalize") =>
            set("textTransform", v)}
        />

        <Slider
          label="Line Height"
          value={layer.lineHeight ?? 1.2}
          onChange={(v: number) => set("lineHeight", v)}
          min={0.8}
          max={2.5}
          step={0.05}
        />

        <Slider
          label="Letter Spacing"
          value={layer.letterSpacing ?? 0}
          onChange={(v: number) => set("letterSpacing", v)}
          min={-2}
          max={10}
          step={0.5}
          unit="px"
        />

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Color</label>
          <ColorInput
            value={layer.textColor ?? "#ffffff"}
            onChange={(c: string) => set("textColor", c)}
          />
        </div>
      </section>

      {/* ── Position & Layout ────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Position &amp; Layout</SectionHeading>

        <PositionControls layer={layer} onChange={onUpdate} />

        <Slider
          label="Padding"
          value={layer.horizontalPadding ?? 6}
          onChange={(v: number) => set("horizontalPadding", v)}
          min={0}
          max={30}
          step={1}
          unit="%"
        />
      </section>

      {/* ── Appearance ───────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Appearance</SectionHeading>

        <OpacitySlider
          value={layer.opacity}
          onChange={(v) => set("opacity", v)}
        />
      </section>
    </div>
  );
}
