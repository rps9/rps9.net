import { useCallback, useEffect, useRef, useState } from 'react';

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
}

export function useClipboardToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Copied to clipboard');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string, nextMessage = 'Copied to clipboard') => {
    await copyText(text);
    setMessage(nextMessage);
    setVisible(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, 2500);
  }, []);

  return { copy, visible, message };
}
