import { useMemo, useState } from "react";
import type { GenerateProgress, GenerateResult } from "@ui/types.ts";
import { useOpenOutputFolder } from "@hooks";
import { DEFAULT_DIMENSIONS, FEATURE_GRAPHIC_SIZE } from "@lib";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "@ui/components/primitives/index.ts";
import { cn } from "@ui/utils/cn.ts";

interface GenerateModalProps {
  progress: GenerateProgress;
  generating: boolean;
  onClose: () => void;
  onCancel: () => void;
}

interface PlatformResults {
  feature: GenerateResult | null;
  screenshots: GenerateResult[];
}

interface LanguageResults {
  android: PlatformResults;
  ios: PlatformResults;
}

type GroupedResults = Record<string, LanguageResults>;

/** CSS aspect-ratio value for a thumbnail box */
function aspect({ width, height }: { width: number; height: number }): string {
  return `${width} / ${height}`;
}

function langItemCount(data: LanguageResults): number {
  return (
    data.android.screenshots.length +
    (data.android.feature ? 1 : 0) +
    data.ios.screenshots.length
  );
}

export function GenerateModal(
  { progress, generating, onClose, onCancel }: GenerateModalProps,
) {
  const { current, total, item, results, error } = progress;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const isDone = !generating && (results !== null || error !== null);

  const successCount = results?.filter((r) => r.status === "success").length ||
    0;
  const failed = useMemo(
    () => results?.filter((r) => r.status === "error") ?? [],
    [results],
  );
  const errorCount = failed.length;

  // One cache-buster per result set, not per render: `Date.now()` inline in
  // the src made every thumbnail re-download whenever the modal re-rendered
  // — collapsing a language, toggling grid/list (#64). A new run brings a
  // new `results` array, which is exactly when the files may have changed.
  const cacheBuster = useMemo(() => Date.now(), [results]);

  const openFolder = useOpenOutputFolder();
  const [collapsedLangs, setCollapsedLangs] = useState<Set<string>>(new Set());
  const [showPreviews, setShowPreviews] = useState(true);

  const toggleLang = (lang: string) => {
    setCollapsedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang);
      else next.add(lang);
      return next;
    });
  };

  const groupedResults = useMemo<GroupedResults>(() => {
    if (!results) return {};

    const grouped: GroupedResults = {};

    results
      .filter((r) => r.status === "success")
      .forEach((r) => {
        const { language: lang, platform } = r;

        if (!grouped[lang]) {
          grouped[lang] = {
            android: { feature: null, screenshots: [] },
            ios: { feature: null, screenshots: [] },
          };
        }

        if (r.role === "feature-graphic" && platform === "android") {
          grouped[lang][platform].feature = r;
        } else {
          grouped[lang][platform].screenshots.push(r);
        }
      });

    return grouped;
  }, [results]);

  const languages = Object.keys(groupedResults);

  const renderPlatformSection = (
    platform: "android" | "ios",
    label: string,
    data: PlatformResults,
  ) => {
    if (!data.feature && data.screenshots.length === 0) return null;

    return (
      <div className="mb-3 last:mb-0">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5 font-medium">
          <i
            className={`fa-brands ${
              platform === "android" ? "fa-android" : "fa-apple"
            } text-xs`}
          />
          {label}
        </div>

        {showPreviews
          ? (
            <>
              {data.feature && (
                <div className="mb-2">
                  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
                    <img
                      src={`/output/${data.feature.relativePath}?t=${cacheBuster}`}
                      alt={data.feature.screenshotName || "Feature Graphic"}
                      className="w-full object-contain bg-zinc-800"
                      style={{ aspectRatio: aspect(FEATURE_GRAPHIC_SIZE) }}
                      loading="lazy"
                    />
                    <div
                      className="px-2.5 py-1.5 text-xs text-zinc-500 truncate border-t border-zinc-700/50"
                      title={data.feature.relativePath}
                    >
                      {data.feature.screenshotName || "Feature Graphic"}
                    </div>
                  </div>
                </div>
              )}

              {data.screenshots.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {data.screenshots.map((r) => (
                    <div
                      key={r.relativePath}
                      className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden"
                    >
                      <img
                        src={`/output/${r.relativePath}?t=${cacheBuster}`}
                        alt={r.screenshotName || r.relativePath}
                        className="w-full object-contain bg-zinc-800"
                        style={{
                          aspectRatio: aspect(DEFAULT_DIMENSIONS[platform]),
                        }}
                        loading="lazy"
                      />
                      <div
                        className="px-2 py-1 text-[11px] text-zinc-500 truncate border-t border-zinc-700/50"
                        title={r.relativePath}
                      >
                        {r.screenshotName || r.relativePath.split("/").pop()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
          : (
            <div className="space-y-0.5">
              {data.feature && (
                <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded hover:bg-zinc-800/50">
                  <i className="fa-solid fa-check text-[10px] text-zinc-500" />
                  <span className="text-zinc-300">
                    {data.feature.screenshotName || "Feature Graphic"}
                  </span>
                  <span className="text-zinc-600 truncate ml-auto text-[11px]">
                    {data.feature.relativePath}
                  </span>
                </div>
              )}
              {data.screenshots.map((r) => (
                <div
                  key={r.relativePath}
                  className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded hover:bg-zinc-800/50"
                >
                  <i className="fa-solid fa-check text-[10px] text-zinc-500" />
                  <span className="text-zinc-300">
                    {r.screenshotName || r.relativePath.split("/").pop()}
                  </span>
                  <span className="text-zinc-600 truncate ml-auto text-[11px]">
                    {r.relativePath}
                  </span>
                </div>
              ))}
            </div>
          )}
      </div>
    );
  };

  const title = error
    ? "Generation Failed"
    : isDone
    ? "Generation Complete"
    : "Generating...";

  const subtitle = !isDone
    ? <span className="block truncate max-w-[500px]">{item}</span>
    : !error
    ? (
      <>
        {successCount} {successCount === 1 ? "file" : "files"} generated
        {errorCount > 0 && (
          <span className="text-red-400 ml-1.5">
            &middot; {errorCount} failed
          </span>
        )}
      </>
    )
    : undefined;

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      icon={cn(
        "fa-solid fa-wand-magic-sparkles text-sm",
        error ? "text-red-400" : "text-indigo-400",
      )}
      size="xl"
      onClose={onClose}
      // A stray click must not hide a running export
      closeOnBackdrop={false}
      headerAction={!isDone && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      )}
    >
      {/* Progress bar — visible in both states */}
      <div className="px-5 pb-4">
        <div className="bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              error
                ? "bg-red-500"
                : isDone && errorCount > 0
                ? "bg-amber-500"
                : "bg-indigo-500",
            )}
            style={{ width: `${isDone && !error ? 100 : percent}%` }}
          />
        </div>
        {!isDone && (
          <div className="flex justify-end mt-1.5">
            <span className="text-[11px] text-zinc-600 tabular-nums">
              {current} / {total}
            </span>
          </div>
        )}
      </div>

      {/* Run-level failure: the export could not run at all */}
      {error && (
        <>
          <div className="mx-5 mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
            <div className="font-medium text-red-300 mb-0.5">
              The export could not run
            </div>
            <div className="text-xs text-red-300/80 break-words">{error}</div>
          </div>
          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors"
            >
              Close
            </button>
          </ModalFooter>
        </>
      )}

      {isDone && !error && (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 pb-3">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
              Results
            </span>
            <button
              type="button"
              onClick={() => setShowPreviews(!showPreviews)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <i
                className={`fa-solid ${
                  showPreviews ? "fa-th-large" : "fa-list"
                } text-[10px]`}
              />
              {showPreviews ? "Grid" : "List"}
            </button>
          </div>

          <ModalBody className="pb-2">
            {/* Failures first, with the real reason */}
            {failed.length > 0 && (
              <div className="mb-3">
                <div className="text-[11px] uppercase tracking-wider text-red-400 mb-1.5 font-medium">
                  Failed
                </div>
                <div className="space-y-1">
                  {failed.map((r) => (
                    <div
                      key={r.relativePath}
                      className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2 text-zinc-300">
                        <i className="fa-solid fa-triangle-exclamation text-[10px] text-red-400" />
                        <span>
                          {r.language}/{r.platform}: {r.screenshotName}
                        </span>
                      </div>
                      <div className="mt-0.5 pl-[18px] text-red-300/80 break-words">
                        {r.error}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results by language → platform */}
            {languages.map((lang) => {
              const langData = groupedResults[lang];
              const isCollapsed = collapsedLangs.has(lang);
              const count = langItemCount(langData);

              return (
                <div
                  key={lang}
                  className="mb-2 last:mb-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className="flex items-center gap-2 w-full text-left text-sm text-zinc-300 hover:text-white py-1.5 group"
                  >
                    <i
                      className={cn(
                        "fa-solid fa-chevron-right text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-transform",
                        !isCollapsed && "rotate-90",
                      )}
                    />
                    <span className="uppercase font-medium tracking-wide text-xs">
                      {lang}
                    </span>
                    <span className="text-[11px] text-zinc-600 font-normal">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </button>

                  {!isCollapsed && (
                    <div className="pl-5 mt-1">
                      {renderPlatformSection(
                        "android",
                        "Android",
                        langData.android,
                      )}
                      {renderPlatformSection(
                        "ios",
                        "iOS",
                        langData.ios,
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={() => openFolder.mutate()}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <i className="fa-solid fa-folder-open text-xs" /> Open in Explorer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors"
            >
              Done
            </button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
