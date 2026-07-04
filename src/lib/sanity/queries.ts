export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage
}`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  body
}`;

export const POSTS_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current
}`;

export const EVENTS_QUERY = `*[_type == "event"] | order(date desc) {
  _id,
  title,
  slug,
  date,
  location,
  isOnline,
  link,
  description,
  mainImage
}`;
