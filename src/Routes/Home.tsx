import { useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useScroll,
  useTransform,
  Variants,
} from "motion/react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, MoviesResult } from "../api";
import { makeImagePath } from "../utils";
import useWindowDimensions from "../useWindowDimensions";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  width: 40%;
  font-size: 18px;
  font-weight: 200;
`;

const Slider = styled.div`
  position: relative;
  top: -110px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Movie = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  height: 200px;
  color: white;
  font-size: 18px;
  font-weight: 400;
  background-image: url(${(props) => props.$bgPhoto});
  background-position: center center;
  background-size: cover;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const MovieOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: 5px;
`;

const MovieInfo = styled(motion.div)`
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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
`;

const MovieDetailTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  padding: 10px;
  position: relative;
  top: -60px;
`;

const MovieDetailOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;

// const rowVariants: Variants = {
//   hidden: { x: window.innerWidth + 5 },
//   visible: { x: 0 },
//   exit: { x: -window.innerWidth - 5 },
// };

const MovieVariants: Variants = {
  normal: { scale: 1, transition: { type: "tween" } },
  hover: {
    scale: 1.2,
    y: -50,
    transition: { type: "tween", delay: 0.5, duration: 0.3 },
  },
};

const overlayVariants: Variants = {
  normal: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { type: "tween", delay: 0.5, duration: 0.5 },
  },
};

const MovieInfoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: { type: "tween", delay: 0.5, duration: 0.2 },
  },
};

const offset = 6;

function Home() {
  const history = useHistory();
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const { scrollY } = useScroll();
  const movieInfoY = useTransform(scrollY, (latest) => latest + 100);

  const { data, isLoading } = useQuery<MoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const width = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const incrementIndex = () => {
    if (data) {
      if (isExiting) return;
      setIsExiting(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev + 1) % maxIndex);
    }
  };

  const onMovieClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onMovieEscape = () => {
    history.push("/");
  };

  const clickedMovie =
    movieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +movieMatch.params.movieId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incrementIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setIsExiting(false)}>
              <Row
                key={index}
                initial={{ x: width + 5 }}
                animate={{ x: 0 }}
                exit={{ x: -width - 5 }}
                transition={{ type: "tween", duration: 0.8 }}>
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * (index + 1))
                  .map((movie) => (
                    <Movie
                      key={movie.id}
                      layoutId={movie.id.toString()}
                      style={{ overflow: "hidden" }}
                      variants={MovieVariants}
                      initial="normal"
                      onClick={() => onMovieClick(movie.id)}
                      whileHover="hover"
                      $bgPhoto={makeImagePath(movie.backdrop_path)}>
                      <MovieOverlay variants={overlayVariants} />
                      <MovieInfo variants={MovieInfoVariants}>
                        <h4>{movie.title}</h4>
                      </MovieInfo>
                    </Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onMovieEscape}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetail
                  layoutId={movieMatch.params.movieId}
                  style={{ top: movieInfoY }}>
                  {clickedMovie && (
                    <>
                      <MovieDetailCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(
                            ${makeImagePath(clickedMovie.backdrop_path)}
                          )`,
                        }}
                      />
                      <MovieDetailTitle>{clickedMovie.title}</MovieDetailTitle>
                      <MovieDetailOverview>
                        {clickedMovie.overview}
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
