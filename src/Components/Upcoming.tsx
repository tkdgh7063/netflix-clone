import { useQuery } from "react-query";
import styled from "styled-components";
import { getUpcomingMovies, MoviesResultWithDates } from "../api";
import Slider from "./Slider";

const Container = styled.div`
  height: 200px;
  position: relative;
`;

const Title = styled.div`
  margin-bottom: 130px;
  padding-left: 60px;
  font-size: 24px;
  font-weight: 600;
`;

function Upcoming() {
  const { isLoading, data: upcomingMovies } = useQuery<MoviesResultWithDates>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Container>
      <Title>Upcoming Movies</Title>
      <Slider category="upcoming" movies={upcomingMovies!.results} />
    </Container>
  );
}

export default Upcoming;
