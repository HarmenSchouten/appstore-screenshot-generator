/**
 * TypographySection — the font stack and the optional Google Fonts import
 * that has to load it.
 */

interface TypographySectionProps {
  fontFamily: string;
  googleFontsUrl: string;
  onChange: (updates: { fontFamily?: string; googleFontsUrl?: string }) => void;
}

export function TypographySection({
  fontFamily,
  googleFontsUrl,
  onChange,
}: TypographySectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Typography</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">
            Font Family
          </label>
          <input
            type="text"
            value={fontFamily}
            onInput={(e) =>
              onChange({ fontFamily: (e.target as HTMLInputElement).value })}
            className="input"
            placeholder="Inter, sans-serif"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">
            Google Fonts URL (optional)
          </label>
          <input
            type="text"
            value={googleFontsUrl}
            onInput={(e) =>
              onChange({
                googleFontsUrl: (e.target as HTMLInputElement).value,
              })}
            className="input font-mono"
            placeholder="@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');"
          />
        </div>
      </div>
    </div>
  );
}
