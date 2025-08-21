import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getSimilarByTvId,
  getTvById,
  PaginatedResult,
  TV,
  TVDetail,
} from "../api";
import Slider from "../Components/tv/Slider";
import ScrollToTop from "../Components/ScrollToTop";
import TvModal from "../Components/tv/TvModal";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  height: 110vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 600;
`;

const TvDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 220px;
  margin-left: 56px;
  margin-top: 65px;
`;

const Poster = styled.div<{ $bgPhoto: string }>`
  height: 300px;
  width: 400px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  margin-bottom: 15px;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  &:nth-child(2) span:last-child {
    font-size: 18px;
  }
`;

const SimilarContainer = styled.div`
  position: relative;
`;

const Title = styled.div`
  position: absolute;
  top: -160px;
  left: 60px;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
`;

function TvDetailPage() {
  const { tvId } = useParams<{ tvId: string }>();
  const similartvMatch = useRouteMatch<{
    tvId: string;
    similarTvId: string;
  }>("/tv/:tvId/detail/similar/:similarTvId");
  const numerictvId = Number(tvId);

  const { isLoading: tvLoading, data: tv } = useQuery<TVDetail>({
    queryKey: ["tv", tvId],
    queryFn: () => getTvById(numerictvId),
    enabled: !!numerictvId,
    staleTime: Infinity,
  });

  const { isLoading: similarLoading, data: similar } = useQuery<
    PaginatedResult<TV>
  >({
    queryKey: ["tv", tvId, "similar"],
    queryFn: () => getSimilarByTvId(numerictvId),
    enabled: !!numerictvId,
    staleTime: Infinity,
  });

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isLoading = tvLoading || similarLoading || showLoader;

  return (
    <Wrapper>
      <ScrollToTop />
      {isLoading ? (
        <Loader>Loading Details...</Loader>
      ) : (
        <>
          <TvDetailContainer>
            <Poster
              $bgPhoto={
                tv!.backdrop_path
                  ? makeImagePath(tv!.backdrop_path)
                  : tv!.poster_path
                  ? makeImagePath(tv!.poster_path)
                  : ""
              }
            />
            <DetailSection>
              <DetailRow>
                <span>Title: </span>
                <span>{tv!.name}</span>
              </DetailRow>
              <DetailRow>
                <span>Overview: </span>
                <span>{tv!.overview}</span>
              </DetailRow>
              <DetailRow>
                <span>Genres: </span>
                <span>{tv!.genres.map((g) => g.name).join(", ")}</span>
              </DetailRow>
              <DetailRow>
                <span>Episode Runtime: </span>
                <span>{tv!.episode_run_time} min</span>
              </DetailRow>
              <DetailRow>
                <span>First Air Date: </span>
                <span>{tv!.first_air_date}</span>
              </DetailRow>
              <DetailRow>
                <span>Popularity: </span>
                <span>{tv!.popularity}</span>
              </DetailRow>
            </DetailSection>
          </TvDetailContainer>
          <SimilarContainer>
            <Title>Similar TV Shows</Title>
            <Slider category="similar" tv={similar!.results} />
          </SimilarContainer>
          <AnimatePresence>
            {similartvMatch ? <TvModal /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default TvDetailPage;
