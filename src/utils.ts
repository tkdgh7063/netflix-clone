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
