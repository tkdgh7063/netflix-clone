import { AnimatePresence, motion, Variants } from "motion/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { MoviesResult } from "../api";
import useWindowDimensions from "../useWindowDimensions";
import { makeImagePath, OFFSET } from "../utils";

const Container = styled.div`
  height: 200px;
  position: relative;
  margin-bottom: 110px;
`;

const Title = styled.div`
  margin-bottom: 12px;
  padding-left: 60px;
  font-size: 24px;
  font-weight: 600;
`;

const SliderContainer = styled.div`
  padding: 0px 60px;
  position: relative;
`;

const Slider = styled.div`
  position: relative;
`;

const Button = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  top: 70px;
  z-index: 10;
`;

const Left = styled(Button)`
  left: 10px;
`;

const Right = styled(Button)`
  right: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  position: absolute;
`;

const Movie = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: red;
  height: 200px;
  color: white;
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
    y: -40,
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
  topRatedMovies: MoviesResult;
  setCategory: () => void;
}

function TopRated({ topRatedMovies, setCategory }: props) {
  const history = useHistory();
  const width = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const decrementIndex = () => {
    if (isExiting) return;
    setIsExiting(true);
    const maxIndex = Math.floor(topRatedMovies?.results.length / OFFSET);
    setIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
  };

  const incrementIndex = () => {
    if (isExiting) return;
    setIsExiting(true);
    const maxIndex = Math.floor(topRatedMovies?.results.length / OFFSET);
    setIndex((prev) => (prev + 1) % maxIndex);
  };

  const onMovieClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    setCategory();
  };

  return (
    <Container>
      <Title>Top Rated Movies</Title>
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
              {topRatedMovies?.results
                ?.slice(OFFSET * index, OFFSET * (index + 1))
                .map((movie) => (
                  <Movie
                    key={movie.id}
                    layoutId={"TopRated" + movie.id.toString()}
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
                  </Movie>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
        <Right onClick={incrementIndex}>&rarr;</Right>
      </SliderContainer>
    </Container>
  );
}

export default TopRated;
