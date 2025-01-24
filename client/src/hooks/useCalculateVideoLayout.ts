import { useEffect, RefObject } from 'react';
import { calculateLayout } from '@/utils/layoutHelper';

export const useCalculateVideoLayout = (gallery: RefObject<HTMLElement | null>, videoCount: number) => {
  useEffect(() => {
    const recalculateLayout = () => {
      const headerElement = document.getElementsByTagName('header')?.[0];
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const aspectRatio = 16 / 9;

      const screenWidth = document.body.getBoundingClientRect().width;
      const screenHeight = document.body.getBoundingClientRect().height - headerHeight;

      const { width, height, cols } = calculateLayout(screenWidth, screenHeight, videoCount, aspectRatio);

      if (gallery.current) {
        gallery.current.style.setProperty('--width', width + 'px');
        gallery.current.style.setProperty('--height', height + 'px');
        gallery.current.style.setProperty('--cols', cols.toString());
      }
    };

    recalculateLayout();

    window.addEventListener('resize', recalculateLayout);

    return () => {
      window.removeEventListener('resize', recalculateLayout);
    };
  }, [gallery, videoCount]);
};