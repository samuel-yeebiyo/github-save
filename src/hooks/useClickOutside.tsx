import { useEffect } from "react";
import type { MutableRefObject } from "react";

const useClickOutside = (
  ref: MutableRefObject<HTMLDivElement | null>,
  onClickOutside: () => void
): void => {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export default useClickOutside;
