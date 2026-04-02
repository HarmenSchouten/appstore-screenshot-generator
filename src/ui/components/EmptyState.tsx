interface EmptyStateProps {
  title?: string;
  subtitle?: string;
}

export const EmptyState = ({
  title = "Select a screenshot or feature graphic to start editing",
  subtitle,
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
    </div>
  );
};
