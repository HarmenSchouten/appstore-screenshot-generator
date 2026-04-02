/**
 * LanguagePicker Component
 *
 * Modal for adding new languages with flag emoji, search, and copy option.
 * Also used to export getFlagForCode for language tab display.
 */

import { useEffect, useRef, useState } from "react";

/** Common app-store languages with flag emoji and display name. */
const LANGUAGES = [
  { code: "en", flag: "\u{1F1EC}\u{1F1E7}", name: "English" },
  { code: "es", flag: "\u{1F1EA}\u{1F1F8}", name: "Spanish" },
  { code: "fr", flag: "\u{1F1EB}\u{1F1F7}", name: "French" },
  { code: "de", flag: "\u{1F1E9}\u{1F1EA}", name: "German" },
  { code: "it", flag: "\u{1F1EE}\u{1F1F9}", name: "Italian" },
  { code: "pt", flag: "\u{1F1E7}\u{1F1F7}", name: "Portuguese" },
  { code: "nl", flag: "\u{1F1F3}\u{1F1F1}", name: "Dutch" },
  { code: "pl", flag: "\u{1F1F5}\u{1F1F1}", name: "Polish" },
  { code: "ru", flag: "\u{1F1F7}\u{1F1FA}", name: "Russian" },
  { code: "uk", flag: "\u{1F1FA}\u{1F1E6}", name: "Ukrainian" },
  { code: "tr", flag: "\u{1F1F9}\u{1F1F7}", name: "Turkish" },
  { code: "ar", flag: "\u{1F1F8}\u{1F1E6}", name: "Arabic" },
  { code: "hi", flag: "\u{1F1EE}\u{1F1F3}", name: "Hindi" },
  { code: "ja", flag: "\u{1F1EF}\u{1F1F5}", name: "Japanese" },
  { code: "ko", flag: "\u{1F1F0}\u{1F1F7}", name: "Korean" },
  { code: "zh", flag: "\u{1F1E8}\u{1F1F3}", name: "Chinese" },
  { code: "th", flag: "\u{1F1F9}\u{1F1ED}", name: "Thai" },
  { code: "vi", flag: "\u{1F1FB}\u{1F1F3}", name: "Vietnamese" },
  { code: "id", flag: "\u{1F1EE}\u{1F1E9}", name: "Indonesian" },
  { code: "ms", flag: "\u{1F1F2}\u{1F1FE}", name: "Malay" },
  { code: "sv", flag: "\u{1F1F8}\u{1F1EA}", name: "Swedish" },
  { code: "da", flag: "\u{1F1E9}\u{1F1F0}", name: "Danish" },
  { code: "no", flag: "\u{1F1F3}\u{1F1F4}", name: "Norwegian" },
  { code: "fi", flag: "\u{1F1EB}\u{1F1EE}", name: "Finnish" },
  { code: "cs", flag: "\u{1F1E8}\u{1F1FF}", name: "Czech" },
  { code: "ro", flag: "\u{1F1F7}\u{1F1F4}", name: "Romanian" },
  { code: "el", flag: "\u{1F1EC}\u{1F1F7}", name: "Greek" },
  { code: "he", flag: "\u{1F1EE}\u{1F1F1}", name: "Hebrew" },
  { code: "hu", flag: "\u{1F1ED}\u{1F1FA}", name: "Hungarian" },
  { code: "sk", flag: "\u{1F1F8}\u{1F1F0}", name: "Slovak" },
  { code: "bg", flag: "\u{1F1E7}\u{1F1EC}", name: "Bulgarian" },
  { code: "hr", flag: "\u{1F1ED}\u{1F1F7}", name: "Croatian" },
  {
    code: "ca",
    flag: "\u{1F3F4}\u{E0065}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
    name: "Catalan",
  },
  { code: "fil", flag: "\u{1F1F5}\u{1F1ED}", name: "Filipino" },
] as const;

/** Look up flag emoji for a language code. */
export function getFlagForCode(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.flag ?? "\u{1F310}";
}

interface LanguagePickerProps {
  existingLanguages: string[];
  currentLanguage: string;
  onAdd: (code: string, copyFrom: string | null) => void;
  onClose: () => void;
}

export function LanguagePicker(
  { existingLanguages, currentLanguage, onAdd, onClose }: LanguagePickerProps,
) {
  const [search, setSearch] = useState("");
  const [copyFromCurrent, setCopyFromCurrent] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  const existing = new Set(existingLanguages.map((l) => l.toLowerCase()));
  const query = search.toLowerCase().trim();

  const filtered = LANGUAGES.filter((lang) => {
    if (existing.has(lang.code)) return false;
    if (!query) return true;
    return lang.code.includes(query) ||
      lang.name.toLowerCase().includes(query);
  });

  // Custom code: show option if query looks like a language code not in the list
  const isCustomCode = query.length >= 2 && query.length <= 3 &&
    /^[a-z]+$/.test(query) &&
    !LANGUAGES.some((l) => l.code === query) &&
    !existing.has(query);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleAdd = (code: string) => {
    onAdd(code, copyFromCurrent ? currentLanguage : null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg w-[480px] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-5 pb-3">
          <h2 className="font-bold text-lg">Add Language</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by language or code..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Copy option */}
        {existingLanguages.length > 0 && (
          <div className="px-5 pb-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none p-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <input
                type="checkbox"
                checked={copyFromCurrent}
                onChange={(e) => setCopyFromCurrent(e.target.checked)}
                className="rounded accent-indigo-500 w-4 h-4"
              />
              <div>
                <span className="text-sm text-zinc-300">
                  Copy screenshots from current language
                </span>
                <span className="text-xs text-zinc-500 ml-1.5">
                  ({currentLanguage.toUpperCase()})
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Language grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {filtered.length === 0 && !isCustomCode && (
            <div className="py-8 text-sm text-zinc-500 text-center">
              {query
                ? "No matching languages found"
                : "All available languages already added"}
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => handleAdd(lang.code)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors text-left group"
              >
                <span className="text-xl leading-none">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200 group-hover:text-white">
                    {lang.name}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase">
                    {lang.code}
                  </div>
                </div>
                <i className="fa-solid fa-plus text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>

          {/* Custom code option */}
          {isCustomCode && (
            <>
              {filtered.length > 0 && (
                <div className="border-t border-zinc-700 my-2" />
              )}
              <button
                type="button"
                onClick={() => handleAdd(query)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-zinc-800 border border-dashed border-zinc-700 transition-colors text-left group"
              >
                <span className="text-xl leading-none">
                  {getFlagForCode("")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200 group-hover:text-white">
                    Add custom language
                  </div>
                  <div className="text-xs text-zinc-500 uppercase">{query}</div>
                </div>
                <i className="fa-solid fa-plus text-xs text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
