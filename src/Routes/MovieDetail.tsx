import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieById,
  getSimilarByMovieId,
  Movie,
  MovieDetail,
  PaginatedResult,
} from "../api";
import MovieModal from "../Components/MovieModal";
import ScrollToTop from "../Components/ScrollToTop";
import Slider from "../Components/Slider";
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

const MovieDetailContainer = styled.div`
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

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const similarMovieMatch = useRouteMatch<{
    movieId: string;
    similarMovieId: string;
  }>("/movie/:movieId/detail/similar/:similarMovieId");
  const numericMovieId = Number(movieId);

  const { isLoading: movieLoading, data: movie } = useQuery<MovieDetail>({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(numericMovieId),
    enabled: !!numericMovieId,
    staleTime: Infinity,
  });

  const { isLoading: similarLoading, data: similar } = useQuery<
    PaginatedResult<Movie>
  >({
    queryKey: ["movie", movieId, "similar"],
    queryFn: () => getSimilarByMovieId(numericMovieId),
    enabled: !!numericMovieId,
    staleTime: Infinity,
  });

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isLoading = movieLoading || similarLoading || showLoader;

  return (
    <Wrapper>
      <ScrollToTop />
      {isLoading ? (
        <Loader>Loading Details...</Loader>
      ) : (
        <>
          <MovieDetailContainer>
            <Poster
              $bgPhoto={
                movie!.backdrop_path
                  ? makeImagePath(movie!.backdrop_path)
                  : movie!.poster_path
                  ? makeImagePath(movie!.poster_path)
                  : ""
              }
            />
            <DetailSection>
              <DetailRow>
                <span>Title: </span>
                <span>{movie!.title}</span>
              </DetailRow>
              <DetailRow>
                <span>Overview: </span>
                <span>{movie!.overview}</span>
              </DetailRow>
              <DetailRow>
                <span>Genres: </span>
                <span>{movie!.genres.map((g) => g.name).join(", ")}</span>
              </DetailRow>
              <DetailRow>
                <span>Runtime: </span>
                <span>{movie!.runtime} min</span>
              </DetailRow>
              <DetailRow>
                <span>Popularity: </span>
                <span>{movie!.popularity}</span>
              </DetailRow>
              <DetailRow>
                <span>Release Date: </span>
                <span>{movie!.release_date}</span>
              </DetailRow>
              <DetailRow>
                <span>Budget: </span>
                <span>${movie!.budget.toLocaleString()}</span>
              </DetailRow>
              <DetailRow>
                <span>Revenue: </span>
                <span>${movie!.revenue.toLocaleString()}</span>
              </DetailRow>
            </DetailSection>
          </MovieDetailContainer>
          <SimilarContainer>
            <Title>Similar Movies</Title>
            <Slider category="similar" movies={similar!.results} />
          </SimilarContainer>
          <AnimatePresence>
            {similarMovieMatch ? <MovieModal /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default MovieDetailPage;
