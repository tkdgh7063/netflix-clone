import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useIsFetching } from "react-query";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import MovieModal from "../Components/movie/MovieModal";
import NowPlaying from "../Components/movie/NowPlaying";
import Popular from "../Components/movie/Popular";
import TopRated from "../Components/movie/TopRated";
import Upcoming from "../Components/movie/Upcoming";

const Wrapper = styled.div`
  background-color: black;
  min-height: 230vh;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const rowVariants: Variants = {
//   hidden: { x: window.innerWidth + 5 },
//   visible: { x: 0 },
//   exit: { x: -window.innerWidth - 5 },
// };

function Home() {
  const movieMatch = useRouteMatch<{ category: string; movieId: string }>(
    "/movies/:category/:movieId"
  );
  const fetchingCount = useIsFetching({ queryKey: ["movies"] });

  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (fetchingCount === 0) {
      setInitialLoading(false);
    }
  }, [fetchingCount]);

  return (
    <Wrapper>
      {initialLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <NowPlaying />
          <Popular />
          <TopRated />
          <Upcoming />
          <AnimatePresence>
            {movieMatch ? <MovieModal /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
