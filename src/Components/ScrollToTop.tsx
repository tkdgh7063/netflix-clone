import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isDetailPageOnly = matchPath(pathname, {
      path: ["/movie/:movieId/detail", "/tv/:tvId/detail"],
      exact: true,
    });

    if (isDetailPageOnly) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
