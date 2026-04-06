export interface ShortcutDefinition {
  id: string;
  keys: string;
  label: string;
  description: string;
  icon: string;
  showOnEmptyState: boolean;
}

export const APP_SHORTCUTS: ShortcutDefinition[] = [
  // Tier 1 — shown on EmptyState
  {
    id: "add-screenshot",
    keys: "Mod+Shift+A",
    label: "New Screenshot",
    description: "Add a new screenshot to the current language/platform",
    icon: "fa-solid fa-plus",
    showOnEmptyState: true,
  },
  {
    id: "generate-all",
    keys: "Mod+Shift+G",
    label: "Generate All",
    description: "Generate all screenshots for every language and platform",
    icon: "fa-solid fa-bolt",
    showOnEmptyState: true,
  },
  {
    id: "open-theme-editor",
    keys: "Mod+Shift+E",
    label: "Theme Editor",
    description: "Open the theme editor to customize colors and typography",
    icon: "fa-solid fa-palette",
    showOnEmptyState: true,
  },
  {
    id: "open-media-manager",
    keys: "Mod+Shift+M",
    label: "Media Manager",
    description: "Open the media manager to upload and manage assets",
    icon: "fa-solid fa-images",
    showOnEmptyState: true,
  },
  {
    id: "toggle-platform",
    keys: "Mod+Shift+F",
    label: "Toggle Platform",
    description: "Switch between Android and iOS",
    icon: "fa-solid fa-mobile-screen-button",
    showOnEmptyState: true,
  },
  {
    id: "cycle-language",
    keys: "Mod+Shift+K",
    label: "Next Language",
    description: "Cycle to the next language in the project",
    icon: "fa-solid fa-globe",
    showOnEmptyState: true,
  },
  // Tier 2 — power-user shortcuts
  {
    id: "open-project-modal",
    keys: "Mod+Shift+P",
    label: "Manage Projects",
    description: "Open the project management modal",
    icon: "fa-solid fa-folder-open",
    showOnEmptyState: false,
  },
  {
    id: "delete-screenshot",
    keys: "Delete",
    label: "Delete Screenshot",
    description: "Delete the currently selected screenshot",
    icon: "fa-solid fa-trash",
    showOnEmptyState: false,
  },
  {
    id: "open-output-folder",
    keys: "Mod+Shift+D",
    label: "Open Output",
    description: "Open the output folder in the file explorer",
    icon: "fa-solid fa-folder",
    showOnEmptyState: false,
  },
  {
    id: "view-last-generated",
    keys: "Mod+Shift+L",
    label: "Last Generated",
    description: "View the last generated results",
    icon: "fa-solid fa-eye",
    showOnEmptyState: false,
  },
  {
    id: "zoom-in",
    keys: "=",
    label: "Zoom In",
    description: "Zoom into the preview",
    icon: "fa-solid fa-magnifying-glass-plus",
    showOnEmptyState: false,
  },
  {
    id: "zoom-out",
    keys: "-",
    label: "Zoom Out",
    description: "Zoom out of the preview",
    icon: "fa-solid fa-magnifying-glass-minus",
    showOnEmptyState: false,
  },
  {
    id: "zoom-reset",
    keys: "0",
    label: "Reset View",
    description: "Reset the preview zoom to default",
    icon: "fa-solid fa-expand",
    showOnEmptyState: false,
  },
  {
    id: "select-screenshot",
    keys: "1-9",
    label: "Select Screenshot",
    description: "Jump to a screenshot by its position number",
    icon: "fa-solid fa-hashtag",
    showOnEmptyState: false,
  },
  {
    id: "select-feature-graphic",
    keys: "G",
    label: "Feature Graphic",
    description: "Select the feature graphic (Android only)",
    icon: "fa-solid fa-image",
    showOnEmptyState: false,
  },
  {
    id: "close-or-deselect",
    keys: "Escape",
    label: "Close / Deselect",
    description: "Close the active modal or deselect the current screenshot",
    icon: "fa-solid fa-xmark",
    showOnEmptyState: false,
  },
  {
    id: "show-shortcuts",
    keys: "Shift+?",
    label: "Show Shortcuts",
    description: "Open the keyboard shortcuts cheat sheet",
    icon: "fa-solid fa-keyboard",
    showOnEmptyState: false,
  },
];
