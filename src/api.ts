const API_KEY = "8e10f53c68c8432ef818bb0878d02162";
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTEwZjUzYzY4Yzg0MzJlZjgxOGJiMDg3OGQwMjE2MiIsIm5iZiI6MTc1MzE3NDAzNi4xMjMwMDAxLCJzdWIiOiI2ODdmNTAxNDI3NGIwOTFmNzY1MjkzMmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oBpFSMZwwfAvBVA6T7IQPIRSPE0kUeGPhMBSqCbBMKQ";
const BASE_URL = "https://api.themoviedb.org/3/";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

export interface Movie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  //   adult: boolean;
  //   genre_ids: number[];
  //   original_language: string;
  //   original_title: string;
  //   popularity: number;
  //   release_date: string;
  //   video: boolean;
  //   vote_average: number;
  //   vote_count: number;
}

export interface MoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?language=en-US&page=1&region=kr`,
    options
  );
  return await res.json();
}
