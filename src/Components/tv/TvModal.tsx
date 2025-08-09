import { motion, useScroll, useTransform } from "motion/react";
import { useQuery } from "react-query";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import {
  getTvByTvId,
  getVideoByTvId,
  TVDetail,
  VideoSearchResult,
} from "../../api";
import { getTrailerVideoUrl, makeImagePath, makeLayoutId } from "../../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const TvDetailContainer = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const TvDetailCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const TvDetailVideo = styled.iframe`
  height: 400px;
  width: 100%;
`;

const TvDetailTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  padding: 10px;
`;

const TvDetailOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const TvDetailLink = styled(Link)`
  background-color: white;
  width: 110px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  position: absolute;
  bottom: 30px;
  left: 18px;
`;

function TvModal() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const tvInfoY = useTransform(scrollY, (latest) => latest + 100);

  const tvShowMatch = useRouteMatch<{ category: string; tvId: string }>(
    "/tv/:category/:tvId"
  );
  const similarMatch = useRouteMatch<{ tvId: string; similarTvId: string }>(
    "/tv/:tvId/detail/similar/:similarTvId"
  );

  const tvMatch = tvShowMatch ?? similarMatch;
  const tvId = tvShowMatch?.params.tvId ?? similarMatch?.params.similarTvId;

  const onMovieEscape = () => {
    history.goBack();
  };

  const numericTvId = Number(tvId);
  const { isLoading: tvLoading, data: tv } = useQuery<TVDetail>({
    queryKey: ["tv", tvId],
    queryFn: () => getTvByTvId(numericTvId!),
    enabled: numericTvId !== undefined && !Number.isNaN(numericTvId),
    staleTime: Infinity,
  });

  const { isLoading: videoLoading, data: videos } = useQuery<VideoSearchResult>(
    {
      queryKey: ["videos", numericTvId],
      queryFn: () => getVideoByTvId(numericTvId!),
      enabled: numericTvId !== undefined && !Number.isNaN(numericTvId),
      staleTime: Infinity,
    }
  );

  const trailerUrl =
    videos && videos.results ? getTrailerVideoUrl(videos.results) : null;

  return tvLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Overlay
        onClick={onMovieEscape}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      {tvMatch && (
        <TvDetailContainer
          layoutId={
            "category" in tvMatch?.params
              ? makeLayoutId(tvMatch.params.category, tvMatch.params.tvId)
              : makeLayoutId("similar", tvMatch.params.tvId)
          }
          style={{ top: tvInfoY }}>
          {tv && (
            <>
              {!videoLoading && trailerUrl ? (
                <TvDetailVideo
                  src={trailerUrl}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <TvDetailCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(
                    ${
                      tv.backdrop_path ? makeImagePath(tv.backdrop_path) : ""
                    })`,
                  }}></TvDetailCover>
              )}
              <TvDetailTitle>{tv.name}</TvDetailTitle>
              <TvDetailOverview>
                {tv.overview ?? "No overview found for this tv"}
              </TvDetailOverview>
              <TvDetailLink to={`/tv/${tv.id}/detail`}>
                More Details
              </TvDetailLink>
            </>
          )}
        </TvDetailContainer>
      )}
    </>
  );
}

export default TvModal;
