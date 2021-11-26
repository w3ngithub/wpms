import { useEffect } from "react";

export const useOutSideClick = (
  elClasses = [],
  onOutsideClick,
  multipleActive = false
) => {
  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    const isClickInside =
      elClasses.filter((el) => {
        if (multipleActive) {
          for (
            let i = 0;
            i < document.getElementsByClassName(el).length;
            i += 1
          ) {
            if (document.getElementsByClassName(el)[i].contains(event.target)) {
              return true;
            }
          }
        }
        return document.getElementsByClassName(el)[0]?.contains(event.target);
      }).length > 0;
    if (!isClickInside) {
      onOutsideClick();
    }
  };
};
