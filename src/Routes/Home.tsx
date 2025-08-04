import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useIsFetching, useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieById,
  getVideoByMovieId,
  MovieDetail,
  VideoSearchResult,
} from "../api";
import NowPlaying from "../Components/NowPlaying";
import Popular from "../Components/Popular";
import TopRated from "../Components/TopRated";
import Upcoming from "../Components/Upcoming";
import { getTrailerVideoUrl, makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  min-height: 200vh;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieDetailContainer = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const MovieDetailCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const MovieDetailVideo = styled.iframe`
  height: 400px;
  width: 100%;
`;

const MovieDetailTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  padding: 10px;
`;

const MovieDetailOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

// const rowVariants: Variants = {
//   hidden: { x: window.innerWidth + 5 },
//   visible: { x: 0 },
//   exit: { x: -window.innerWidth - 5 },
// };

function Home() {
  const history = useHistory();
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const { scrollY } = useScroll();
  const movieInfoY = useTransform(scrollY, (latest) => latest + 100);

  const fetchingCount = useIsFetching({ queryKey: ["movies"] });

  const { isLoading: videoLoading, data: videos } = useQuery<VideoSearchResult>(
    ["videos", movieMatch?.params.movieId],
    () => getVideoByMovieId(+movieMatch!.params.movieId)
  );
  const trailerUrl =
    videos && videos.results ? getTrailerVideoUrl(videos.results) : null;

  const [category, setCategory] = useState("");
  const onMovieClick = (category: string) => setCategory(category);

  const movieId = movieMatch?.params.movieId;
  const numericMovieId = movieId ? Number(movieId) : null;
  const { data: clickedMovie } = useQuery<MovieDetail>({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(numericMovieId!),
    enabled: !!numericMovieId,
  });

  const onMovieEscape = () => {
    history.push("/");
  };

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
          <NowPlaying setCategory={() => onMovieClick("NP")} />
          <Popular setCategory={() => onMovieClick("Popular")} />
          <TopRated setCategory={() => onMovieClick("TopRated")} />
          <Upcoming setCategory={() => onMovieClick("Upcoming")} />
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onMovieEscape}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetailContainer
                  layoutId={category + movieMatch.params.movieId}
                  style={{ top: movieInfoY }}>
                  {clickedMovie && (
                    <>
                      {!videoLoading && trailerUrl ? (
                        <MovieDetailVideo
                          src={trailerUrl}
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <MovieDetailCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(
                              ${
                                clickedMovie.backdrop_path
                                  ? makeImagePath(clickedMovie.backdrop_path)
                                  : ""
                              })`,
                          }}></MovieDetailCover>
                      )}
                      <MovieDetailTitle>{clickedMovie.title}</MovieDetailTitle>
                      <MovieDetailOverview>
                        {clickedMovie.overview ??
                          "No overview found for this movie"}
                      </MovieDetailOverview>
                    </>
                  )}
                </MovieDetailContainer>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
