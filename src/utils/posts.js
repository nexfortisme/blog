// Shared helpers for loading and displaying posts from the content repo.

const CONTENT_BASE =
  "https://raw.githubusercontent.com/nexfortisme/content/refs/heads/main";

export const POSTS_INDEX_URL = `${CONTENT_BASE}/index.json`;
export const TAG_INDEX_URL = `${CONTENT_BASE}/tag_index.json`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The Go indexer writes Go's zero time for posts without a date
export function formatDate(dateString) {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") return "";
  const date = new Date(dateString);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

// Rough reading time at ~225 words per minute
export function readingTime(markdown) {
  if (!markdown) return "";
  const words = markdown.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 225))} min read`;
}
