import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useIsFetching } from "react-query";
import { useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import Airing from "../Components/tv/Airing";
import OnTheAir from "../Components/tv/OntheAir";
import Popular from "../Components/tv/Popular";
import TopRated from "../Components/tv/TopRated";
import TvModal from "../Components/tv/TvModal";

const Wrapper = styled.div`
  background-color: black;
  min-height: 230vh;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Tv() {
  const tvMatch = useRouteMatch<{ category: string; tvId: string }>(
    "/tv/:category/:tvId"
  );

  const fetchingCount = useIsFetching({ queryKey: ["tv"] });
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (fetchingCount === 0) {
      setInitialLoading(false);
    }
  }, [fetchingCount]);

  return (
    <Wrapper>
      {initialLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Airing />
          <Popular />
          <TopRated />
          <OnTheAir />
          <AnimatePresence>{tvMatch ? <TvModal /> : null}</AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
