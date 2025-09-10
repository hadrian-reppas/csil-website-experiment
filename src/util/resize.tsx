import { useEffect, useRef, type RefObject } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export const useResize = (
  resize: () => void,
  containerRef: RefObject<HTMLDivElement | null>,
  timeout = 40,
) => {
  const resizeRequestRef = useRef<Timeout | null>(null);

  const resizeAndClearRequestRef = () => {
    resize();
    resizeRequestRef.current = null;
  };

  const scheduleResize = () => {
    resizeRequestRef.current ??= setTimeout(resizeAndClearRequestRef, timeout);
  };

  useEffect(() => {
    if (containerRef.current !== null) {
      const observer = new ResizeObserver(scheduleResize);
      observer.observe(containerRef.current);
      const current = containerRef.current;
      return () => {
        observer.unobserve(current);
        if (resizeRequestRef.current !== null) {
          clearTimeout(resizeRequestRef.current);
        }
      };
    }
  });
};
