import { useMemo, useState } from "react";
import type { GenerateProgress, GenerateResult } from "@ui/types.ts";
import { useOpenOutputFolder } from "@hooks";

interface GenerateModalProps {
  progress: GenerateProgress;
  generating: boolean;
  onClose: () => void;
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

function langItemCount(data: LanguageResults): number {
  return (
    data.android.screenshots.length +
    (data.android.feature ? 1 : 0) +
    data.ios.screenshots.length
  );
}

export function GenerateModal(
  { progress, generating, onClose }: GenerateModalProps,
) {
  const { current, total, item, results } = progress;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const isDone = !generating && results !== null;

  const successCount = results?.filter((r) => r.status === "success").length ||
    0;
  const errorCount = results?.filter((r) => r.status === "error").length || 0;

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
        const [lang, platform] = r.relativePath.split("/");

        if (!grouped[lang]) {
          grouped[lang] = {
            android: { feature: null, screenshots: [] },
            ios: { feature: null, screenshots: [] },
          };
        }

        if (platform === "android" || platform === "ios") {
          if (r.role === "feature-graphic" && platform === "android") {
            grouped[lang][platform].feature = r;
          } else {
            grouped[lang][platform].screenshots.push(r);
          }
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
                      src={`/output/${data.feature.relativePath}?t=${Date.now()}`}
                      className="w-full aspect-[1024/500] object-contain bg-zinc-800"
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
                        src={`/output/${r.relativePath}?t=${Date.now()}`}
                        className="w-full aspect-[1242/2688] object-contain bg-zinc-800"
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="bg-zinc-900 rounded-lg w-[700px] max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-bold text-lg">
              {isDone
                ? (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles text-sm text-indigo-400 mr-2" />
                    Generation Complete
                  </>
                )
                : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles text-sm text-indigo-400 mr-2" />
                    Generating...
                  </>
                )}
            </h2>
            {!isDone && (
              <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[500px]">
                {item}
              </p>
            )}
            {isDone && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {successCount} {successCount === 1 ? "file" : "files"} generated
                {errorCount > 0 && (
                  <span className="text-red-400 ml-1.5">
                    &middot; {errorCount} failed
                  </span>
                )}
              </p>
            )}
          </div>
          {isDone && (
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-500 hover:text-white text-xl p-1"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {/* Progress bar — visible in both states */}
        <div className="px-5 pb-4">
          <div className="bg-zinc-800 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDone
                  ? errorCount > 0 ? "bg-amber-500" : "bg-indigo-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${isDone ? 100 : percent}%` }}
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

        {isDone && (
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

            {/* Results by language → platform */}
            <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-2">
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
                        className={`fa-solid fa-chevron-right text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-transform ${
                          isCollapsed ? "" : "rotate-90"
                        }`}
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
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => openFolder.mutate()}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-folder-open text-xs" />{" "}
                Open in Explorer
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
