import { useState } from "react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, MoviesResult } from "../api";
import { makeImagePath } from "../utils";
import useWindowDimensions from "../useWindowDimensions";

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
  padding: 5px 8px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)),
    url(${(props) => props.$bgPhoto});
  background-position: center center;
  background-size: cover;
`;

// const rowVariants: Variants = {
//   hidden: { x: window.innerWidth + 5 },
//   visible: { x: 0 },
//   exit: { x: -window.innerWidth - 5 },
// };

const offset = 6;

function Home() {
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
                      $bgPhoto={makeImagePath(movie.backdrop_path)}
                      key={movie.id}>
                      {movie.title}
                    </Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
