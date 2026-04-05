interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const btnClass =
  "w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors";

export function ZoomControls(
  { onZoomIn, onZoomOut, onReset }: ZoomControlsProps,
) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-full shadow-lg px-1 py-1">
      <button
        type="button"
        onClick={onZoomOut}
        title="Zoom out"
        className={btnClass}
      >
        <i className="fa-solid fa-minus text-xs" />
      </button>
      <div className="w-px h-4 bg-zinc-700" />
      <button
        type="button"
        onClick={onReset}
        title="Reset zoom"
        className={btnClass}
      >
        <i className="fa-solid fa-expand text-xs" />
      </button>
      <div className="w-px h-4 bg-zinc-700" />
      <button
        type="button"
        onClick={onZoomIn}
        title="Zoom in"
        className={btnClass}
      >
        <i className="fa-solid fa-plus text-xs" />
      </button>
    </div>
  );
}
