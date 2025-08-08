import { useQuery } from "react-query";
import { styled } from "styled-components";
import { getNowPlayingMovies, MoviesResultWithDates } from "../../api";
import { makeImagePath } from "../../utils";
import Slider from "./Slider";

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

function NowPlaying() {
  const { isLoading, data: nowPlayingMovies } = useQuery<MoviesResultWithDates>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies,
    { staleTime: Infinity }
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
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
      <Slider
        category="nowPlaying"
        movies={nowPlayingMovies!.results.slice(1)}
      />
    </Container>
  );
}

export default NowPlaying;
