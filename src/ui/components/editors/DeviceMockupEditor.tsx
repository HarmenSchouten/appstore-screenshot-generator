/**
 * DeviceMockupEditor Component
 *
 * Combined editor for phone screenshot images, device preset selection,
 * and frame layout controls (scale, offset, rotation, gap).
 */

import { getDevicePresetsForPlatform, isDevicePresetId } from '../../../device-presets/index';
import { Slider, ImageSelect } from '../inputs/index';
import type { Screenshot, Assets, Config } from '../../types';

interface DeviceMockupEditorProps {
  screenshot: Screenshot;
  assets: Assets;
  config: Config;
  selectedPlatform: 'android' | 'ios';
  onUpdate: (updates: Partial<Screenshot>) => void;
  onAssetsRefresh: () => Promise<void>;
}

const INHERIT_VALUE = '__inherit__';

export function DeviceMockupEditor({
  screenshot,
  assets,
  config,
  selectedPlatform,
  onUpdate,
  onAssetsRefresh,
}: DeviceMockupEditorProps) {
  const isDual = Array.isArray(screenshot.imagePath);
  const devicePresets = getDevicePresetsForPlatform(selectedPlatform);
  const platformDefault = config.platformDefaults[selectedPlatform].defaultDevicePresetId;
  const isOverride = screenshot.phoneFrame?.deviceMode === 'override';
  const selectValue = isOverride
    ? (screenshot.phoneFrame?.devicePresetId ?? devicePresets[0]?.id ?? '')
    : INHERIT_VALUE;

  const defaultPresetLabel = devicePresets.find((p) => p.id === platformDefault)?.label ?? platformDefault;

  return (
    <div className="space-y-3">
      {/* Single / Dual toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (isDual) {
              onUpdate({ imagePath: (screenshot.imagePath as string[])[0] || '' });
            } else {
              onUpdate({ imagePath: [(screenshot.imagePath as string) || '', ''] });
            }
          }}
          className="text-xs px-3 py-1.5 bg-zinc-800 rounded hover:bg-zinc-700"
        >
          {isDual ? '← Single Phone' : 'Dual Phones →'}
        </button>
      </div>

      {/* Screenshot image(s) */}
      {isDual ? (
        <div className="space-y-3">
          <ImageSelect
            label="Left Phone"
            value={(screenshot.imagePath as string[])[0] || ''}
            onChange={(v) => onUpdate({ imagePath: [v, (screenshot.imagePath as string[])[1] || ''] })}
            options={assets.screenshots || []}
            category="screenshots"
            onAssetsRefresh={onAssetsRefresh}
          />
          <ImageSelect
            label="Right Phone"
            value={(screenshot.imagePath as string[])[1] || ''}
            onChange={(v) => onUpdate({ imagePath: [(screenshot.imagePath as string[])[0] || '', v] })}
            options={assets.screenshots || []}
            category="screenshots"
            onAssetsRefresh={onAssetsRefresh}
          />
        </div>
      ) : (
        <ImageSelect
          value={(screenshot.imagePath as string) || ''}
          onChange={(v) => onUpdate({ imagePath: v })}
          options={assets.screenshots || []}
          category="screenshots"
          onAssetsRefresh={onAssetsRefresh}
        />
      )}

      {/* Device preset dropdown */}
      <div>
        <label className="text-xs text-zinc-500 block mb-1">Device</label>
        <select
          value={selectValue}
          onChange={(e) => {
            const val = (e.target as HTMLSelectElement).value;
            if (val === INHERIT_VALUE) {
              onUpdate({
                phoneFrame: {
                  ...screenshot.phoneFrame,
                  deviceMode: 'inherit',
                  devicePresetId: undefined,
                },
              });
            } else if (isDevicePresetId(val)) {
              onUpdate({
                phoneFrame: {
                  ...screenshot.phoneFrame,
                  deviceMode: 'override',
                  devicePresetId: val,
                },
              });
            }
          }}
          className="w-full px-3 py-2 rounded text-sm"
        >
          <option value={INHERIT_VALUE}>
            Default ({defaultPresetLabel})
          </option>
          {devicePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {/* Frame layout sliders */}
      <div className="grid grid-cols-2 gap-3">
        <Slider
          label="Scale"
          value={screenshot.phoneFrame?.scale ?? (isDual ? 42 : 70)}
          onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, scale: v } })}
          min={isDual ? 30 : 50}
          max={100}
          step={1}
          unit="%"
        />
        <Slider
          label="Bottom Offset"
          value={screenshot.phoneFrame?.bottomOffset ?? 6}
          onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, bottomOffset: v } })}
          min={0}
          max={100}
          step={1}
          unit="%"
        />
        {isDual && (
          <>
            <Slider
              label="Rotation"
              value={screenshot.phoneFrame?.dualRotation ?? 6}
              onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualRotation: v } })}
              min={0}
              max={15}
              step={1}
              unit="°"
            />
            <Slider
              label="Gap"
              value={screenshot.phoneFrame?.dualGap ?? 2}
              onChange={(v) => onUpdate({ phoneFrame: { ...screenshot.phoneFrame, dualGap: v } })}
              min={0}
              max={10}
              step={0.5}
              unit="%"
            />
          </>
        )}
      </div>
    </div>
  );
}
