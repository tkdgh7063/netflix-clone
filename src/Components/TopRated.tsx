import { useQuery } from "react-query";
import styled from "styled-components";
import { getTopRatedMovies, Movie, PaginatedResult } from "../api";
import Slider from "./Slider";

const Container = styled.div`
  height: 200px;
  position: relative;
  margin-bottom: 110px;
`;

const Title = styled.div`
  margin-bottom: 130px;
  padding-left: 60px;
  font-size: 24px;
  font-weight: 600;
`;

function TopRated() {
  const { isLoading, data: topRatedMovies } = useQuery<PaginatedResult<Movie>>(
    ["movies", "topRated"],
    getTopRatedMovies,
    { staleTime: Infinity }
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Container>
      <Title>Top Rated Movies</Title>
      <Slider category="topRated" movies={topRatedMovies!.results} />
    </Container>
  );
}

export default TopRated;
