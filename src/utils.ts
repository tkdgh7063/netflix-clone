import { Video } from "./api";

const IMG_URL = "https://image.tmdb.org/t/p";
export const OFFSET = 6;

export function makeImagePath(id: string, format?: string): string {
  return `${IMG_URL}/${format ? format : "original"}/${id}`;
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getTrailerVideoUrl(videos: Video[]): string | null {
  const trailerVideos = videos.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  if (trailerVideos.length === 0) return null;

  const trailer =
    trailerVideos.length === 1
      ? trailerVideos[0]
      : trailerVideos.sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
        )[0];
  return `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`;
}
