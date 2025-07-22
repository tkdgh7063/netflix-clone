const IMG_URL = "https://image.tmdb.org/t/p";

export function makeImagePath(id: string, format?: string) {
  return `${IMG_URL}/${format ? format : "original"}/${id}`;
}
