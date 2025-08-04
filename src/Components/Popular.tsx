import { useQuery } from "react-query";
import styled from "styled-components";
import { getPopularMovies, Movie, PaginatedResult } from "../api";
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

function Popular() {
  const { isLoading, data: popularMovies } = useQuery<PaginatedResult<Movie>>(
    ["movies", "popular"],
    getPopularMovies
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Container>
      <Title>Popular Movies</Title>
      <Slider category="popular" movies={popularMovies!.results} />
    </Container>
  );
}

export default Popular;
