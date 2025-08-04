import { AnimatePresence, motion, Variants } from "motion/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { styled } from "styled-components";
import { getNowPlayingMovies, MoviesResultWithDates } from "../api";
import useWindowDimensions from "../useWindowDimensions";
import { makeImagePath, OFFSET } from "../utils";

const Container = styled.div`
  margin-bottom: 150px;
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

const SliderContainer = styled.div`
  padding: 0px 60px;
  position: relative;
`;

const Slider = styled.div`
  position: relative;
  top: -110px;
`;

const Button = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  bottom: -10px;
  z-index: 10;
`;

const Left = styled(Button)`
  left: 0;
`;

const Right = styled(Button)`
  right: 0;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const MovieBox = styled(motion.div)<{ $bgPhoto: string }>`
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

interface props {
  setCategory: () => void;
}

function NowPlaying({ setCategory }: props) {
  const history = useHistory();
  const width = useWindowDimensions();

  const { isLoading, data: nowPlayingMovies } = useQuery<MoviesResultWithDates>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const decrementIndex = () => {
    if (nowPlayingMovies) {
      if (isExiting) return;
      setIsExiting(true);
      const totalMovies = nowPlayingMovies?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET);
      setIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
    }
  };

  const incrementIndex = () => {
    if (nowPlayingMovies) {
      if (isExiting) return;
      setIsExiting(true);
      const totalMovies = nowPlayingMovies?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET);
      setIndex((prev) => (prev + 1) % maxIndex);
    }
  };

  const onMovieClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    setCategory();
  };

  return (
    <Container>
      <Banner
        $bgPhoto={
          nowPlayingMovies?.results[0].backdrop_path
            ? makeImagePath(nowPlayingMovies?.results[0].backdrop_path)
            : ""
        }>
        <Title>{nowPlayingMovies?.results[0].title}</Title>
        <Overview>{nowPlayingMovies?.results[0].overview}</Overview>
      </Banner>
      <SliderContainer>
        <Left onClick={decrementIndex}>&larr;</Left>
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
              {nowPlayingMovies?.results
                ?.slice(1)
                .slice(OFFSET * index, OFFSET * (index + 1))
                .map((movie) => (
                  <MovieBox
                    key={movie.id}
                    layoutId={"NP" + movie.id.toString()}
                    style={{ overflow: "hidden" }}
                    variants={MovieVariants}
                    initial="normal"
                    onClick={() => onMovieClick(movie.id)}
                    whileHover="hover"
                    $bgPhoto={
                      movie.backdrop_path
                        ? makeImagePath(movie.backdrop_path)
                        : ""
                    }>
                    <MovieOverlay variants={overlayVariants} />
                    <MovieInfo variants={MovieInfoVariants}>
                      <h4>{movie.title}</h4>
                    </MovieInfo>
                  </MovieBox>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
        <Right onClick={incrementIndex}>&rarr;</Right>
      </SliderContainer>
    </Container>
  );
}

export default NowPlaying;
