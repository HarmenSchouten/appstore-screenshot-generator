/**
 * The one shortcut table (#69): `useShortcut` binds an entry's `keys`, the
 * cheat sheet and the empty-state panel display the same string. A binding
 * that is not in here does not exist.
 */

export interface ShortcutDefinition {
  /**
   * Binding and display string, one and the same. Written as the character
   * the user sees: `"Shift+?"` matches the `?` key on any layout.
   */
  keys: string;
  /** Extra bindings for the same action, kept out of the cheat sheet. */
  altKeys?: string[];
  label: string;
  description: string;
  icon: string;
  /** Listed on the empty-state welcome panel. */
  showOnEmptyState?: boolean;
  /** Leave the browser's default for the key in place. */
  preventDefault?: boolean;
  /** Stay quiet while a text field has focus. */
  ignoreInputs?: boolean;
}

export const SHORTCUTS = {
  // Tier 1 - shown on EmptyState
  addScreenshot: {
    keys: "Mod+Shift+A",
    label: "New Screenshot",
    description: "Add a new screenshot to the current language/platform",
    icon: "fa-solid fa-plus",
    showOnEmptyState: true,
  },
  generateAll: {
    keys: "Mod+Shift+G",
    label: "Generate All",
    description: "Generate all screenshots for every language and platform",
    icon: "fa-solid fa-bolt",
    showOnEmptyState: true,
  },
  openThemeEditor: {
    keys: "Mod+Shift+E",
    label: "Theme Editor",
    description: "Open the theme editor to customize colors and typography",
    icon: "fa-solid fa-palette",
    showOnEmptyState: true,
  },
  openMediaManager: {
    keys: "Mod+Shift+M",
    label: "Media Manager",
    description: "Open the media manager to upload and manage assets",
    icon: "fa-solid fa-images",
    showOnEmptyState: true,
  },
  togglePlatform: {
    keys: "Mod+Shift+F",
    label: "Toggle Platform",
    description: "Switch between Android and iOS",
    icon: "fa-solid fa-mobile-screen-button",
    showOnEmptyState: true,
  },
  nextLanguage: {
    keys: "Mod+Shift+K",
    label: "Next Language",
    description: "Cycle to the next language in the project",
    icon: "fa-solid fa-globe",
    showOnEmptyState: true,
  },
  prevLanguage: {
    keys: "Mod+Shift+J",
    label: "Previous Language",
    description: "Cycle to the previous language in the project",
    icon: "fa-solid fa-globe",
  },
  // Tier 2 - power-user shortcuts
  openProjects: {
    keys: "Mod+Shift+P",
    label: "Manage Projects",
    description: "Open the project management modal",
    icon: "fa-solid fa-folder-open",
  },
  deleteScreenshot: {
    keys: "Delete",
    altKeys: ["Backspace"],
    label: "Delete Screenshot",
    description: "Delete the currently selected screenshot",
    icon: "fa-solid fa-trash",
    preventDefault: false,
    ignoreInputs: true,
  },
  openOutputFolder: {
    keys: "Mod+Shift+D",
    label: "Open Output",
    description: "Open the output folder in the file explorer",
    icon: "fa-solid fa-folder",
  },
  zoomIn: {
    keys: "=",
    label: "Zoom In",
    description: "Zoom into the preview",
    icon: "fa-solid fa-magnifying-glass-plus",
    preventDefault: false,
    ignoreInputs: true,
  },
  zoomOut: {
    keys: "-",
    label: "Zoom Out",
    description: "Zoom out of the preview",
    icon: "fa-solid fa-magnifying-glass-minus",
    preventDefault: false,
    ignoreInputs: true,
  },
  zoomReset: {
    keys: "0",
    label: "Reset View",
    description: "Reset the preview zoom to default",
    icon: "fa-solid fa-expand",
    preventDefault: false,
    ignoreInputs: true,
  },
  prevScreenshot: {
    keys: "[",
    label: "Previous Screenshot",
    description: "Select the previous screenshot in the list",
    icon: "fa-solid fa-arrow-left",
    preventDefault: false,
    ignoreInputs: true,
  },
  nextScreenshot: {
    keys: "]",
    label: "Next Screenshot",
    description: "Select the next screenshot in the list",
    icon: "fa-solid fa-arrow-right",
    preventDefault: false,
    ignoreInputs: true,
  },
  selectFeatureGraphic: {
    keys: "G",
    label: "Feature Graphic",
    description: "Select the feature graphic (Android only)",
    icon: "fa-solid fa-image",
    preventDefault: false,
    ignoreInputs: true,
  },
  closeOrDeselect: {
    keys: "Escape",
    label: "Close / Deselect",
    description: "Close the active modal or deselect the current screenshot",
    icon: "fa-solid fa-xmark",
    // Fires inside text fields too: a picker with an autofocused search
    // box still has to close
    preventDefault: false,
  },
  showShortcuts: {
    keys: "Shift+?",
    label: "Show Shortcuts",
    description: "Open the keyboard shortcuts cheat sheet",
    icon: "fa-solid fa-keyboard",
    ignoreInputs: true,
  },
} satisfies Record<string, ShortcutDefinition>;

export type ShortcutId = keyof typeof SHORTCUTS;

/** The table as a list, in cheat-sheet order. */
export const SHORTCUT_LIST: (ShortcutDefinition & { id: ShortcutId })[] =
  (Object.keys(SHORTCUTS) as ShortcutId[]).map((id) => ({
    id,
    ...SHORTCUTS[id],
  }));
