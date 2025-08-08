import { motion, useScroll, useTransform } from "motion/react";
import { useQuery } from "react-query";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieById,
  getVideoByMovieId,
  MovieDetail,
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

const MovieDetailContainer = styled(motion.div)`
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

const MovieDetailCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const MovieDetailVideo = styled.iframe`
  height: 400px;
  width: 100%;
`;

const MovieDetailTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  padding: 10px;
`;

const MovieDetailOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const MovieDetailLink = styled(Link)`
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

function MovieModal() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const movieInfoY = useTransform(scrollY, (latest) => latest + 100);

  const homeMatch = useRouteMatch<{ category: string; movieId: string }>(
    "/movies/:category/:movieId"
  );
  const similarMatch = useRouteMatch<{
    movieId: string;
    similarMovieId: string;
  }>("/movie/:movieId/detail/similar/:similarMovieId");

  const movieMatch = homeMatch ?? similarMatch;
  const movieId =
    homeMatch?.params.movieId ?? similarMatch?.params.similarMovieId;

  const onMovieEscape = () => {
    history.goBack();
  };

  const numericMovieId = Number(movieId);
  const { isLoading: movieLoading, data: movie } = useQuery<MovieDetail>({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(numericMovieId!),
    enabled: numericMovieId !== undefined && !Number.isNaN(numericMovieId),
    staleTime: Infinity,
  });

  const { isLoading: videoLoading, data: videos } = useQuery<VideoSearchResult>(
    {
      queryKey: ["videos", numericMovieId],
      queryFn: () => getVideoByMovieId(numericMovieId!),
      enabled: numericMovieId !== undefined && !Number.isNaN(numericMovieId),
      staleTime: Infinity,
    }
  );

  const trailerUrl =
    videos && videos.results ? getTrailerVideoUrl(videos.results) : null;

  return movieLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Overlay
        onClick={onMovieEscape}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      {movieMatch && (
        <MovieDetailContainer
          layoutId={
            "category" in movieMatch?.params
              ? makeLayoutId(
                  movieMatch.params.category,
                  movieMatch.params.movieId
                )
              : makeLayoutId("similar", movieMatch.params.movieId)
          }
          style={{ top: movieInfoY }}>
          {movie && (
            <>
              {!videoLoading && trailerUrl ? (
                <MovieDetailVideo
                  src={trailerUrl}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <MovieDetailCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(
                ${
                  movie.backdrop_path ? makeImagePath(movie.backdrop_path) : ""
                })`,
                  }}></MovieDetailCover>
              )}
              <MovieDetailTitle>{movie.title}</MovieDetailTitle>
              <MovieDetailOverview>
                {movie.overview ?? "No overview found for this movie"}
              </MovieDetailOverview>
              <MovieDetailLink to={`/movie/${movie.id}/detail`}>
                More Details
              </MovieDetailLink>
            </>
          )}
        </MovieDetailContainer>
      )}
    </>
  );
}

export default MovieModal;
