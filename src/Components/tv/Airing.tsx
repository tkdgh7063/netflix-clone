import { useQuery } from "react-query";
import { styled } from "styled-components";
import { getAiringToday, PaginatedResult, TV } from "../../api";
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

function Airing() {
  const { isLoading, data: airingTv } = useQuery<PaginatedResult<TV>>(
    ["tv", "airing"],
    getAiringToday,
    {
      staleTime: Infinity,
    }
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Container>
      <Banner
        $bgPhoto={
          airingTv?.results[0].backdrop_path
            ? makeImagePath(airingTv?.results[0].backdrop_path)
            : ""
        }>
        <Title>{airingTv?.results[0].name}</Title>
        <Overview>{airingTv?.results[0].overview}</Overview>
      </Banner>
      <Slider category="Airing" tv={airingTv!.results.slice(1)} />
    </Container>
  );
}

export default Airing;
