import styled from "styled-components";
import { MoviesResult } from "../api";

const Container = styled.div`
  height: 200px;
  position: relative;
`;

function Latest(LatestMovie: MoviesResult) {
  return <Container>Latest Movies</Container>;
}

export default Latest;
