const API_KEY = "8e10f53c68c8432ef818bb0878d02162";
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTEwZjUzYzY4Yzg0MzJlZjgxOGJiMDg3OGQwMjE2MiIsIm5iZiI6MTc1MzE3NDAzNi4xMjMwMDAxLCJzdWIiOiI2ODdmNTAxNDI3NGIwOTFmNzY1MjkzMmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oBpFSMZwwfAvBVA6T7IQPIRSPE0kUeGPhMBSqCbBMKQ";

const BASE_URL = "https://api.themoviedb.org/3";

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
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TV {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: KnownForMedia[];
}

interface KnownForMedia {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string;
  budget: number;
  genres: {
    id: number;
    name: string;
  };
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  };
  production_countries: {
    iso_3166_1: string;
    name: string;
  };
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  };
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type MovieResult = Movie & { media_type: "movie" };
export type TVResult = TV & { media_type: "tv" };
export type PersonResult = Person & { media_type: "person" };
type MultiSearchResult = MovieResult | TVResult | PersonResult;

export interface MultiResult {
  page: number;
  results: MultiSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface MoviesResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface DatesMoviesResult extends MoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface VideoResult {
  id: number;
  results: Video[];
}

export async function getNowPlayingMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?language=en-US&page=1&region=kr`,
    options
  );
  return await res.json();
}

export async function getPopularMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/popular?language=en-US&page=1`,
    options
  );
  return await res.json();
}

export async function getTopRatedMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?language=en-US&page=1`,
    options
  );
  return await res.json();
}

export async function getUpcomingMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?language=en-US&page=1`,
    options
  );
  return await res.json();
}

export async function getLatestMovies() {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${BASE_URL}/discover/movie?language=en-US&page=1&primary_release_date.lte=${today}&region=en-US&sort_by=primary_release_date.desc`,
    options
  );
  return await res.json();
}

export async function getMovieById(movieId: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?language=en-US`,
    options
  );
}

export async function getMultiSearch(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/multi?query=${query}&language=en-US&page=1`,
    options
  );
  return await res.json();
}

export async function getVideoByMovieId(movieId: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?language=en-US`,
    options
  );
  return await res.json();
}
