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

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface BaseMedia {
  id: number;
  backdrop_path: string | null;
  poster_path: string | null;
  overview: string;
  popularity: number;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  adult: boolean;
  original_language: string;
}

export interface Movie extends BaseMedia {
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  belongs_to_collection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface TV extends BaseMedia {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export interface TVDetail extends Omit<TV, "genre_ids"> {}

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

interface KnownForMedia extends Omit<Movie, "title" | "release_date"> {
  media_type: "movie" | "tv";
  title?: string;
  release_date?: string;
}

export interface PaginatedResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MoviesResultWithDates extends PaginatedResult<Movie> {
  dates: {
    maximum: string;
    minimum: string;
  };
}

export type MovieSearchResult = Movie & { media_type: "movie" };
export type TVSearchResult = TV & { media_type: "tv" };
export type PersonSearchResult = Person & { media_type: "person" };
export type MultiSearchResult =
  | MovieSearchResult
  | TVSearchResult
  | PersonSearchResult;

export type MultiResult = PaginatedResult<MultiSearchResult>;

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

export interface VideoSearchResult {
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
    `${BASE_URL}/movie/popular?language=en-US&page=1&region=kr`,
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
