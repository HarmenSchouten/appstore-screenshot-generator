/**
 * PhoneFrameEditor — edit device model, screenshot image, scale, and position.
 */

import { useCallback } from "react";
import type { PhoneFrameLayerProps } from "@app-types";
import { getAllDevicePresets, getDevicePreset } from "@device-presets";
import type { DevicePresetId } from "@app-types";
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
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

  // The preset an inheriting layer resolves to — feature graphics always
  // render in the Android export pass, so they inherit the Android default.
  const platformDefaultId = useAppStore((s) => {
    const selected = selectScreenshots(s).find(
      (x) => x.id === s.selectedScreenshotId,
    );
    const platform = selected?.role === "feature-graphic"
      ? "android"
      : s.selectedPlatform;
    return s.getDefaultDevicePreset(platform);
  });

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
            value={layer.model ?? ""}
            onChange={(e) => {
              const value = (e.target as HTMLSelectElement).value;
              set(
                "model",
                value === "" ? undefined : value as DevicePresetId,
              );
            }}
            className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-800 border border-zinc-700/60 text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="">
              Platform default ({getDevicePreset(platformDefaultId).label})
            </option>
            <optgroup
              label="iOS"
              style={{
                fontStyle: "normal",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "11px",
              }}
            >
              {iosPresets.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  style={{
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: "14px",
                  }}
                >
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup
              label="Android"
              style={{
                fontStyle: "normal",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "11px",
              }}
            >
              {androidPresets.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  style={{
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: "14px",
                  }}
                >
                  {p.label}
                </option>
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
