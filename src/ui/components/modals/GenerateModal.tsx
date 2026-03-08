/**
 * GenerateModal Component
 * 
 * Modal showing generation progress and results with image previews.
 */

import { useMemo } from 'preact/hooks';
import type { GenerateProgress, GenerateResult } from '../../types.ts';

interface GenerateModalProps {
  progress: GenerateProgress;
  generating: boolean;
  onClose: () => void;
}

interface GroupedResults {
  android: { feature: GenerateResult | null; screenshots: GenerateResult[] };
  ios: { feature: GenerateResult | null; screenshots: GenerateResult[] };
}

export function GenerateModal({ progress, generating, onClose }: GenerateModalProps) {
  const { current, total, item, results } = progress;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const isDone = !generating && results !== null;
  
  const successCount = results?.filter((r) => r.status === 'success').length || 0;
  const errorCount = results?.filter((r) => r.status === 'error').length || 0;

  // Group results by platform and type
  const groupedResults = useMemo<GroupedResults>(() => {
    if (!results) {
      return {
        android: { feature: null, screenshots: [] },
        ios: { feature: null, screenshots: [] },
      };
    }

    const grouped: GroupedResults = {
      android: { feature: null, screenshots: [] },
      ios: { feature: null, screenshots: [] },
    };

    results
      .filter((r) => r.status === 'success')
      .forEach((r) => {
        const parts = r.relativePath.split('/');
        const platform = parts[1]; // lang/platform/filename
        const filename = parts[parts.length - 1];

        if (platform === 'android' || platform === 'ios') {
          if (filename.includes('feature-graphic')) {
            grouped[platform].feature = r;
          } else {
            grouped[platform].screenshots.push(r);
          }
        }
      });

    return grouped;
  }, [results]);

  const openFolder = async () => {
    await fetch('/api/open-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  };

  const renderPlatformSection = (platform: 'android' | 'ios', label: string) => {
    const data = groupedResults[platform];
    if (!data.feature && data.screenshots.length === 0) return null;

    return (
      <div class="mb-4">
        <div class="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
          <i class={`fa-brands ${platform === 'android' ? 'fa-android' : 'fa-apple'}`} />
          {label}
        </div>

        {data.feature && (
          <div class="mb-3">
            <div class="bg-zinc-800 rounded overflow-hidden">
              <img
                src={`/output/${data.feature.relativePath}?t=${Date.now()}`}
                class="w-full aspect-[1024/500] object-contain bg-zinc-700"
                loading="lazy"
              />
              <div class="p-2 text-xs text-zinc-400 truncate" title={data.feature.relativePath}>
                Feature Graphic
              </div>
            </div>
          </div>
        )}

        {data.screenshots.length > 0 && (
          <div class="grid grid-cols-4 gap-2">
            {data.screenshots.map((r) => (
              <div key={r.relativePath} class="bg-zinc-800 rounded overflow-hidden">
                <img
                  src={`/output/${r.relativePath}?t=${Date.now()}`}
                  class="w-full aspect-[1242/2688] object-contain bg-zinc-700"
                  loading="lazy"
                />
                <div class="p-1.5 text-xs text-zinc-400 truncate" title={r.relativePath}>
                  {r.relativePath.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        class="bg-zinc-900 rounded-lg p-6 w-[700px] max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-bold text-lg">
            {isDone ? 'Generation Complete' : 'Generating Screenshots...'}
          </h2>
          {isDone && (
            <button onClick={onClose} class="text-zinc-500 hover:text-white text-xl">
              <i class="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {!isDone ? (
          // Progress View
          <div class="space-y-4">
            <div class="bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                class="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-zinc-400 truncate max-w-[400px]">{item}</span>
              <span class="text-zinc-500">
                {current} / {total}
              </span>
            </div>
          </div>
        ) : (
          // Results View
          <div class="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Summary */}
            <div class="flex gap-4 mb-4">
              <div class="flex-1 bg-green-900/30 border border-green-800 rounded p-3 text-center">
                <div class="text-2xl font-bold text-green-400">{successCount}</div>
                <div class="text-xs text-green-500">Successful</div>
              </div>
              {errorCount > 0 && (
                <div class="flex-1 bg-red-900/30 border border-red-800 rounded p-3 text-center">
                  <div class="text-2xl font-bold text-red-400">{errorCount}</div>
                  <div class="text-xs text-red-500">Failed</div>
                </div>
              )}
            </div>

            {/* Image Previews by Platform */}
            <div class="flex-1 overflow-y-auto min-h-0 pr-2">
              {renderPlatformSection('android', 'Android')}
              {renderPlatformSection('ios', 'iOS')}
            </div>

            {/* Actions */}
            <div class="flex gap-3 mt-4 pt-4 border-t border-zinc-800">
              <button
                onClick={openFolder}
                class="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-folder-open" /> Open in Explorer
              </button>
              <button
                onClick={onClose}
                class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
