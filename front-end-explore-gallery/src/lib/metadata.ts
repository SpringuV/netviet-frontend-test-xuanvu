// lib/metadata.ts
export type Post = {
  title: string;
  description: string;
};

export async function getPostMetadata(slug: string): Promise<Post> {
  const res = await fetch(`https://api.vercel.app/blog/${slug}`);
  if (!res.ok) {
    return { title: "Explore Gallery", description: "Explore the best galleries" };
  }
  const post = await res.json();
  return {
    title: post.title,
    description: post.description,
  };
}
