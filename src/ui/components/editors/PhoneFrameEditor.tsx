/**
 * PhoneFrameEditor — edit device model, screenshot image, scale, and position.
 */

import type { DevicePresetId, PhoneFrameLayerProps } from "@app-types";
import { getDevicePreset, getDevicePresetsForPlatform } from "@device-presets";
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
import { useAssets, useLayerSetter, useSelection } from "@hooks";
import { LAYER_DEFAULTS } from "@lib";
import { ImageSelect, Select, Slider } from "@ui/components/inputs/index.ts";
import { SectionHeading } from "./SectionHeading.tsx";
import { OpacitySlider, PositionControls } from "./PositionControls.tsx";

interface PhoneFrameEditorProps {
  layer: PhoneFrameLayerProps;
  onUpdate: (updates: Partial<PhoneFrameLayerProps>) => void;
}

const toOption = (p: { id: DevicePresetId; label: string }) => ({
  value: p.id,
  label: p.label,
});

export function PhoneFrameEditor(
  { layer, onUpdate }: PhoneFrameEditorProps,
) {
  const assets = useAssets();
  const selection = useSelection();

  // The preset an inheriting layer resolves to — feature graphics always
  // render in the Android export pass, so they inherit the Android default.
  const platformDefaultId = useAppStore((s) => {
    const selected = selectScreenshots(s, selection.lang, selection.platform)
      .find((x) => x.id === selection.screenshotId);
    const platform = selected?.role === "feature-graphic"
      ? "android"
      : selection.platform;
    return s.getDefaultDevicePreset(platform);
  });

  const set = useLayerSetter(onUpdate);

  const iosPresets = getDevicePresetsForPlatform("ios");
  const androidPresets = getDevicePresetsForPlatform("android");

  return (
    <div className="space-y-6">
      {/* ── Device ───────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeading>Device</SectionHeading>

        <Select<DevicePresetId | "">
          label="Model"
          value={layer.model ?? ""}
          onChange={(v) => set("model", v === "" ? undefined : v)}
          placeholder={`Platform default (${
            getDevicePreset(platformDefaultId).label
          })`}
          groups={[
            { label: "iOS", options: iosPresets.map(toOption) },
            { label: "Android", options: androidPresets.map(toOption) },
          ]}
        />
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
          value={layer.scale ?? LAYER_DEFAULTS["phone-frame"].scale}
          onChange={(v: number) => set("scale", v)}
          min={10}
          max={100}
          step={1}
          unit="%"
        />

        <PositionControls layer={layer} onChange={onUpdate} />
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
