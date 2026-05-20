export default function StatusBadge({
  children,
  activeTheme,
  variant = "accent",
}) {
  const variantStyles = {
    accent: `${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.accentText}`,
    success: `${activeTheme.successBorder} ${activeTheme.successBg} ${activeTheme.successText}`,
    danger: `${activeTheme.dangerBorder} ${activeTheme.dangerBg} ${activeTheme.dangerText}`,
  }

  return (
    <div
      className={`inline-block rounded-lg border px-3 py-1 text-xs ${variantStyles[variant]}`}
    >
      {children}
    </div>
  )
}