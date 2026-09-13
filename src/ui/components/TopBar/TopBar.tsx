/**
 * TopBar — project switcher, language tabs, platform toggle, and the action
 * buttons. Each control is its own component with its own hooks and state;
 * the bar only lays them out (#70).
 *
 * All interactive elements use h-8 (32px) for consistent vertical rhythm.
 */

import { memo } from "react";
import { useAppStore } from "@ui/store/index.ts";
import { useAssets } from "@hooks";
import { cn } from "@ui/utils/cn.ts";
import { ProjectSwitcher } from "./ProjectSwitcher.tsx";
import { LanguageTabs } from "./LanguageTabs.tsx";
import { PlatformToggle } from "./PlatformToggle.tsx";
import { GenerateButton, LastResultsButton } from "./GenerateButton.tsx";

function Divider({ className }: { className?: string }) {
  return <div className={cn("w-px h-5 bg-zinc-700", className)} />;
}

function TopBarInner() {
  const assets = useAssets();
  const openModal = useAppStore((s) => s.openModal);

  return (
    <header className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 gap-1.5 shrink-0">
      <ProjectSwitcher />
      <Divider className="mx-1" />
      <LanguageTabs />
      <Divider className="mx-1" />
      <PlatformToggle />

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => openModal("theme")}
        className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-purple-400 transition-colors"
        title="Theme & Colors"
      >
        <i className="fa-solid fa-palette" />
      </button>

      <button
        type="button"
        onClick={() => openModal("media")}
        className="h-8 px-2.5 rounded text-sm hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
        title="Media Library"
      >
        <i className="fa-solid fa-images" />
        <span className="text-xs">{assets.images.length}</span>
      </button>

      <button
        type="button"
        onClick={() => openModal("shortcuts")}
        className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors"
        title="Keyboard Shortcuts (?)"
      >
        <i className="fa-solid fa-keyboard text-xs" />
      </button>

      <Divider className="mx-0.5" />

      <LastResultsButton />
      <GenerateButton />
    </header>
  );
}

/**
 * Memoised: the bar takes no props, so it re-renders only when one of its
 * own subscriptions changes — an edit in the canvas cannot reach it.
 */
export const TopBar = memo(TopBarInner);
