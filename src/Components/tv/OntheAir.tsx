import { useQuery } from "react-query";
import styled from "styled-components";
import { getOntheAirTv, PaginatedResult, TV } from "../../api";
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

function OnTheAir() {
  const { isLoading, data: ontheAirTv } = useQuery<PaginatedResult<TV>>(
    ["tv", "ontheAir"],
    getOntheAirTv,
    { staleTime: Infinity }
  );

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Container>
      <Title>On the Air TV</Title>
      <Slider category="ontheAir" tv={ontheAirTv!.results} />
    </Container>
  );
}

export default OnTheAir;
