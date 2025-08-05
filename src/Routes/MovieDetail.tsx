import { useParams } from "react-router-dom";

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  return <h1>{movieId} Details</h1>;
}

export default MovieDetailPage;
