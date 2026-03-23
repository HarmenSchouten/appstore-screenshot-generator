/**
 * PhoneFrameEditor — edit device model, screenshot image, scale, and position.
 */

import { useCallback } from "react";
import type { PhoneFrameLayerProps } from "@types";
import { getAllDevicePresets } from "@device-presets";
import type { DevicePresetId } from "@types";
import { useAppStore } from "@ui/store/index.ts";
import { ImageSelect, Slider } from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";

interface PhoneFrameEditorProps {
  layer: PhoneFrameLayerProps;
  onUpdate: (updates: Partial<PhoneFrameLayerProps>) => void;
}

export function PhoneFrameEditor(
  { layer, onUpdate }: PhoneFrameEditorProps,
) {
  const assets = useAppStore((s) => s.assets);
  const refreshAssets = useAppStore((s) => s.refreshAssets);

  const set = useCallback(
    <K extends keyof PhoneFrameLayerProps>(
      key: K,
      value: PhoneFrameLayerProps[K],
    ) => onUpdate({ [key]: value }),
    [onUpdate],
  );

  const presets = getAllDevicePresets();
  const iosPresets = presets.filter((p) => p.platform === "ios");
  const androidPresets = presets.filter((p) => p.platform === "android");

  return (
    <div className="space-y-6">
      {/* ── Device ───────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Device</SectionHeading>

        <div>
          <label className="text-xs text-zinc-500 block mb-1.5">Model</label>
          <select
            value={layer.model}
            onChange={(e) =>
              set(
                "model",
                (e.target as HTMLSelectElement).value as DevicePresetId,
              )}
            className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-800 border border-zinc-700/60 text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <optgroup label="iOS">
              {iosPresets.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
            <optgroup label="Android">
              {androidPresets.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </section>

      {/* ── Screenshot ───────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Screenshot</SectionHeading>

        <ImageSelect
          label="Image"
          value={layer.imagePath ?? ""}
          onChange={(v: string) => set("imagePath", v)}
          options={assets.images}
          onAssetsRefresh={refreshAssets}
          placeholder="Select screenshot…"
        />
      </section>

      {/* ── Size & Position ──────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Size &amp; Position</SectionHeading>

        <Slider
          label="Scale"
          value={layer.scale ?? 70}
          onChange={(v: number) => set("scale", v)}
          min={10}
          max={100}
          step={1}
          unit="%"
        />

        <Slider
          label="Position X"
          value={layer.posX}
          onChange={(v: number) => set("posX", v)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <Slider
          label="Position Y"
          value={layer.posY}
          onChange={(v: number) => set("posY", v)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />

        <Slider
          label="Rotation"
          value={layer.rotation}
          onChange={(v: number) => set("rotation", v)}
          min={-180}
          max={180}
          step={1}
          unit="°"
        />
      </section>

      {/* ── Appearance ───────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Appearance</SectionHeading>

        <Slider
          label="Opacity"
          value={layer.opacity}
          onChange={(v: number) => set("opacity", v)}
          min={0}
          max={1}
          step={0.01}
        />
      </section>
    </div>
  );
}
