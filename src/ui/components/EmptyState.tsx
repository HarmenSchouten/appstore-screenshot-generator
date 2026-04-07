import { APP_SHORTCUTS } from "@hooks";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import { useAppStore } from "@ui/store/index.ts";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showShortcuts?: boolean;
}

const emptyStateShortcuts = APP_SHORTCUTS.filter((s) => s.showOnEmptyState);

export const EmptyState = ({
  title = "Select a screenshot or feature graphic to start editing",
  subtitle,
  showShortcuts = true,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes icon-pulse {
              0%, 20%, 100% { opacity: 0.2; filter: drop-shadow(0 0 0px transparent); }
              8%, 12% { opacity: 1; filter: drop-shadow(0 0 12px var(--glow)); }
            }
            .orbit-icon {
              animation: icon-pulse 6s ease-in-out infinite;
            }
            .center-icon {
              transition: color 0.3s, filter 0.3s;
            }
            .center-icon:hover {
              color: rgb(161 161 170); /* zinc-400 */
              filter: drop-shadow(0 0 24px rgba(161, 161, 170, 0.5));
            }
          `,
        }}
      />
      {/* Decorative layer icons */}
      <div className="relative w-64 h-64">
        {/* Central icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="center-icon fa-solid fa-layer-group text-7xl text-zinc-700 cursor-pointer" />
        </div>
        {/* Orbiting layer icons — light up sequentially */}
        <i
          className="orbit-icon fa-solid fa-fill-drip absolute top-0 left-1/2 -translate-x-1/2 text-violet-400 text-3xl"
          style={{
            "--glow": "#8b5cf6",
            animationDelay: "0s",
          } as React.CSSProperties}
        />
        <i
          className="orbit-icon fa-solid fa-font absolute top-10 right-1 text-sky-400 text-2xl"
          style={{
            "--glow": "#38bdf8",
            animationDelay: "1s",
          } as React.CSSProperties}
        />
        <i
          className="orbit-icon fa-solid fa-mobile-screen-button absolute bottom-10 right-0 text-emerald-400 text-3xl"
          style={{
            "--glow": "#34d399",
            animationDelay: "2s",
          } as React.CSSProperties}
        />
        <i
          className="orbit-icon fa-solid fa-image absolute bottom-0 left-1/2 -translate-x-1/2 text-amber-400 text-2xl"
          style={{
            "--glow": "#fbbf24",
            animationDelay: "3s",
          } as React.CSSProperties}
        />
        <i
          className="orbit-icon fa-solid fa-sun absolute bottom-10 left-0 text-pink-400 text-3xl"
          style={{
            "--glow": "#f472b6",
            animationDelay: "4s",
          } as React.CSSProperties}
        />
        <i
          className="orbit-icon fa-solid fa-shapes absolute top-10 left-1 text-orange-400 text-2xl"
          style={{
            "--glow": "#fb923c",
            animationDelay: "5s",
          } as React.CSSProperties}
        />
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-sm text-zinc-500">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-zinc-600">
            {subtitle}
          </p>
        )}
      </div>

      {showShortcuts && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-md">
            {emptyStateShortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg"
              >
                <i
                  className={`${shortcut.icon} text-zinc-500 text-sm w-4 text-center`}
                />
                <span className="text-xs text-zinc-400 flex-1">
                  {shortcut.label}
                </span>
                <kbd className="bg-zinc-700 rounded px-1.5 py-0.5 text-[11px] font-mono text-zinc-300 shrink-0">
                  {formatForDisplay(shortcut.keys)}
                </kbd>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => useAppStore.getState().openShortcutCheatSheet()}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Show all shortcuts
            <kbd className="ml-1.5 bg-zinc-800 rounded px-1 py-0.5 text-[10px] font-mono text-zinc-500">
              ?
            </kbd>
          </button>
        </>
      )}
    </div>
  );
};
