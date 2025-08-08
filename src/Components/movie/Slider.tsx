import { AnimatePresence, motion, Variants } from "motion/react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { Movie } from "../../api";
import useWindowDimensions from "../../useWindowDimensions";
import { makeImagePath, makeLayoutId, OFFSET } from "../../utils";

const SliderContainer = styled.div`
  padding: 0px 60px;
  position: relative;
`;

const MovieRow = styled.div`
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
  left: 10px;
`;

const Right = styled(Button)`
  right: 10px;
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
    transform-origin: center left !important;
  }
  &:last-child {
    transform-origin: center right !important;
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

const SliderVariants: Variants = {
  enter: ({ direction, width }: { direction: number; width: number }) => ({
    x: direction < 0 ? width + 5 : -width - 5,
  }),
  center: {
    x: 0,
  },
  exit: ({ direction, width }: { direction: number; width: number }) => ({
    x: direction > 0 ? width + 5 : -width - 5,
  }),
};

const MovieVariants: Variants = {
  normal: {
    scale: 1,
    y: 0,
    transition: { type: "tween" },
  },
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

interface SliderProps {
  category: string;
  movies: Movie[];
}
const Slider = ({ category, movies }: SliderProps) => {
  const history = useHistory();
  const width = useWindowDimensions();

  const similar = useRouteMatch<{ movieId: string }>("/movie/:movieId/detail");

  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState(0);

  const decrementIndex = () => {
    if (movies) {
      if (isExiting) return;
      setDirection(1);
      setIsExiting(true);
      const maxIndex = Math.floor(movies.length / OFFSET);
      setIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
    }
  };

  const incrementIndex = () => {
    if (movies) {
      if (isExiting) return;
      setDirection(-1);
      setIsExiting(true);
      const maxIndex = Math.floor(movies.length / OFFSET);
      setIndex((prev) => (prev + 1) % maxIndex);
    }
  };

  const onMovieClick = (movieId: number) => {
    if (similar) {
      history.push(
        `/movie/${similar.params.movieId}/detail/similar/${movieId}`
      );
    } else history.push(`/movies/${category}/${movieId}`);
  };

  return (
    <SliderContainer>
      <Left onClick={decrementIndex}>&larr;</Left>
      <MovieRow>
        <AnimatePresence
          initial={false}
          custom={{ direction, width }}
          onExitComplete={() => setIsExiting(false)}>
          <Row
            key={index}
            variants={SliderVariants}
            custom={{ direction, width }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.8 }}>
            {movies.slice(OFFSET * index, OFFSET * (index + 1)).map((movie) => (
              <MovieBox
                key={movie.id}
                layoutId={makeLayoutId(category, movie.id.toString())}
                style={{ overflow: "hidden" }}
                variants={MovieVariants}
                initial="normal"
                animate="normal"
                whileHover="hover"
                onClick={() => onMovieClick(movie.id)}
                $bgPhoto={
                  movie.backdrop_path
                    ? makeImagePath(movie.backdrop_path)
                    : movie.poster_path
                    ? makeImagePath(movie.poster_path)
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
      </MovieRow>
      <Right onClick={incrementIndex}>&rarr;</Right>
    </SliderContainer>
  );
};

export default Slider;
