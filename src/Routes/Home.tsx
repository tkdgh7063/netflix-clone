import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useIsFetching, useQuery } from "react-query";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
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
import { getTrailerVideoUrl, makeImagePath, makeLayoutId } from "../utils";

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

const MovieDetailLink = styled(Link)`
  background-color: white;
  width: 110px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  position: absolute;
  bottom: 30px;
  left: 18px;
`;

// const rowVariants: Variants = {
//   hidden: { x: window.innerWidth + 5 },
//   visible: { x: 0 },
//   exit: { x: -window.innerWidth - 5 },
// };

function Home() {
  const history = useHistory();
  const movieMatch = useRouteMatch<{ category: string; movieId: string }>(
    "/movies/:category/:movieId"
  );

  const { scrollY } = useScroll();
  const movieInfoY = useTransform(scrollY, (latest) => latest + 100);

  const fetchingCount = useIsFetching({ queryKey: ["movies"] });

  const numericMovieId = movieMatch?.params.movieId
    ? Number(movieMatch.params.movieId)
    : null;
  const { isLoading: videoLoading, data: videos } = useQuery<VideoSearchResult>(
    {
      queryKey: ["videos", numericMovieId],
      queryFn: () => getVideoByMovieId(numericMovieId!),
      enabled: !!numericMovieId,
    }
  );
  const { data: clickedMovie } = useQuery<MovieDetail>({
    queryKey: ["movie", movieMatch?.params.movieId],
    queryFn: () => getMovieById(numericMovieId!),
    enabled: !!numericMovieId,
  });

  const trailerUrl =
    videos && videos.results ? getTrailerVideoUrl(videos.results) : null;

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
          <NowPlaying />
          <Popular />
          <TopRated />
          <Upcoming />
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onMovieEscape}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetailContainer
                  layoutId={makeLayoutId(
                    movieMatch.params.category,
                    movieMatch.params.movieId
                  )}
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
                      <MovieDetailLink to={`/movie/${clickedMovie.id}/detail`}>
                        More Details
                      </MovieDetailLink>
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
