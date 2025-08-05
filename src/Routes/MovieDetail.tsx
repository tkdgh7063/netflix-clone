import { useParams } from "react-router-dom";

function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>();
  return <h1>{movieId} Details</h1>;
}

export default MovieDetail;
