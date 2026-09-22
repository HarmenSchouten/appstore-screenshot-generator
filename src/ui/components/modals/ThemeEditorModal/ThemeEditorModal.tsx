/**
 * ThemeEditor Modal Component
 *
 * Modal for editing theme colors, gradients, and typography. The three
 * sections are presentational; the modal owns the one draft they edit and
 * the save that merges it back onto the config.
 */

import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "@ui/components/primitives/index.ts";
import type { Config } from "@ui/types.ts";
import type { ColorPalette } from "@app-types";
import { useAppStore } from "@ui/store/index.ts";
import {
  applyPaletteToGradient,
  GRADIENT_TEMPLATES,
  matchGradientTemplate,
} from "@lib";
import { PaletteSection } from "./PaletteSection.tsx";
import { GradientPicker } from "./GradientPicker.tsx";
import { TypographySection } from "./TypographySection.tsx";

interface ThemeEditorModalProps {
  onClose: () => void;
  onSave: (newConfig: Config) => void;
}

/**
 * Everything the modal is editing. `selectedGradient` is a template id or
 * the `"custom"` sentinel — UI vocabulary, never stored.
 */
interface ThemeDraft {
  palette: ColorPalette;
  selectedGradient: string;
  customGradient: string;
  fontFamily: string;
  googleFontsUrl: string;
}

export function ThemeEditorModal({ onClose, onSave }: ThemeEditorModalProps) {
  // Read here rather than take a prop: this modal only mounts while it is
  // open, so App no longer has to subscribe to the whole config for it (#64).
  const config = useAppStore((s) => s.config);

  const [draft, setDraft] = useState<ThemeDraft>(() => {
    const palette = config.palette || {
      primary: "#a855f7",
      secondary: "#6366f1",
      accent: "#ec4899",
    };
    const gradient = config.theme?.background?.gradient || "";
    return {
      palette,
      // Matched against the saved palette once; editing the palette restyles
      // the tiles but never changes which one is selected
      selectedGradient: matchGradientTemplate(gradient, palette)?.id ??
        "custom",
      customGradient: gradient,
      fontFamily: config.theme?.fontFamily || "Inter, sans-serif",
      googleFontsUrl: config.theme?.googleFontsUrl || "",
    };
  });

  const patch = (updates: Partial<ThemeDraft>) =>
    setDraft((d) => ({ ...d, ...updates }));

  // Generate gradients from palette
  const gradients = GRADIENT_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    css: applyPaletteToGradient(t.template, draft.palette),
  }));

  const handleSave = () => {
    const gradient = draft.selectedGradient === "custom"
      ? draft.customGradient
      : gradients.find((g) => g.id === draft.selectedGradient)?.css ||
        draft.customGradient;

    // Merge onto the store's current config, not this render's: a save that
    // lands while the modal is open (auto-save retry, another edit) must not
    // be overwritten with a stale snapshot (#65)
    const current = useAppStore.getState().config;
    onSave({
      ...current,
      palette: draft.palette,
      theme: {
        ...current.theme,
        background: { gradient },
        fontFamily: draft.fontFamily,
        googleFontsUrl: draft.googleFontsUrl || undefined,
      },
    });
  };

  return (
    <Modal
      title="Theme & Colors"
      icon="fa-solid fa-palette"
      size="xl"
      onClose={onClose}
    >
      <ModalBody className="space-y-6 pt-1">
        <PaletteSection
          palette={draft.palette}
          onChange={(palette) => patch({ palette })}
        />

        <GradientPicker
          gradients={gradients}
          selected={draft.selectedGradient}
          custom={draft.customGradient}
          onSelect={(selectedGradient) => patch({ selectedGradient })}
          onCustomChange={(customGradient) => patch({ customGradient })}
        />

        <TypographySection
          fontFamily={draft.fontFamily}
          googleFontsUrl={draft.googleFontsUrl}
          onChange={(updates) => patch(updates)}
        />
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm"
        >
          <i className="fa-solid fa-check mr-1" /> Apply Theme
        </button>
      </ModalFooter>
    </Modal>
  );
}
