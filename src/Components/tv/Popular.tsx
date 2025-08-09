import { useQuery } from "react-query";
import styled from "styled-components";
import { getPopularTv, PaginatedResult, TV } from "../../api";
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
  const { isLoading, data: popularMovies } = useQuery<PaginatedResult<TV>>(
    ["tv", "popular"],
    getPopularTv,
    { staleTime: Infinity }
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Container>
      <Title>Popular TV</Title>
      <Slider category="popular" tv={popularMovies!.results} />
    </Container>
  );
}

export default Popular;
