export default function SectionCard({
  children,
  activeTheme,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-3xl border
        ${activeTheme.cardBorder}
        ${activeTheme.cardBg}
        p-6
        backdrop-blur
        ${className}
      `}
    >
      {children}
    </div>
  )
}