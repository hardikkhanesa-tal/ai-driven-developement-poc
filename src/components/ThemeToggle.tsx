export function ThemeToggle({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label="toggle theme"
      className="w-10 h-10 rounded-full grid place-items-center bg-slate-100 dark:bg-slate-700 text-lg transition hover:scale-110">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
