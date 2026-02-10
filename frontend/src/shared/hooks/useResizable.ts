import { useRef, useCallback, useEffect, useState } from 'react';

interface UseResizableOptions {
  minWidth?: number;
  maxWidth?: number;
  collapsedWidth?: number;
}

export const useResizable = ({ minWidth = 320, maxWidth = 900, collapsedWidth }: UseResizableOptions = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.width = minWidth + 'px';
  }, [])

  const toggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
    if (ref.current && collapsedWidth) {
      ref.current.style.width = !collapsed ? `${collapsedWidth - 10}px` : `${minWidth}px`;
    }
  }, [collapsed, collapsedWidth, minWidth]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const element = ref.current;
    if (!element) return;
    if (collapsed) return;

    const startX = e.clientX;
    const startWidth = element.getBoundingClientRect().width;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      let newWidth = startWidth + deltaX;

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      element.style.width = newWidth + 'px';
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [minWidth, maxWidth, collapsed]);

  return { ref, collapsed, toggleCollapse, onMouseDown };
};
