export function ClipboardToast({ visible }: { visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-md border border-blue-400/40 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-100 shadow-xl shadow-black/30 transition-all duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      Copied to clipboard
    </div>
  );
}
