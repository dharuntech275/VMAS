import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = `${title} | VMAS Food Delivery`;
    } else {
      document.title = 'VMAS - Fresh Food Packs Delivery';
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

export default useDocumentTitle;
