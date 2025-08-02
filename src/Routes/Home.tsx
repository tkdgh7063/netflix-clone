import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  Variants,
} from "motion/react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  DatesMoviesResult,
  getLatestMovies,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getVideoByMovieId,
  MoviesResult,
  VideoResult,
} from "../api";
import { getTrailerVideoUrl, makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import NowPlaying from "../Components/NowPlaying";
import Latest from "../Components/Latest";
import Popular from "../Components/Popular";
import TopRated from "../Components/TopRated";
import Upcoming from "../Components/Upcoming";

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

const MovieDetail = styled(motion.div)`
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
  width: 100%;
  height: 400px;
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

const offset = 6;

function Home() {
  const history = useHistory();
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const { scrollY } = useScroll();
  const movieInfoY = useTransform(scrollY, (latest) => latest + 100);

  const useMultipleQuery = () => {
    const nowPlaying = useQuery<DatesMoviesResult>(
      ["movies", "nowPlaying"],
      getNowPlayingMovies
    );
    const latest = useQuery<MoviesResult>(
      ["movies", "latest"],
      getLatestMovies
    );
    const topRated = useQuery<MoviesResult>(
      ["movies", "topRated"],
      getTopRatedMovies
    );
    const upcoming = useQuery<DatesMoviesResult>(
      ["movies", "upcoming"],
      getUpcomingMovies
    );
    const popular = useQuery<MoviesResult>(
      ["movies", "popular"],
      getPopularMovies
    );
    return [nowPlaying, latest, topRated, upcoming, popular];
  };

  const [
    { isLoading: nowPlayingLoading, data: nowPlayingMovies },
    { isLoading: latestLoading, data: latestMovies },
    { isLoading: topRatedLoading, data: topRatedMovies },
    { isLoading: upcomingLoading, data: upcomingMovies },
    { isLoading: popularLoading, data: popularMovies },
  ] = useMultipleQuery();

  const { isLoading: videoLoading, data: videos } = useQuery<VideoResult>(
    ["videos", movieMatch?.params.movieId],
    () => getVideoByMovieId(+movieMatch!.params.movieId)
  );

  const [category, setCategory] = useState("");
  const onMovieClick = (category: string) => setCategory(category);

  const clickedMovie =
    movieMatch?.params.movieId &&
    (nowPlayingMovies?.results.find(
      (movie) => movie.id === +movieMatch.params.movieId
    ) ||
      latestMovies?.results.find(
        (movie) => movie.id === +movieMatch.params.movieId
      ) ||
      popularMovies?.results.find(
        (movie) => movie.id === +movieMatch.params.movieId
      ) ||
      topRatedMovies?.results.find(
        (movie) => movie.id === +movieMatch.params.movieId
      ) ||
      upcomingMovies?.results.find(
        (movie) => movie.id === +movieMatch.params.movieId
      ));

  const onMovieEscape = () => {
    history.push("/");
  };

  return (
    <Wrapper>
      {nowPlayingLoading &&
      latestLoading &&
      popularLoading &&
      topRatedLoading &&
      upcomingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <NowPlaying
            nowPlayingMovies={nowPlayingMovies!}
            setCategory={() => onMovieClick("NP")}
          />
          {/* <Latest
            latestMovies={latestMovies!}
            setCategory={() => onMovieClick("Latest")}
          /> */}
          <Popular
            popularMovies={popularMovies!}
            setCategory={() => onMovieClick("Popular")}
          />
          <TopRated
            topRatedMovies={topRatedMovies!}
            setCategory={() => onMovieClick("TopRated")}
          />
          <Upcoming
            upcomingMovies={upcomingMovies!}
            setCategory={() => onMovieClick("Upcoming")}
          />
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onMovieEscape}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetail
                  layoutId={category + movieMatch.params.movieId}
                  style={{ top: movieInfoY }}>
                  {clickedMovie && (
                    <>
                      {videoLoading ? (
                        <MovieDetailCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(
                            ${
                              clickedMovie.backdrop_path
                                ? makeImagePath(clickedMovie.backdrop_path)
                                : ""
                            }
                          )`,
                          }}>
                          <MovieDetailTitle>
                            {clickedMovie.title}
                          </MovieDetailTitle>
                        </MovieDetailCover>
                      ) : (
                        <MovieDetailVideo
                          src={getTrailerVideoUrl(videos!.results) ?? ""}
                          frameBorder="0"
                          allowFullScreen
                        />
                      )}
                      <MovieDetailTitle>{clickedMovie.title}</MovieDetailTitle>
                      <MovieDetailOverview>
                        {clickedMovie.overview ||
                          "No overview found for this movie"}
                      </MovieDetailOverview>
                    </>
                  )}
                </MovieDetail>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
