export function ClipboardToast({
  visible,
  message = 'Copied to clipboard',
}: {
  visible: boolean;
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 border border-black bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-black shadow-[6px_6px_0_#111] transition-all duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
